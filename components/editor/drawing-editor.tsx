"use client"

import "@excalidraw/excalidraw/index.css"

import { Excalidraw, MainMenu, THEME } from "@excalidraw/excalidraw"
import { ArrowLeftIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { ConnectionIndicator } from "@/components/editor/collab/connection-indicator"
import { useCollaboration } from "@/components/editor/collab/use-collaboration"
import { DrawingTitle } from "@/components/editor/drawing-title"
import { SaveIndicator } from "@/components/editor/save-indicator"
import { useAutosave } from "@/components/editor/use-autosave"
import type { Drawing, Scene } from "@/lib/types"

type DrawingEditorProps = {
  drawing: Drawing
  scene: Scene
  // Where to open the realtime socket; "" means this origin.
  realtimeUrl: string
}

function DrawingEditor({ drawing, scene, realtimeUrl }: DrawingEditorProps) {
  const router = useRouter()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const readOnly = drawing.role === "viewer"
  const autosave = useAutosave(drawing.id, scene.elements, !readOnly)
  const collaboration = useCollaboration({
    drawingId: drawing.id,
    canEdit: !readOnly,
    realtimeUrl,
  })
  const [title, setTitle] = useState(drawing.title)
  // Excalidraw only reads initialData when it mounts.
  const [initialData] = useState(() => ({
    elements: scene.elements,
    appState: scene.app_state,
    scrollToContent: true,
  }))

  useEffect(() => {
    document.title = `${title} · Lukis`
  }, [title])

  async function backToDrawings() {
    // So the dashboard shows this drawing as just edited.
    await autosave.save()
    router.push(`/w/${drawing.workspace_id}`)
  }

  return (
    <Excalidraw
      {...collaboration.editorProps}
      initialData={initialData}
      onChange={(elements, appState) => {
        autosave.onChange?.(elements, appState)
        collaboration.onChange(elements)
      }}
      theme={resolvedTheme === "dark" ? THEME.DARK : THEME.LIGHT}
      onThemeChange={setTheme}
      viewModeEnabled={readOnly}
      name={title}
      // Pasted images need file storage, which doesn't exist yet.
      UIOptions={{ tools: { image: false } }}
      renderTopRightUI={() => (
        <div className="flex h-(--default-button-size) items-center gap-1 rounded-(--border-radius-lg) bg-(--island-bg-color) pr-2 shadow-(--shadow-island)">
          {readOnly ? (
            <span className="max-w-60 truncate px-2 text-sm">{title}</span>
          ) : (
            <>
              <DrawingTitle
                drawingId={drawing.id}
                title={title}
                onRenamed={setTitle}
              />
              <SaveIndicator status={autosave.status} />
            </>
          )}
          <ConnectionIndicator status={collaboration.status} />
        </div>
      )}
    >
      <MainMenu>
        <MainMenu.Item icon={<ArrowLeftIcon />} onSelect={backToDrawings}>
          Back to drawings
        </MainMenu.Item>
        <MainMenu.Separator />
        <MainMenu.DefaultItems.CommandPalette />
        <MainMenu.DefaultItems.SearchMenu />
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.SaveAsImage />
        {!readOnly && <MainMenu.DefaultItems.ClearCanvas />}
        <MainMenu.DefaultItems.Help />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ToggleTheme
          allowSystemTheme
          theme={(theme ?? "system") as "light" | "dark" | "system"}
        />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
    </Excalidraw>
  )
}

export { DrawingEditor }
export type { DrawingEditorProps }
