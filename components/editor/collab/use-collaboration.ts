"use client"

import type {
  ExcalidrawImperativeAPI,
  OnUserFollowedPayload,
  UserToFollow,
} from "@excalidraw/excalidraw/types"
import { useEffect, useState } from "react"

import {
  Collaboration,
  type ConnectionStatus,
} from "@/components/editor/collab/collaboration"

// Everyone with access to a drawing is connected to its room while it's open.
// Spread `editorProps` onto <Excalidraw>, call `attach` from its
// onExcalidrawAPI and `onChange` from its onChange.
function useCollaboration({
  apiBase,
  canEdit,
  realtimeUrl,
  guestName = null,
}: {
  // /drawings/{id}, or /share/{token} for a guest on a public link.
  apiBase: string
  canEdit: boolean
  realtimeUrl: string
  guestName?: string | null
}) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting")
  const [userToFollow, setUserToFollow] = useState<UserToFollow | null>(null)
  const [collaboration] = useState(
    () =>
      new Collaboration(apiBase, canEdit, realtimeUrl, guestName, {
        onStatus: setStatus,
        onFollowEnded: () => setUserToFollow(null),
      })
  )

  useEffect(() => () => collaboration.stop(), [collaboration])

  function followUser(user: UserToFollow | null) {
    setUserToFollow(user)
    collaboration.follow(user?.socketId ?? null)
  }

  return {
    status,
    onChange: collaboration.onChange,
    attach(api: ExcalidrawImperativeAPI | null) {
      if (api) {
        collaboration.start(api)
      } else {
        collaboration.stop()
      }
    },
    editorProps: {
      isCollaborating: status === "live",
      onPointerUpdate: collaboration.onPointerUpdate,
      onScrollChange: collaboration.onScrollChange,
      onUserFollow: ({ userToFollow, action }: OnUserFollowedPayload) =>
        followUser(action === "FOLLOW" ? userToFollow : null),
      userToFollow,
      viewportStatusFrame: userToFollow && {
        border: "var(--color-primary-hover)",
        label: {
          label: `Following ${userToFollow.username}`,
          onClose: () => followUser(null),
        },
      },
    },
  }
}

export { useCollaboration }
