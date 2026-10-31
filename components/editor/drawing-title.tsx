"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"

import { apiFetch, errorMessage } from "@/lib/api"

// Looks like text, edits like an input. Saves on Enter or blur; Escape undoes.
function DrawingTitle({
  drawingId,
  title,
  onRenamed,
}: {
  drawingId: string
  title: string
  onRenamed: (title: string) => void
}) {
  const [draft, setDraft] = useState(title)
  const cancelled = useRef(false)

  async function commit() {
    const next = draft.trim()
    if (cancelled.current || !next || next === title) {
      cancelled.current = false
      setDraft(title)
      return
    }
    try {
      await apiFetch(`/drawings/${drawingId}`, {
        method: "PATCH",
        body: { title: next },
      })
      onRenamed(next)
      setDraft(next)
    } catch (error) {
      toast.error(errorMessage(error))
      setDraft(title)
    }
  }

  return (
    <input
      aria-label="Drawing title"
      value={draft}
      maxLength={120}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur()
        } else if (event.key === "Escape") {
          cancelled.current = true
          event.currentTarget.blur()
        }
      }}
      className="field-sizing-content h-full max-w-60 min-w-16 truncate rounded-md bg-transparent px-2 font-hand text-xl outline-none hover:bg-muted focus:bg-muted"
    />
  )
}

export { DrawingTitle }
