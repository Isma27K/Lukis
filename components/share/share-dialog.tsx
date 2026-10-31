"use client"

import { CheckIcon, CopyIcon, RotateCwIcon } from "lucide-react"
import { useEffect, useId, useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { apiFetch, errorMessage } from "@/lib/api"
import type { ShareAccess, ShareLink } from "@/lib/types"

const ACCESS_LABELS: Record<ShareAccess, string> = {
  view: "Can view",
  edit: "Can edit",
}

// Expiry choices in days; "current" stands for the link's own date. The keys
// aren't plain numbers, which objects would sort ahead of "never".
const EXPIRY_DAYS = { never: null, "1d": 1, "7d": 7, "30d": 30 } as const
type ExpiryChoice = keyof typeof EXPIRY_DAYS | "current"

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

function expiryLabel(expiresAt: string) {
  const date = new Date(expiresAt)
  return date.getTime() <= Date.now()
    ? `Expired ${dateFormat.format(date)}`
    : `Until ${dateFormat.format(date)}`
}

// The settings PUT /drawings/{id}/share takes. Leaving out `password` keeps
// the current one; null removes it.
type ShareSettings = {
  enabled: boolean
  access: ShareAccess
  expires_at: string | null
  password?: string | null
}

// Turns a drawing's public link on and off and sets who it lets in: view or
// edit, an optional password and expiry. Members always have access; the
// link is for everyone else.
function ShareDialog({
  drawingId,
  title,
  publicLinks,
  open,
  onOpenChange,
}: {
  drawingId: string
  title: string
  // Whether the site owner allows public links at all.
  publicLinks: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  // undefined while loading; null when the drawing has never had a link.
  const [link, setLink] = useState<ShareLink | null | undefined>(undefined)
  const [loadFailed, setLoadFailed] = useState(false)
  const [pending, startTransition] = useTransition()
  const [choosingPassword, setChoosingPassword] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const base = `/drawings/${encodeURIComponent(drawingId)}/share`

  useEffect(() => {
    if (!open || !publicLinks) {
      return
    }
    let cancelled = false
    apiFetch<ShareLink | null>(base)
      .then((loaded) => !cancelled && setLink(loaded))
      .catch(() => !cancelled && setLoadFailed(true))
    return () => {
      cancelled = true
    }
  }, [base, open, publicLinks])

  async function put(changes: Partial<ShareSettings>) {
    const settings: ShareSettings = {
      enabled: link?.enabled ?? false,
      access: link?.access ?? "view",
      expires_at: link?.expires_at ?? null,
      ...changes,
    }
    setLink(await apiFetch<ShareLink>(base, { method: "PUT", body: settings }))
  }

  function change(changes: Partial<ShareSettings>, success?: string) {
    startTransition(async () => {
      try {
        await put(changes)
        if (success) {
          toast.success(success)
        }
      } catch (error) {
        toast.error(errorMessage(error))
      }
    })
  }

  function chooseExpiry(choice: ExpiryChoice | null) {
    if (!choice || choice === "current") {
      return
    }
    const days = EXPIRY_DAYS[choice]
    change({
      expires_at: days
        ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
        : null,
    })
  }

  async function reset() {
    const next = await apiFetch<ShareLink>(`${base}/reset`, { method: "POST" })
    setLink(next)
    toast.success("Made a new link. The old one no longer works.")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setChoosingPassword(false)
        onOpenChange(open)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share “{title}”</DialogTitle>
          <DialogDescription>
            Members of this workspace can always open it. A public link lets
            anyone else in too, no account needed.
          </DialogDescription>
        </DialogHeader>
        {!publicLinks ? (
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            The site owner has turned public links off, so drawings can only be
            shared with workspace members.
          </p>
        ) : loadFailed ? (
          <p className="text-sm text-destructive">
            Couldn&apos;t load the sharing settings. Close this and try again.
          </p>
        ) : link === undefined ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-9" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="share-enabled">Public link</FieldLabel>
                <FieldDescription>
                  {link?.enabled
                    ? "Anyone with the link can open this drawing."
                    : "Off. Only workspace members can open this drawing."}
                </FieldDescription>
              </FieldContent>
              {/* A native button, so the sibling label above names it. */}
              <Switch
                id="share-enabled"
                nativeButton
                render={<button type="button" />}
                checked={link?.enabled ?? false}
                onCheckedChange={(enabled) =>
                  change(
                    { enabled },
                    enabled ? undefined : "The public link is off"
                  )
                }
                disabled={pending}
              />
            </Field>

            {link?.enabled && (
              <>
                <LinkField token={link.token} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>People with the link</FieldLabel>
                    <Select
                      items={ACCESS_LABELS}
                      value={link.access}
                      onValueChange={(access: ShareAccess | null) =>
                        access && change({ access })
                      }
                      disabled={pending}
                    >
                      <SelectTrigger aria-label="People with the link">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["view", "edit"] as const).map((access) => (
                          <SelectItem key={access} value={access}>
                            {ACCESS_LABELS[access]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Link works</FieldLabel>
                    <ExpirySelect
                      expiresAt={link.expires_at}
                      onChange={chooseExpiry}
                      disabled={pending}
                    />
                  </Field>
                </div>
                {link.access === "edit" && (
                  <p className="-mt-2 text-sm text-muted-foreground">
                    Anyone with the link can change or erase what&apos;s drawn.
                    The version history keeps earlier states.
                  </p>
                )}

                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="share-password">
                      Require a password
                    </FieldLabel>
                    <FieldDescription>
                      {link.has_password
                        ? "Set. People enter it once per browser."
                        : "Only people who know it can open the link."}
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="share-password"
                    nativeButton
                    render={<button type="button" />}
                    checked={link.has_password || choosingPassword}
                    onCheckedChange={(on) => {
                      setChoosingPassword(on)
                      if (!on && link.has_password) {
                        change({ password: null }, "Password removed")
                      }
                    }}
                    disabled={pending}
                  />
                </Field>
                {choosingPassword ? (
                  <PasswordForm
                    onSubmit={async (password) => {
                      await put({ password })
                      setChoosingPassword(false)
                      toast.success("Password saved")
                    }}
                    onCancel={() => setChoosingPassword(false)}
                  />
                ) : (
                  link.has_password && (
                    <Button
                      variant="link"
                      className="-mt-3 h-auto self-start p-0"
                      onClick={() => setChoosingPassword(true)}
                    >
                      Change password
                    </Button>
                  )
                )}

                <div className="flex items-center gap-3 border-t pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmingReset(true)}
                    disabled={pending}
                  >
                    <RotateCwIcon />
                    Reset link
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Makes a new link and stops the old one working.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        <ConfirmDialog
          open={confirmingReset}
          onOpenChange={setConfirmingReset}
          title="Reset the link?"
          description="The current link stops working for everyone who has it, and anyone who entered the password has to enter it again."
          confirmLabel="Reset link"
          onConfirm={reset}
        />
      </DialogContent>
    </Dialog>
  )
}

function LinkField({ token }: { token: string }) {
  const url = `${window.location.origin}/s/${token}`
  const [copied, setCopied] = useState<string | null>(null)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(url)
    } catch {
      toast.error("Couldn't copy. Select the link and copy it instead.")
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        readOnly
        value={url}
        aria-label="Public link"
        onFocus={(event) => event.currentTarget.select()}
      />
      <Button variant="outline" onClick={copy}>
        {copied === url ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <CopyIcon data-icon="inline-start" />
        )}
        {copied === url ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

function ExpirySelect({
  expiresAt,
  onChange,
  disabled,
}: {
  expiresAt: string | null
  onChange: (choice: ExpiryChoice | null) => void
  disabled: boolean
}) {
  const items: Partial<Record<ExpiryChoice, string>> = {
    ...(expiresAt && { current: expiryLabel(expiresAt) }),
    never: "Forever",
    "1d": "For 1 day",
    "7d": "For 7 days",
    "30d": "For 30 days",
  }
  return (
    <Select
      items={items}
      value={(expiresAt ? "current" : "never") as ExpiryChoice}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger aria-label="Link works">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(items) as ExpiryChoice[]).map((choice) => (
          <SelectItem key={choice} value={choice}>
            {items[choice]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function PasswordForm({
  onSubmit,
  onCancel,
}: {
  // Rejects with the reason to show under the field.
  onSubmit: (password: string) => Promise<void>
  onCancel: () => void
}) {
  const inputId = useId()
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const password = String(new FormData(event.currentTarget).get("password"))
    startTransition(async () => {
      try {
        await onSubmit(password)
      } catch (error) {
        setError(errorMessage(error))
      }
    })
  }

  return (
    <form onSubmit={submit} className="-mt-2 flex flex-col gap-2">
      <Field data-invalid={!!error}>
        <FieldLabel htmlFor={inputId} className="sr-only">
          Password for the link
        </FieldLabel>
        <div className="flex gap-2">
          <Input
            id={inputId}
            name="password"
            type="password"
            placeholder="At least 4 characters"
            minLength={4}
            maxLength={128}
            required
            autoFocus
            autoComplete="new-password"
            aria-invalid={!!error}
          />
          <Button type="submit" disabled={pending}>
            Save
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    </form>
  )
}

export { ShareDialog }
