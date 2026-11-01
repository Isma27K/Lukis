import type { Metadata } from "next"
import Link from "next/link"

import { LegalPage } from "@/components/marketing/legal-page"
import {
  CONTACT_EMAIL,
  LEGAL_UPDATED,
  OPERATOR_NAME,
  pageMetadata,
} from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "What Lukis collects, why, who can see it, how long it's kept, and what you can do about it. No ads, no ad trackers, and no AI training on your drawings.",
  path: "/privacy",
})

// A draft written from what the code collects (see ../backend). Keep it in
// step with the code, and have it reviewed before launch. Bracketed values
// are placeholders: lib/site.ts holds the operator details.
export default function Page() {
  const contact = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

  return (
    <LegalPage title="Privacy policy" updated={LEGAL_UPDATED}>
      <h2>Who we are</h2>
      <p>
        Lukis is run by {OPERATOR_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
        This policy explains what we collect when you use Lukis, why, who can
        see it, and the choices you have. Questions go to {contact}.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>
          We collect what Lukis needs to work, and nothing for advertising.
        </li>
        <li>
          We don&apos;t sell your data, and we don&apos;t use ad trackers.
        </li>
        <li>
          Lukis has no AI features, and your drawings are never used to train AI
          models.
        </li>
        <li>
          You can delete your account, and your personal drawings, yourself.
        </li>
      </ul>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Your account:</strong> your name, email address, profile
          picture if you add one, and whether you&apos;ve confirmed your email.
          Your password is stored only as an Argon2 hash, never as the password
          itself.
        </li>
        <li>
          <strong>Logins with Google, GitHub or Microsoft:</strong> if you use
          one, we get that account&apos;s ID, name and email address from it. We
          never see your password there.
        </li>
        <li>
          <strong>Your drawings:</strong> everything on your canvases, images
          you add, preview thumbnails, and saved versions.
        </li>
        <li>
          <strong>Workspaces:</strong> which workspaces you&apos;re in, your
          role in each, and the invitations you send, including the invited
          person&apos;s email address.
        </li>
        <li>
          <strong>Devices:</strong> for each login, your browser and operating
          system, IP address, and when it was last used. You can see these on
          your account page.
        </li>
        <li>
          <strong>Server logs:</strong> for each request, the IP address, time,
          address requested and result. We use these to keep Lukis running and
          to stop abuse.
        </li>
        <li>
          <strong>Guests on shared drawings:</strong> the name a guest types is
          kept in their own browser, and shown to the people drawing with them.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>
          To run Lukis: saving your drawings and showing them to the people you
          work with.
        </li>
        <li>
          To send emails you need: confirming your address, resetting your
          password, invitations, and security notices such as a new login method
          being connected.
        </li>
        <li>
          To keep Lukis secure: limiting repeated login attempts, spotting
          abuse, and fixing problems.
        </li>
      </ul>
      <p>
        We don&apos;t use your data for advertising, we don&apos;t sell it, and
        we don&apos;t use your drawings to train AI models. Where the law asks
        for a reason to use your data, ours is that we need it to provide Lukis
        to you, or our legitimate interest in keeping it secure and working.
      </p>

      <h2>Who can see it</h2>
      <ul>
        <li>
          <strong>People in your workspaces</strong> see your name, email
          address and profile picture, and the drawings in workspaces you share
          with them.
        </li>
        <li>
          <strong>Anyone with a share link</strong> can see that drawing, and
          edit it if the link allows editing, until the link is switched off.
        </li>
        <li>
          <strong>Your profile picture</strong> can be seen by anyone with its
          link, for example guests on a drawing you share.
        </li>
        <li>
          <strong>Our service providers</strong>, only to run Lukis for us:
          [hosting provider and region], [email delivery provider], and the
          login provider you choose, if any.
        </li>
        <li>
          <strong>Authorities</strong>, only when the law requires it.
        </li>
      </ul>

      <h2>Cookies and local storage</h2>
      <p>
        Lukis uses only what it needs to work. There are no analytics or
        advertising cookies.
      </p>
      <ul>
        <li>
          <strong>lukis_session</strong> keeps you logged in, for up to 30 days.
        </li>
        <li>
          <strong>lukis_oauth</strong> exists for up to 10 minutes while you log
          in with Google, GitHub or Microsoft.
        </li>
        <li>
          <strong>lukis_share_…</strong> remembers, for 7 days, that you entered
          the password for a protected share link.
        </li>
        <li>
          Your browser&apos;s local storage keeps preferences such as light or
          dark mode, and the name you use as a guest.
        </li>
      </ul>

      <h2>How long we keep it</h2>
      <ul>
        <li>
          Your account and drawings: until you delete them, or your account.
        </li>
        <li>
          Automatic versions of a drawing: 30 days. Versions you name: until
          someone deletes them.
        </li>
        <li>Logins: up to 30 days, or until you log that device out.</li>
        <li>
          Links in emails: 48 hours to confirm your email, 1 hour to reset your
          password.
        </li>
        <li>Backups: up to 14 days.</li>
        <li>Server logs: [log retention period].</li>
      </ul>
      <p>
        When you delete your account, we delete your profile, picture, logins,
        connected accounts, your personal workspace and any workspace only you
        were in, with their drawings. Drawings in workspaces you share with
        others stay with those workspaces. Copies in backups are gone within 14
        days.
      </p>

      <h2>Your choices and rights</h2>
      <ul>
        <li>Change your name and picture on your account page.</li>
        <li>Save any drawing as a PNG or SVG image.</li>
        <li>See where you&apos;re logged in, and log any device out.</li>
        <li>Connect or disconnect Google, GitHub or Microsoft.</li>
        <li>Delete your account from your account page.</li>
      </ul>
      <p>
        Depending on where you live, you may also have the right to ask for a
        copy of your data, to have it corrected or deleted, to object to how we
        use it, or to complain to your data protection authority. Write to{" "}
        {contact} and we&apos;ll respond within 30 days.
      </p>

      <h2>Security</h2>
      <p>
        Lukis is served over HTTPS, passwords are hashed, login cookies
        can&apos;t be read by scripts on the page, and repeated attempts are
        limited. No system is perfect, though; if you find a problem, please
        tell us at {contact}.
      </p>

      <h2>Children</h2>
      <p>
        Lukis isn&apos;t meant for children under 13, or the minimum age to
        consent to data processing where they live.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        When we change this policy, we&apos;ll update the date at the top. If a
        change matters, we&apos;ll also tell you by email before it applies. The{" "}
        <Link href="/terms">terms</Link> cover how you may use Lukis.
      </p>
    </LegalPage>
  )
}
