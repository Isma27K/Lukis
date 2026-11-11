"use client"

import { ZoomInIcon, ZoomOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useTransition,
} from "react"
import { toast } from "sonner"

import { Strokes } from "@/components/sketch/strokes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch, errorMessage } from "@/lib/api"
import { sketch } from "@/lib/sketch"

// The crop square on screen, in CSS pixels, and the picture it becomes.
const STAGE = 256
const OUTPUT = 256
const MAX_ZOOM = 4
// How far the arrow keys move the picture (with Shift: further).
const NUDGE = 8

const RING = sketch.ellipse(STAGE / 2, STAGE / 2, STAGE - 6, STAGE - 6, {
  seed: 7,
  strokeWidth: 2,
  roughness: 0.8,
})

// Where the picture sits: zoom over "just covers the square", and its center
// relative to the square's, in CSS pixels.
type Framing = { zoom: number; x: number; y: number }

function coverScale(image: HTMLImageElement) {
  return STAGE / Math.min(image.naturalWidth, image.naturalHeight)
}

// Keeps the square covered: the picture can't be moved past its edges.
function clamp(image: HTMLImageElement, { zoom, x, y }: Framing): Framing {
  zoom = Math.min(Math.max(zoom, 1), MAX_ZOOM)
  const scale = coverScale(image) * zoom
  const maxX = (image.naturalWidth * scale - STAGE) / 2
  const maxY = (image.naturalHeight * scale - STAGE) / 2
  return {
    zoom,
    x: Math.min(Math.max(x, -maxX), maxX),
    y: Math.min(Math.max(y, -maxY), maxY),
  }
}

// Zooms around the middle of the square, so what's centered stays centered.
function zoomTo(image: HTMLImageElement, framing: Framing, zoom: number) {
  const ratio = zoom / framing.zoom
  return clamp(image, { zoom, x: framing.x * ratio, y: framing.y * ratio })
}

// The framed square, drawn at OUTPUT size. Browsers without WebP encoding
// hand back PNG instead; the backend takes either.
function render(image: HTMLImageElement, { zoom, x, y }: Framing) {
  const canvas = document.createElement("canvas")
  canvas.width = OUTPUT
  canvas.height = OUTPUT
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Canvas isn't available")
  }
  const scale = coverScale(image) * zoom
  const size = STAGE / scale
  context.imageSmoothingQuality = "high"
  context.drawImage(
    image,
    image.naturalWidth / 2 - x / scale - size / 2,
    image.naturalHeight / 2 - y / scale - size / 2,
    size,
    size,
    0,
    0,
    OUTPUT,
    OUTPUT
  )
  return canvas.toDataURL("image/webp", 0.9)
}

// Frames a chosen image in the circle avatars are shown in, then uploads it.
// Drag or use the arrow keys to move it; the wheel, slider or +/- zoom.
function AvatarCropDialog({
  file,
  onClose,
}: {
  file: File
  onClose: () => void
}) {
  const router = useRouter()
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [framing, setFraming] = useState<Framing>({ zoom: 1, x: 0, y: 0 })
  const [pending, startTransition] = useTransition()
  // The pointer's last position while dragging.
  const drag = useRef<{ x: number; y: number }>(null)

  const unreadable = useEffectEvent(() => {
    toast.error("Couldn't open that image. Try a PNG or JPEG.")
    onClose()
  })

  useEffect(() => {
    const url = URL.createObjectURL(file)
    const loading = new Image()
    loading.onload = () => setImage(loading)
    loading.onerror = unreadable
    loading.src = url
    return () => {
      loading.onload = loading.onerror = null
      URL.revokeObjectURL(url)
    }
  }, [file])

  // Updates from the latest framing, since keys and the wheel can fire
  // several times before a render.
  function move(dx: number, dy: number) {
    if (image) {
      setFraming((f) => clamp(image, { ...f, x: f.x + dx, y: f.y + dy }))
    }
  }

  function zoom(value: (zoom: number) => number) {
    if (image) {
      setFraming((f) => zoomTo(image, f, value(f.zoom)))
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const step = event.shiftKey ? NUDGE * 4 : NUDGE
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    if (event.key in moves) {
      move(...moves[event.key])
    } else if (event.key === "+" || event.key === "=") {
      zoom((zoom) => zoom * 1.1)
    } else if (event.key === "-") {
      zoom((zoom) => zoom / 1.1)
    } else {
      return
    }
    event.preventDefault()
  }

  function save() {
    if (!image) {
      return
    }
    startTransition(async () => {
      try {
        await apiFetch("/account/avatar", {
          method: "PUT",
          body: { data_url: render(image, framing) },
        })
        toast.success("Picture updated")
        onClose()
        router.refresh()
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  const scale = image ? coverScale(image) * framing.zoom : 1

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Frame your picture</DialogTitle>
          <DialogDescription>
            Drag it into place and zoom until it fits the circle.
          </DialogDescription>
        </DialogHeader>

        <div
          role="group"
          tabIndex={0}
          aria-label="Picture framing. Arrow keys move it, plus and minus zoom."
          onKeyDown={onKeyDown}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            drag.current = { x: event.clientX, y: event.clientY }
          }}
          onPointerMove={(event) => {
            const last = drag.current
            if (last) {
              move(event.clientX - last.x, event.clientY - last.y)
              drag.current = { x: event.clientX, y: event.clientY }
            }
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          onWheel={(event) => {
            const factor = Math.exp(-event.deltaY / 500)
            zoom((zoom) => zoom * factor)
          }}
          className="relative mx-auto size-64 cursor-grab touch-none overflow-hidden rounded-lg bg-muted select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid active:cursor-grabbing"
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local blob URL
            <img
              src={image.src}
              alt=""
              draggable={false}
              className="absolute top-1/2 left-1/2 max-w-none"
              style={{
                width: image.naturalWidth * scale,
                height: image.naturalHeight * scale,
                transform: `translate(-50%, -50%) translate(${framing.x}px, ${framing.y}px)`,
              }}
            />
          ) : (
            <Skeleton className="size-full" />
          )}
          {/* Paper veils everything outside the circle. */}
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_9999px_color-mix(in_oklab,var(--background)_70%,transparent)]" />
          <svg
            aria-hidden
            viewBox={`0 0 ${STAGE} ${STAGE}`}
            className="pointer-events-none absolute inset-0 size-full overflow-visible text-primary"
          >
            <Strokes paths={RING} />
          </svg>
        </div>

        <label className="flex items-center gap-3 text-muted-foreground">
          <ZoomOutIcon className="size-4 shrink-0" aria-hidden />
          <span className="sr-only">Zoom</span>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={framing.zoom}
            onChange={(event) => {
              const value = Number(event.target.value)
              zoom(() => value)
            }}
            disabled={!image}
            className="w-full accent-primary"
          />
          <ZoomInIcon className="size-4 shrink-0" aria-hidden />
        </label>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button onClick={save} disabled={!image || pending}>
            {pending ? "Saving…" : "Save picture"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { AvatarCropDialog }
