"use client"

import { Sidebar } from "@excalidraw/excalidraw"
import type { FileId } from "@excalidraw/excalidraw/element/types"
import type {
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types"
import { cn } from "cn"
import {
  BookmarkPlusIcon,
  PencilIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { downloadFile } from "@/components/editor/image-files"
import { restoreVersion } from "@/components/editor/restore-version"
import { renderPreview } from "@/components/editor/use-thumbnail"
import { EmptyState } from "@/components/empty-state"
import { Rewind, Smudge } from "@/components/illustrations/spots"
import { TextInputDialog } from "@/components/text-input-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/user-avatar"
import { apiFetch, errorMessage } from "@/lib/api"
import { atLeast, canDeleteVersions } from "@/lib/roles"
import type { Role, Version, VersionSummary } from "@/lib/types"

const HISTORY_SIDEBAR = "history"
// Matches the backend's limit on titles and version names.
const MAX_NAME_LENGTH = 120

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
})
const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "short",
  day: "numeric",
})

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// "Today", "Yesterday", "Tuesday, Oct 28".
function dayLabel(date: Date) {
  const days = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(date).getTime()) /
      (24 * 60 * 60 * 1000)
  )
  if (days === 0) {
    return "Today"
  }
  return days === 1 ? "Yesterday" : dayFormat.format(date)
}

// Versions come newest first, so each day's run is already together.
function groupByDay(versions: VersionSummary[]) {
  const groups: { day: string; versions: VersionSummary[] }[] = []
  for (const version of versions) {
    const day = dayLabel(new Date(version.created_at))
    if (groups.at(-1)?.day === day) {
      groups.at(-1)!.versions.push(version)
    } else {
      groups.push({ day, versions: [version] })
    }
  }
  return groups
}

function versionLabel(version: VersionSummary) {
  return (
    version.name ??
    `${dayLabel(new Date(version.created_at))}, ${timeFormat.format(
      new Date(version.created_at)
    )}`
  )
}

// The images a version shows, including ones no longer on the canvas and
// so never loaded this session.
async function filesFor(
  drawingId: string,
  version: Version,
  loaded: BinaryFiles
): Promise<BinaryFiles> {
  const missing = new Set<FileId>()
  for (const element of version.elements) {
    if (element.type === "image" && element.fileId && !loaded[element.fileId]) {
      missing.add(element.fileId)
    }
  }
  const downloaded = await Promise.allSettled(
    [...missing].map((id) => downloadFile(drawingId, id))
  )
  const files = { ...loaded }
  for (const result of downloaded) {
    // A missing image just shows as a placeholder.
    if (result.status === "fulfilled") {
      files[result.value.id] = result.value
    }
  }
  return files
}

type Selected = { version: Version; previewUrl: string }

type VersionHistoryProps = {
  drawingId: string
  role: Role
  api: ExcalidrawImperativeAPI | null
  theme: "light" | "dark"
  // Saves pending edits, so a new version or checkpoint includes them.
  flush: () => Promise<void>
}

