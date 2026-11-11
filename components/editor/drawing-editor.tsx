"use client"

import "@excalidraw/excalidraw/index.css"

import {
  Excalidraw,
  MainMenu,
  THEME,
  WelcomeScreen,
} from "@excalidraw/excalidraw"
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types"
import { ArrowLeftIcon, HistoryIcon, Share2Icon } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Logo } from "@/components/brand/logo"
import { LogoMark } from "@/components/brand/logo-mark"
import { ConnectionIndicator } from "@/components/editor/collab/connection-indicator"
import { useCollaboration } from "@/components/editor/collab/use-collaboration"
import {
  NEW_DRAWING_PATH,
  newDrawing,
  savedDrawing,
} from "@/components/editor/drawing-target"
import { DrawingTitle } from "@/components/editor/drawing-title"
import { SaveIndicator } from "@/components/editor/save-indicator"
import { useAutosave } from "@/components/editor/use-autosave"
import { useImageFiles } from "@/components/editor/use-image-files"
import { useThumbnail } from "@/components/editor/use-thumbnail"
import {
  HISTORY_SIDEBAR,
  VersionHistory,
} from "@/components/editor/version-history"
import { ShareDialog } from "@/components/share/share-dialog"
import { errorMessage } from "@/lib/api"
import { canShare } from "@/lib/roles"
import type { Drawing, Role, Scene, ShareInfo } from "@/lib/types"

// Matches the backend's max_file_bytes. The editor downscales images to fit
// 1440px first, so few photos come near it.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

// The editor's own island look, for what we add around the canvas.
const ISLAND =
  "flex h-(--default-button-size) items-center rounded-(--border-radius-lg) bg-(--island-bg-color) text-(--text-primary-color) shadow-(--shadow-island)"
const ISLAND_ICON_BUTTON =
  "flex size-7 items-center justify-center rounded-(--border-radius-md) text-(--text-primary-color) hover:bg-(--button-hover-bg) [&_svg]:size-4"

// Who has the drawing open: a workspace member with the full editor, on a
// saved drawing or a new one that isn't saved until its first change, or a
// guest who came through its public link (/s/<token>).
type EditorSource =
  | { kind: "member"; drawing: Drawing; publicLinks: boolean }
  | { kind: "new"; workspaceId: string; role: Role; publicLinks: boolean }
  | {
      kind: "guest"
      token: string
      info: ShareInfo
      // What others see them as; null for "Guest" or their account name.
      guestName: string | null
    }

type DrawingEditorProps = {
  source: EditorSource
  scene: Scene
  // Where to open the realtime socket; "" means this origin.
  realtimeUrl: string
}

// Where the editor saves, loads images and connects live, and what it allows.
// `member` is what a workspace member gets around the canvas; null for guests.
// `onCreated` runs when the first change to a new drawing has saved it.
function describe(source: EditorSource, onCreated: (drawing: Drawing) => void) {
  if (source.kind === "member") {
    const { drawing, publicLinks } = source
    return {
      target: savedDrawing(`/drawings/${encodeURIComponent(drawing.id)}`),
      title: drawing.title,
      canEdit: drawing.role !== "viewer",
      hasThumbnail: drawing.thumbnail_version !== null,
      guestName: null,
      member: {
        workspaceId: drawing.workspace_id,
        role: drawing.role,
        publicLinks,
      },
    }
  }
  if (source.kind === "new") {
    const { workspaceId, role, publicLinks } = source
    return {
      target: newDrawing(workspaceId, onCreated),
      // What the backend calls a drawing created without a name.
      title: "Untitled",
      canEdit: true,
      hasThumbnail: false,
      guestName: null,
      member: { workspaceId, role, publicLinks },
    }
  }
  return {
    target: savedDrawing(`/share/${encodeURIComponent(source.token)}`),
    title: source.info.title ?? "Shared drawing",
    canEdit: source.info.access === "edit",
    hasThumbnail: source.info.has_thumbnail,
    guestName: source.guestName,
    member: null,
  }
}

