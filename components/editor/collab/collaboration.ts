import {
  CaptureUpdateAction,
  hashElementsVersion,
  isInvisiblySmallElement,
  reconcileElements,
  restoreElements,
  zoomToFitBounds,
} from "@excalidraw/excalidraw"
import type { RemoteExcalidrawElement } from "@excalidraw/excalidraw/data/reconcile"
import type {
  ExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types"
import type {
  Collaborator,
  ExcalidrawImperativeAPI,
  SocketId,
} from "@excalidraw/excalidraw/types"
import { bumpVersion, getVisibleSceneBounds } from "@excalidraw/element"

import { avatarUrl } from "@/lib/avatar"

// A trimmed-down port of Excalidraw's own collaboration client
// (../excalidraw/excalidraw-app/collab/Collab.tsx and Portal.tsx), over a plain
// WebSocket to the relay in the backend's function/realtime.py. No encryption
// or Firebase: the server controls access and saving stays on PUT .../scene.
// Members connect through /drawings/{id}/live, guests on a public link
// through /share/{token}/live; both land in the drawing's one room.

// "unavailable": the server refused us (logged out, lost access); retrying
// won't help.
type ConnectionStatus = "connecting" | "live" | "offline" | "unavailable"

// `guest`: came in through a public link rather than as a member.
// `avatarVersion`: their profile picture, as of connecting (see avatarUrl).
type Peer = {
  id: SocketId
  userId: string
  name: string
  avatarVersion: number | null
  guest: boolean
}

type SceneBounds = [number, number, number, number]

type PointerMessage = {
  type: "pointer"
  id: SocketId
  pointer: Collaborator["pointer"]
  button: Collaborator["button"]
  selectedElementIds: Collaborator["selectedElementIds"]
}

// What the backend sends; see function/realtime.py.
type ServerMessage =
  | { type: "welcome"; id: SocketId; role: string; peers: Peer[] }
  | { type: "peers"; peers: Peer[] }
  | { type: "peer-joined"; id: SocketId }
  | { type: "scene"; elements: RemoteExcalidrawElement[] }
  | PointerMessage
  | { type: "followers"; ids: string[] }
  | { type: "viewport"; id: SocketId; sceneBounds: SceneBounds }

type PointerUpdate = {
  pointer: { x: number; y: number; tool: "pointer" | "laser" }
  button: "down" | "up"
}

// Deleted elements stop being sent this long after deletion, as in Excalidraw.
const DELETED_ELEMENT_TIMEOUT_MS = 24 * 60 * 60 * 1000
// Everyone re-sends their whole scene at most this often while editing, so a
// lost message can't leave people out of sync for long.
const FULL_SYNC_INTERVAL_MS = 20_000
const POINTER_INTERVAL_MS = 33
const RECONNECT_DELAYS_MS = [1_000, 2_000, 5_000, 10_000, 30_000]
// Pointer and viewport updates are skipped while this much is still waiting
// to go out; the next one will carry the latest position anyway.
const MAX_BUFFERED_BYTES = 256 * 1024

// By default through this site's /api rewrite, so the backend never has to be
// reachable from the internet. `realtimeUrl` points straight at the backend
// instead, for setups where that rewrite can't carry WebSockets.
// `apiBase` is /drawings/{id}, or /share/{token} for a guest, who also says
// what to be called.
function liveUrl(
  realtimeUrl: string,
  apiBase: string,
  guestName: string | null
) {
  const query = guestName ? `?${new URLSearchParams({ name: guestName })}` : ""
  const path = `${apiBase}/live${query}`
  if (realtimeUrl) {
    return realtimeUrl.replace(/^http/, "ws") + path
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
  return `${protocol}//${window.location.host}/api${path}`
}

function isSyncable(element: OrderedExcalidrawElement) {
  if (element.isDeleted) {
    return element.updated > Date.now() - DELETED_ELEMENT_TIMEOUT_MS
  }
  return !isInvisiblySmallElement(element)
}

// From Excalidraw's data/restore.ts, which the package doesn't export: when a
// remote copy won over a local one of the same or higher version, bump it so
// the change still reaches everyone holding the local copy.
function bumpElementVersions<T extends ExcalidrawElement>(
  elements: readonly T[],
  local: readonly ExcalidrawElement[]
) {
  const localById = new Map(local.map((el) => [el.id, el]))
  return elements.map((element) => {
    const localElement = localById.get(element.id)
    if (
      localElement &&
      (localElement.version > element.version ||
        (localElement.version === element.version &&
          localElement.versionNonce !== element.versionNonce))
    ) {
      return bumpVersion(element, localElement.version)
    }
    return element
  })
}

class Collaboration {
  private socket: WebSocket | null = null
  private api: ExcalidrawImperativeAPI | null = null
  // Counts calls to start, so one that was waiting knows it's been replaced.
  private starts = 0
  // Our id in the room, once the server has welcomed us.
  private ownId: SocketId | null = null
  private reconnectAttempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  // Element versions already sent to or received from the room, so updates
  // only carry what changed.
  private sharedVersions = new Map<string, number>()
  // Hash of the scene as last sent or received; onChange fires for every
  // remote update too, and this stops those from being echoed back.
  private lastSceneHash: number | null = null
  private lastFullSyncAt = 0
  private collaborators = new Map<SocketId, Collaborator>()
  private followers: string[] = []
  private following: SocketId | null = null
  private pendingPointer: PointerUpdate | null = null
  private pointerTimer: ReturnType<typeof setTimeout> | null = null
  private viewportFrame: number | null = null

  constructor(
    // Settles once the drawing exists (see DrawingTarget).
    private readonly apiBase: Promise<string>,
    private readonly canEdit: boolean,
    private readonly realtimeUrl: string,
    // What a guest on a public link wants to be called; null for members.
    private readonly guestName: string | null,
    private readonly callbacks: {
      onStatus: (status: ConnectionStatus) => void
      // The person being followed left or the connection dropped.
      onFollowEnded: () => void
    }
  ) {}

  start(api: ExcalidrawImperativeAPI) {
    this.stop()
    this.api = api
    const start = (this.starts += 1)
    // A new drawing has no room to join until its first save creates it.
    void this.apiBase.then((apiBase) => {
      if (this.api && start === this.starts) {
        this.connect(apiBase)
      }
    })
  }

  stop() {
    const socket = this.socket
    // Cleared first so the close handler knows this one was on purpose.
    this.socket = null
    socket?.close(1000)
    this.api = null
    this.ownId = null
    for (const timer of [this.reconnectTimer, this.pointerTimer]) {
      if (timer) {
        clearTimeout(timer)
      }
    }
    this.reconnectTimer = this.pointerTimer = null
    if (this.viewportFrame !== null) {
      cancelAnimationFrame(this.viewportFrame)
      this.viewportFrame = null
    }
  }

  onChange = (elements: readonly OrderedExcalidrawElement[]) => {
    if (!this.ownId || !this.canEdit) {
      return
    }
    const hash = hashElementsVersion(elements)
    if (hash === this.lastSceneHash) {
      return
    }
    this.lastSceneHash = hash
    this.shareScene(Date.now() - this.lastFullSyncAt > FULL_SYNC_INTERVAL_MS)
  }

  onPointerUpdate = (
    payload: PointerUpdate & { pointersMap: Map<unknown, unknown> }
  ) => {
    // Pinch-zooming isn't a cursor, as in Excalidraw.
    if (payload.pointersMap.size > 1) {
      return
    }
    this.pendingPointer = { pointer: payload.pointer, button: payload.button }
    this.pointerTimer ??= setTimeout(() => {
      this.pointerTimer = null
      this.sendPointer()
    }, POINTER_INTERVAL_MS)
  }

  onScrollChange = () => {
    if (this.followers.length === 0 || this.viewportFrame !== null) {
      return
    }
    this.viewportFrame = requestAnimationFrame(() => {
      this.viewportFrame = null
      this.shareViewport()
    })
  }

  follow(id: SocketId | null) {
    if (id === this.following) {
      return
    }
    this.following = id
    this.send({ type: "follow", id })
  }

  private connect(apiBase: string) {
    this.callbacks.onStatus(this.reconnectAttempt ? "offline" : "connecting")
    const socket = new WebSocket(
      liveUrl(this.realtimeUrl, apiBase, this.guestName)
    )
    this.socket = socket

    socket.onmessage = (event) => {
      if (socket !== this.socket) {
        return
      }
      try {
        this.handle(JSON.parse(event.data))
      } catch (error) {
        console.error("Bad live message", error)
      }
    }
    socket.onclose = (event) => {
      if (socket !== this.socket) {
        // Stopped, or already replaced by a newer connection.
        return
      }
      this.socket = null
      this.ownId = null
      this.setPeers([])
      // 44xx: refused (logged out, no access). Anything else: try again.
      if (event.code >= 4400 && event.code < 4500) {
        this.callbacks.onStatus("unavailable")
        return
      }
      this.callbacks.onStatus("offline")
      const delay =
        RECONNECT_DELAYS_MS[
          Math.min(this.reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)
        ]
      this.reconnectAttempt += 1
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null
        this.connect(apiBase)
      }, delay)
    }
  }

  private handle(message: ServerMessage) {
    switch (message.type) {
      case "welcome":
        this.ownId = message.id
        this.reconnectAttempt = 0
        this.setPeers(message.peers)
        this.callbacks.onStatus("live")
        // Anything changed while disconnected hasn't reached anyone yet.
        this.shareScene(true)
        break
      case "peers":
        this.setPeers(message.peers)
        break
      case "peer-joined":
        this.shareScene(true)
        break
      case "scene":
        this.receiveScene(message.elements)
        break
      case "pointer":
        this.receivePointer(message)
        break
      case "followers":
        this.followers = message.ids
        this.shareViewport()
        break
      case "viewport":
        this.receiveViewport(message.id, message.sceneBounds)
        break
    }
  }

  private send(message: object, { droppable = false } = {}) {
    const socket = this.socket
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return
    }
    if (droppable && socket.bufferedAmount > MAX_BUFFERED_BYTES) {
      return
    }
    socket.send(JSON.stringify(message))
  }

  private setPeers(peers: Peer[]) {
    const next = new Map<SocketId, Collaborator>()
    for (const peer of peers) {
      next.set(peer.id, {
        ...this.collaborators.get(peer.id),
        socketId: peer.id,
        id: peer.userId,
        username: peer.guest ? `${peer.name} (guest)` : peer.name,
        // The editor shows initials instead while it loads or if it fails.
        avatarUrl: avatarUrl(peer.userId, peer.avatarVersion),
        isCurrentUser: peer.id === this.ownId,
      })
    }
    this.collaborators = next
    this.api?.updateScene({ collaborators: next })

    if (this.following && !next.has(this.following)) {
      this.following = null
      this.callbacks.onFollowEnded()
    }
  }

  private shareScene(full: boolean) {
    if (!this.canEdit || !this.ownId || !this.api) {
      return
    }
    const elements = this.api
      .getSceneElementsIncludingDeleted()
      .filter(
        (el) =>
          (full || (this.sharedVersions.get(el.id) ?? -1) < el.version) &&
          isSyncable(el)
      )
    if (full) {
      this.lastFullSyncAt = Date.now()
    }
    if (elements.length === 0) {
      return
    }
    for (const el of elements) {
      this.sharedVersions.set(el.id, el.version)
    }
    this.send({ type: "scene", elements })
  }

  private receiveScene(remote: RemoteExcalidrawElement[]) {
    const api = this.api
    if (!api || !Array.isArray(remote)) {
      return
    }
    const local = api.getSceneElementsIncludingDeleted()
    const restored = restoreElements(remote, local)
    const reconciled = bumpElementVersions(
      reconcileElements(local, restored, api.getAppState()),
      local
    )
    for (const el of restored) {
      if ((this.sharedVersions.get(el.id) ?? -1) < el.version) {
        this.sharedVersions.set(el.id, el.version)
      }
    }
    this.lastSceneHash = hashElementsVersion(reconciled)
    // NEVER: other people's edits don't go on this user's undo stack.
    api.updateScene({
      elements: reconciled,
      captureUpdate: CaptureUpdateAction.NEVER,
    })
  }

  private sendPointer() {
    if (!this.ownId || !this.api || !this.pendingPointer) {
      return
    }
    this.send(
      {
        type: "pointer",
        ...this.pendingPointer,
        selectedElementIds: this.api.getAppState().selectedElementIds,
      },
      { droppable: true }
    )
    this.pendingPointer = null
  }

  private receivePointer(data: PointerMessage) {
    const collaborator = this.collaborators.get(data.id)
    if (!collaborator || !this.api) {
      return
    }
    this.collaborators.set(data.id, {
      ...collaborator,
      pointer: data.pointer,
      button: data.button,
      selectedElementIds: data.selectedElementIds,
    })
    this.api.updateScene({ collaborators: new Map(this.collaborators) })
  }

  private shareViewport() {
    if (!this.ownId || !this.api || !this.followers.length) {
      return
    }
    this.send(
      {
        type: "viewport",
        sceneBounds: getVisibleSceneBounds(this.api.getAppState()),
      },
      { droppable: true }
    )
  }

  private receiveViewport(id: SocketId, sceneBounds: SceneBounds) {
    const api = this.api
    if (!api || id !== this.following || !Array.isArray(sceneBounds)) {
      return
    }
    api.updateScene({
      appState: zoomToFitBounds({
        appState: api.getAppState(),
        bounds: sceneBounds,
        fit: "contain",
      }).appState,
      captureUpdate: CaptureUpdateAction.NEVER,
    })
  }
}

export { Collaboration }
export type { ConnectionStatus }
