import { LogoutButton } from "@/components/auth/logout-button"
import { requireUser } from "@/lib/dal"

export default async function Page() {
  const user = await requireUser()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <span className="text-sm font-medium">Lukis</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-col gap-1 p-6">
        <h1 className="text-sm font-medium">Hi, {user.name}</h1>
        <p className="text-xs text-muted-foreground">
          Your drawings will show up here.
        </p>
      </main>
    </div>
  )
}