function DrawingEditor({ source, scene, realtimeUrl }: DrawingEditorProps) {
  const router = useRouter()
  const { theme, resolvedTheme, setTheme } = useTheme()
  // The drawing as members know it. Null for guests, and for a new drawing
  // until it's saved: nothing to share or look back on before that.
  const [drawingId, setDrawingId] = useState(
    source.kind === "member" ? source.drawing.id : null
  )
  const [{ target, canEdit, hasThumbnail, guestName, member, ...initial }] =
    useState(() =>
      describe(source, (drawing) => {
        setDrawingId(drawing.id)
        // The drawing's own address from here on, without loading the page
        // again. Not if the save only finished after leaving the editor.
        if (window.location.pathname === NEW_DRAWING_PATH) {
          window.history.replaceState(null, "", `/d/${drawing.id}`)
        }
      })
    )
  const thumbnail = useThumbnail(target.apiBase, canEdit, hasThumbnail)
  const autosave = useAutosave(
    target,
    scene.elements,
    canEdit,
    thumbnail.onSaved
  )
  const images = useImageFiles(target.apiBase, canEdit)
  const collaboration = useCollaboration({
    apiBase: target.apiBase,
    canEdit,
    realtimeUrl,
    guestName,
  })
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null)
  const [title, setTitle] = useState(initial.title)
  const [sharing, setSharing] = useState(false)
  // Excalidraw only reads initialData when it mounts.
  const [initialData] = useState(() => ({
    elements: scene.elements,
    appState: scene.app_state,
    scrollToContent: true,
  }))
  const shareable =
    member !== null && member.publicLinks && canShare(member.role)

  useEffect(() => {
    document.title = `${title} · Lukis`
  }, [title])

  async function backToDrawings() {
    if (!member) {
      return
    }
    // So the dashboard shows this drawing as just edited, thumbnail included.
    await autosave.save()
    await thumbnail.flush()
    router.push(`/w/${member.workspaceId}`)
  }

  async function share() {
    try {
      // A link needs a drawing to point at, so sharing a new one saves it.
      await target.create()
      setSharing(true)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <Excalidraw
      {...collaboration.editorProps}
      onExcalidrawAPI={(api) => {
        setApi(api)
        collaboration.attach(api)
        images.attach(api)
      }}
      initialData={initialData}
      onChange={(elements, appState, files) => {
        autosave.onChange?.(elements, appState)
        collaboration.onChange(elements)
        images.onChange(elements, files)
        thumbnail.onChange?.(elements, appState, files)
      }}
      theme={resolvedTheme === "dark" ? THEME.DARK : THEME.LIGHT}
      onThemeChange={setTheme}
      viewModeEnabled={!canEdit}
      name={title}
      imageOptions={{ maxFileSizeBytes: MAX_IMAGE_BYTES }}
      // No web embeds: pasted links stay links, and embeds already in a
      // drawing show a placeholder instead of loading the page.
      validateEmbeddable={false}
      // Hides text-to-diagram and Mermaid in the command palette. The menu
      // items the editor shows anyway are hidden in globals.css.
      aiEnabled={false}
      // The way back and the drawing's name, with whether it's saved and
      // live. The editor puts its menu button after this. The left column is
      // a quarter of the screen, hence the capped title.
      renderTopLeftUI={(isMobile) => (
        <div className={`${ISLAND} gap-1 pr-2 pl-1`}>
          {member ? (
            <button
              type="button"
              onClick={backToDrawings}
              aria-label="Back to drawings"
              title="Back to drawings"
              className={ISLAND_ICON_BUTTON}
            >
              <ArrowLeftIcon />
            </button>
          ) : (
            // Guests get the product instead of a way back.
            <Link
              href="/"
              aria-label="Lukis"
              className="flex items-center gap-1 px-1"
            >
              <LogoMark className="size-6" />
              {!isMobile && <span className="font-hand text-xl">lukis</span>}
            </Link>
          )}
          <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
          {member && canEdit ? (
            <DrawingTitle
              target={target}
              title={title}
              onRenamed={setTitle}
              className={isMobile ? "max-w-28" : "max-w-44"}
            />
          ) : (
            <span
              className={`${isMobile ? "max-w-28" : "max-w-44"} truncate px-2 text-[0.9375rem] font-semibold`}
            >
              {title}
            </span>
          )}
          {canEdit && (
            <SaveIndicator status={autosave.status} compact={isMobile} />
          )}
          <ConnectionIndicator status={collaboration.status} />
        </div>
      )}
      // History and sharing, for members. Guests have nothing here, and a
      // drawing has no history until it's saved.
      renderTopRightUI={(isMobile) =>
        drawingId || shareable ? (
          <div className={`${ISLAND} gap-1 px-1`}>
            {drawingId && (
              <button
                type="button"
                onClick={() => api?.toggleSidebar({ name: HISTORY_SIDEBAR })}
                aria-label="Version history"
                title="Version history"
                // Otherwise the sidebar closes on pointerdown, and this click
                // reopens it.
                data-prevent-outside-click
                className={ISLAND_ICON_BUTTON}
              >
                <HistoryIcon />
              </button>
            )}
            {shareable && (
              <button
                type="button"
                onClick={share}
                aria-label="Share"
                className="flex h-7 items-center gap-1.5 rounded-(--border-radius-md) border border-primary-edge/60 bg-primary px-2.5 text-sm font-medium text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/28%)] hover:bg-[color-mix(in_oklch,var(--primary),var(--ink)_9%)] dark:border-transparent [&_svg]:size-3.5"
              >
                <Share2Icon />
                {!isMobile && "Share"}
              </button>
            )}
          </div>
        ) : null
      }
    >
      <MainMenu>
        {(drawingId || shareable) && (
          <>
            {drawingId && (
              <MainMenu.Item
                icon={<HistoryIcon />}
                onSelect={() =>
                  api?.toggleSidebar({ name: HISTORY_SIDEBAR, force: true })
                }
              >
                Version history
              </MainMenu.Item>
            )}
            {shareable && (
              <MainMenu.Item icon={<Share2Icon />} onSelect={share}>
                Share
              </MainMenu.Item>
            )}
            <MainMenu.Separator />
          </>
        )}
        <MainMenu.DefaultItems.CommandPalette />
        <MainMenu.DefaultItems.SearchMenu />
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.SaveAsImage />
        {canEdit && <MainMenu.DefaultItems.ClearCanvas />}
        <MainMenu.DefaultItems.Help />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ToggleTheme
          allowSystemTheme
          theme={(theme ?? "system") as "light" | "dark" | "system"}
        />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
      {member && drawingId && (
        <VersionHistory
          drawingId={drawingId}
          role={member.role}
          api={api}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          flush={autosave.save}
        />
      )}
      {shareable && drawingId && (
        <ShareDialog
          drawingId={drawingId}
          title={title}
          publicLinks={member.publicLinks}
          open={sharing}
          onOpenChange={setSharing}
        />
      )}
      {/* No menu hint: its arrow would point at the back button. */}
      <WelcomeScreen>
        <WelcomeScreen.Center>
          <WelcomeScreen.Center.Logo>
            <Logo size="lg" animate />
          </WelcomeScreen.Center.Logo>
          <WelcomeScreen.Center.Heading>
            Draw anything. Everyone here sees it live.
          </WelcomeScreen.Center.Heading>
          <WelcomeScreen.Center.Menu>
            <WelcomeScreen.Center.MenuItemHelp />
          </WelcomeScreen.Center.Menu>
        </WelcomeScreen.Center>
        <WelcomeScreen.Hints.ToolbarHint />
        <WelcomeScreen.Hints.HelpHint />
      </WelcomeScreen>
    </Excalidraw>
  )
}

export { DrawingEditor }
export type { DrawingEditorProps, EditorSource }