// The editor sidebar listing a drawing's versions: automatic snapshots,
// checkpoints and named versions. Selecting one previews it; editors can
// restore it as an undoable edit, or name it to keep it.
function VersionHistory({
  drawingId,
  role,
  api,
  theme,
  flush,
}: VersionHistoryProps) {
  const [docked, setDocked] = useState(false)
  const [versions, setVersions] = useState<VersionSummary[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Selected | null>(null)
  const [restoring, setRestoring] = useState(false)
  // A version to name, or "new" to save the drawing as it is now.
  const [naming, setNaming] = useState<VersionSummary | "new" | null>(null)
  const [deleting, setDeleting] = useState<VersionSummary | null>(null)
  const canEdit = atLeast(role, "editor")
  const canDelete = canDeleteVersions(role)
  const base = `/drawings/${encodeURIComponent(drawingId)}/versions`

  async function load() {
    try {
      setVersions(await apiFetch<VersionSummary[]>(base))
      setLoadFailed(false)
    } catch {
      setLoadFailed(true)
    }
  }

  useEffect(() => {
    if (!selectedId || !api) {
      return
    }
    let cancelled = false
    let previewUrl: string | undefined
    void (async () => {
      try {
        const version = await apiFetch<Version>(`${base}/${selectedId}`)
        const files = await filesFor(drawingId, version, api.getFiles())
        const blob = await renderPreview(
          { elements: version.elements, appState: version.app_state, files },
          theme
        )
        if (!cancelled) {
          previewUrl = URL.createObjectURL(blob)
          setSelected({ version, previewUrl })
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(`Couldn't open that version: ${errorMessage(error)}`)
        }
      }
    })()
    return () => {
      cancelled = true
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [api, base, drawingId, selectedId, theme])

  async function restore(version: Version) {
    if (!api) {
      return
    }
    setRestoring(true)
    try {
      // Keep the drawing as it is now first, so restoring never loses work,
      // even after undo history is gone.
      await flush()
      await apiFetch(base, { method: "POST", body: {} })
      restoreVersion(api, version)
      toast.success(`Restored “${versionLabel(version)}”`, {
        description: "Undo brings back what was there before.",
      })
      await load()
    } catch (error) {
      toast.error(`Couldn't restore: ${errorMessage(error)}`)
    } finally {
      setRestoring(false)
    }
  }

  async function saveName(name: string) {
    if (naming === "new") {
      await flush()
      await apiFetch(base, { method: "POST", body: { name } })
      toast.success(`Saved “${name.trim()}”`)
    } else if (naming) {
      await apiFetch(`${base}/${naming.id}`, {
        method: "PATCH",
        body: { name },
      })
    }
    await load()
  }

  async function remove(version: VersionSummary) {
    await apiFetch(`${base}/${version.id}`, { method: "DELETE" })
    if (selectedId === version.id) {
      setSelectedId(null)
    }
    await load()
  }

  return (
    <>
      <Sidebar
        name={HISTORY_SIDEBAR}
        docked={docked}
        onDock={setDocked}
        onStateChange={(state) => {
          if (state) {
            void load()
          } else {
            setSelectedId(null)
          }
        }}
      >
        <Sidebar.Header>
          <h2 className="font-hand text-2xl font-normal">Version history</h2>
        </Sidebar.Header>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3">
          {canEdit && (
            <Button variant="outline" onClick={() => setNaming("new")}>
              <BookmarkPlusIcon />
              Save this version
            </Button>
          )}
          {loadFailed ? (
            <EmptyState
              illustration={<Smudge className="w-40" />}
              title="Couldn't load the history"
            >
              <Button variant="outline" size="sm" onClick={() => load()}>
                Try again
              </Button>
            </EmptyState>
          ) : versions === null ? (
            <div className="flex flex-col gap-2 pt-2">
              {[0, 1, 2].map((key) => (
                <Skeleton key={key} className="h-11" />
              ))}
            </div>
          ) : versions.length === 0 ? (
            <EmptyState
              illustration={<Rewind className="w-44" />}
              title="No versions yet"
            >
              <p className="text-sm text-balance text-muted-foreground">
                Lukis keeps snapshots while people draw.
                {canEdit && " Save one yourself to give it a name."}
              </p>
            </EmptyState>
          ) : (
            <>
              {groupByDay(versions).map(({ day, versions }) => (
                <section key={day} className="flex flex-col gap-0.5">
                  <h3 className="px-2 pt-1 pb-0.5 text-xs font-medium text-muted-foreground">
                    {day}
                  </h3>
                  <ul className="flex flex-col gap-0.5">
                    {versions.map((version) => (
                      <VersionItem
                        key={version.id}
                        version={version}
                        open={version.id === selectedId}
                        details={
                          selected?.version.id === version.id ? selected : null
                        }
                        canEdit={canEdit}
                        canDelete={canDelete}
                        restoring={restoring}
                        onToggle={() =>
                          setSelectedId(
                            version.id === selectedId ? null : version.id
                          )
                        }
                        onRestore={restore}
                        onName={() => setNaming(version)}
                        onDelete={() => setDeleting(version)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
              <p className="px-2 text-xs text-muted-foreground">
                Unnamed snapshots are cleared after a while. Name a version to
                keep it.
              </p>
            </>
          )}
        </div>
      </Sidebar>
      <TextInputDialog
        open={naming !== null}
        onOpenChange={(open) => !open && setNaming(null)}
        title={naming === "new" ? "Save this version" : "Name this version"}
        label="Name"
        defaultValue={naming !== "new" ? (naming?.name ?? "") : ""}
        maxLength={MAX_NAME_LENGTH}
        submitLabel="Save"
        onSubmit={saveName}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this version?"
        description={
          deleting
            ? `“${versionLabel(deleting)}” will be gone from the history for everyone. The drawing itself doesn't change.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={() => remove(deleting!)}
      />
    </>
  )
}

function VersionItem({
  version,
  open,
  details,
  canEdit,
  canDelete,
  restoring,
  onToggle,
  onRestore,
  onName,
  onDelete,
}: {
  version: VersionSummary
  open: boolean
  // Loaded once the version is opened.
  details: Selected | null
  canEdit: boolean
  canDelete: boolean
  restoring: boolean
  onToggle: () => void
  onRestore: (version: Version) => void
  onName: () => void
  onDelete: () => void
}) {
  const time = timeFormat.format(new Date(version.created_at))
  const author = version.created_by?.name

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-muted",
          open && "bg-muted"
        )}
      >
        {author ? (
          <UserAvatar name={author} size="sm" />
        ) : (
          <span className="size-6 shrink-0 rounded-full bg-muted" />
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {version.name ? (
              <span className="rounded bg-highlight px-1">{version.name}</span>
            ) : (
              time
            )}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {[version.name && time, author ? `by ${author}` : null]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-2 px-2 pt-1.5 pb-3">
          <div className="aspect-video overflow-hidden rounded-md border bg-card">
            {details ? (
              // A blob URL rendered in the browser; next/image can't use it.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={details.previewUrl}
                alt={`Preview of ${version.name ?? `the drawing at ${time}`}`}
                className="size-full object-contain"
              />
            ) : (
              <Skeleton className="size-full rounded-none" />
            )}
          </div>
          {(canEdit || canDelete) && (
            <div className="flex items-center gap-1.5">
              {canEdit && (
                <Button
                  size="sm"
                  disabled={!details || restoring}
                  onClick={() => details && onRestore(details.version)}
                >
                  <RotateCcwIcon />
                  Restore
                </Button>
              )}
              {canEdit && (
                <Button size="sm" variant="ghost" onClick={onName}>
                  <PencilIcon />
                  {version.name ? "Rename" : "Name"}
                </Button>
              )}
              {canDelete && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="ml-auto"
                  aria-label="Delete version"
                  onClick={onDelete}
                >
                  <Trash2Icon />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  )
}

export { HISTORY_SIDEBAR, VersionHistory }
