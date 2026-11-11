"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { ImageFiles } from "@/components/editor/image-files"

// Uploads and downloads the drawing's images through `apiBase` (see
// DrawingTarget). Call `attach` from onExcalidrawAPI and `onChange` from the
// editor's onChange.
function useImageFiles(apiBase: Promise<string>, canEdit: boolean) {
  const [images] = useState(
    () =>
      new ImageFiles(apiBase, canEdit, (message) =>
        toast.error(`Couldn't upload image: ${message}`)
      )
  )

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (images.isUploading()) {
        event.preventDefault()
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
      images.attach(null)
    }
  }, [images])

  return images
}

export { useImageFiles }
