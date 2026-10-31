"use client"

import { cn } from "cn"
import { ImageUpIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { AvatarCropDialog } from "@/components/account/avatar-crop-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Strokes } from "@/components/sketch/strokes"
import { Tape } from "@/components/sketch/tape"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { apiFetch } from "@/lib/api"
import type { User } from "@/lib/auth"
import { avatarUrl } from "@/lib/avatar"
import { seedFrom, sketch } from "@/lib/sketch"

// Big photos are fine: they're cropped and shrunk to 256×256 before upload.
const MAX_SOURCE_BYTES = 10 * 1024 * 1024

// The user's picture pinned to the page, with ways to change it: choose a
// file, or drop one on the picture.
function AvatarPicker({ user }: { user: User }) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dropping, setDropping] = useState(false)
  const [removing, setRemoving] = useState(false)
  const picture = avatarUrl(user.id, user.avatar_version)
  const ring = sketch.ellipse(72, 72, 136, 136, {
    seed: seedFrom(user.id),
    strokeWidth: 1.8,
  })

  function choose(chosen: File | undefined) {
    if (!chosen) {
      return
    }
    // SVGs could carry scripts, and the crop can't read them anyway.
    if (!chosen.type.startsWith("image/") || chosen.type === "image/svg+xml") {
      toast.error("Choose a photo or image, like a PNG or JPEG.")
    } else if (chosen.size > MAX_SOURCE_BYTES) {
      toast.error("That image is over 10 MB. Choose a smaller one.")
    } else {
      setFile(chosen)
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-4">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDropping(true)
        }}
        onDragLeave={() => setDropping(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDropping(false)
          choose(event.dataTransfer.files[0])
        }}
        className="relative grid size-36 place-items-center"
      >
        <svg
          aria-hidden
          viewBox="0 0 144 144"
          className={cn(
            "pointer-events-none absolute inset-0 size-full overflow-visible transition-colors",
            dropping ? "text-primary" : "text-foreground/60"
          )}
        >
          <Strokes paths={ring} />
        </svg>
        <Tape className="-top-1 left-1/2 -translate-x-1/2 -rotate-6" />
        <UserAvatar
          name={user.name}
          picture={picture}
          className="size-28 *:data-[slot=avatar-fallback]:text-4xl"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={() => input.current?.click()}>
          <ImageUpIcon data-icon="inline-start" />
          {picture ? "Change picture" : "Upload picture"}
        </Button>
        {picture && (
          <Button variant="ghost" onClick={() => setRemoving(true)}>
            Remove
          </Button>
        )}
      </div>
      <p className="max-w-48 text-center text-xs text-muted-foreground">
        Or drop an image on the circle. Anyone you draw with can see it.
      </p>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          choose(event.target.files?.[0])
          // So choosing the same file again still counts as a change.
          event.target.value = ""
        }}
      />

      {file && <AvatarCropDialog file={file} onClose={() => setFile(null)} />}
      <ConfirmDialog
        open={removing}
        onOpenChange={setRemoving}
        title="Remove your picture?"
        description="Your initials show instead, everywhere you appear."
        confirmLabel="Remove picture"
        onConfirm={async () => {
          await apiFetch("/account/avatar", { method: "DELETE" })
          toast.success("Picture removed")
          router.refresh()
        }}
      />
    </div>
  )
}

export { AvatarPicker }
