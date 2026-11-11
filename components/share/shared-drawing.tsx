"use client"

import { useRef, useState, useSyncExternalStore } from "react"

import { Editor } from "@/components/editor/editor"
import { TextInputDialog } from "@/components/text-input-dialog"
import type { Scene, ShareInfo } from "@/lib/types"

// What a guest asked to be called, kept in their browser. An empty string
// means they skipped the question, so it isn't asked again.
const GUEST_NAME_KEY = "lukis-guest-name"
// Matches MAX_GUEST_NAME in the backend's function/realtime.py.
const MAX_GUEST_NAME = 40

function readGuestName() {
  try {
    return localStorage.getItem(GUEST_NAME_KEY)
  } catch {
    return null
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange)
  return () => window.removeEventListener("storage", onChange)
}

// A drawing opened through its public link. Guests who can edit are asked
// once what others should call them; anyone logged in goes by their account
// name, and everyone else is "Guest".
function SharedDrawing({
  token,
  info,
  scene,
  realtimeUrl,
}: {
  token: string
  info: ShareInfo
  scene: Scene
  realtimeUrl: string
}) {
  // undefined on the server, where there's no localStorage.
  const stored = useSyncExternalStore(subscribe, readGuestName, () => undefined)
  const [answered, setAnswered] = useState<string | null>(null)
  // The dialog closes itself after a submit too, so closing is where the
  // answer lands: what they typed, or "" for skipping.
  const typed = useRef<string | null>(null)
  const name = answered ?? stored

  if (name === undefined) {
    return <div className="h-full dot-grid" />
  }
  if (name === null && info.access === "edit" && info.viewer_name === null) {
    const answer = (value: string) => {
      const trimmed = value.trim().slice(0, MAX_GUEST_NAME)
      try {
        localStorage.setItem(GUEST_NAME_KEY, trimmed)
      } catch {
        // Then they're asked again next time.
      }
      setAnswered(trimmed)
    }
    return (
      <div className="h-full dot-grid">
        <TextInputDialog
          open
          onOpenChange={(open) => !open && answer(typed.current ?? "")}
          title="What should others call you?"
          label="Your name, next to your cursor"
          maxLength={MAX_GUEST_NAME}
          submitLabel="Start drawing"
          cancelLabel="Skip"
          onSubmit={async (value) => {
            typed.current = value
          }}
        />
      </div>
    )
  }

  return (
    <Editor
      source={{ kind: "guest", token, info, guestName: name || null }}
      scene={scene}
      realtimeUrl={realtimeUrl}
    />
  )
}

export { SharedDrawing }
