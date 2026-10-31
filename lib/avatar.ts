// Where someone's profile picture is, or undefined without one. Pictures are
// public, so guests on public links can load them; the version in the URL
// lets each picture be cached for good.
function avatarUrl(userId: string, version: number | null | undefined) {
  return version == null
    ? undefined
    : `/api/users/${encodeURIComponent(userId)}/avatar?v=${version}`
}

export { avatarUrl }
