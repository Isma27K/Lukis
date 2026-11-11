import { cn } from "cn"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { avatarUrl } from "@/lib/avatar"
import { initials } from "@/lib/format"
import { NOTE_BG, noteColorFor } from "@/lib/notes"

// Someone's picture (see avatarUrl), or their initials on their own pastel
// color while it loads or if they have none.
function UserAvatar({
  name,
  picture,
  size,
  className,
}: {
  name: string
  picture?: string
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      {picture && <AvatarImage src={picture} alt="" />}
      <AvatarFallback
        className={cn(
          "font-semibold text-note-ink",
          NOTE_BG[noteColorFor(name)]
        )}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

// Overlapping avatars for a few people, then "+n".
function AvatarStack({
  people,
  max = 4,
  size,
}: {
  people: { id: string; name: string; avatar_version?: number | null }[]
  max?: number
  size?: "default" | "sm" | "lg"
}) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <AvatarGroup>
      {shown.map((person) => (
        <UserAvatar
          key={person.id}
          name={person.name}
          picture={avatarUrl(person.id, person.avatar_version)}
          size={size}
        />
      ))}
      {extra > 0 && <AvatarGroupCount>+{extra}</AvatarGroupCount>}
    </AvatarGroup>
  )
}

export { AvatarStack, UserAvatar }
