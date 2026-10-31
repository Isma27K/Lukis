import { UserAvatar } from "@/components/user-avatar"
import type { ListedDrawing } from "@/lib/types"

// "Ada · 2 hours ago", or "You · …" for your own changes. The backend may
// not know who (their account is gone, or an older server).
function editedByLabel(
  drawing: ListedDrawing,
  currentUserId: string,
  editedLabel: string
) {
  const editor = drawing.updated_by
  if (!editor) {
    return `Edited ${editedLabel}`
  }
  const who = editor.id === currentUserId ? "You" : editor.name
  return `${who} · ${editedLabel}`
}

function EditorAvatar({ drawing }: { drawing: ListedDrawing }) {
  if (!drawing.updated_by) {
    return null
  }
  return <UserAvatar name={drawing.updated_by.name} size="sm" />
}

export { EditorAvatar, editedByLabel }
