import type { Metadata } from "next"
import Link from "next/link"

import { LegalPage } from "@/components/marketing/legal-page"
import {
  CONTACT_EMAIL,
  JURISDICTION,
  LEGAL_UPDATED,
  OPERATOR_NAME,
  pageMetadata,
} from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Terms of service",
  description:
    "The rules for using Lukis: your account, your drawings (they're yours), acceptable use, and our responsibilities.",
  path: "/terms",
})

// A draft; have it reviewed before launch. Bracketed values are
// placeholders: lib/site.ts holds the operator details.
export default function Page() {
  const contact = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

  return (
    <LegalPage title="Terms of service" updated={LEGAL_UPDATED}>
      <h2>The agreement</h2>
      <p>
        These terms are an agreement between you and {OPERATOR_NAME}{" "}
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;), who run Lukis. By creating an
        account or using Lukis, you agree to them. If you use Lukis for an
        organization, you agree on its behalf, and confirm you&apos;re allowed
        to.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>
          You must be at least 13, or the minimum age for online services where
          you live.
        </li>
        <li>
          Give us a real email address, and keep your password to yourself.
        </li>
        <li>
          You&apos;re responsible for what happens under your account. Tell us
          at {contact} if you think someone else is using it.
        </li>
      </ul>

      <h2>Your drawings are yours</h2>
      <p>
        You keep all rights to what you draw and upload. You give us permission
        to store, copy, process and display it only as needed to run Lukis for
        you and the people you share it with. We don&apos;t claim ownership, and
        we don&apos;t use your drawings to train AI models.
      </p>
      <p>
        Make sure you have the right to everything you upload. When you share a
        drawing through a workspace or a share link, the people you share it
        with can see it, and can edit it if you allow that.
      </p>

      <h2>Using Lukis fairly</h2>
      <p>Please don&apos;t use Lukis to:</p>
      <ul>
        <li>break the law, or help anyone else break it;</li>
        <li>harass, threaten or harm other people;</li>
        <li>upload content that infringes someone else&apos;s rights;</li>
        <li>spread malware, spam or phishing;</li>
        <li>
          try to get into accounts or data that aren&apos;t yours, or probe,
          overload or disrupt Lukis;
        </li>
        <li>
          scrape Lukis, or resell or rebrand access to it without our written
          permission.
        </li>
      </ul>
      <p>
        We may remove content or suspend accounts that break these rules, and
        we&apos;ll tell you why unless the law or safety prevents it.
      </p>

      <h2>The service</h2>
      <p>
        We work to keep Lukis running and your drawings safe, and we keep
        backups. Still, Lukis may sometimes be unavailable, and we may change,
        add or remove features. We may introduce paid plans; if something you
        use would start to cost money, we&apos;ll tell you before it does.
      </p>

      <h2>Leaving</h2>
      <p>
        You can stop using Lukis and delete your account at any time from your
        account page. We may end or suspend your access if you seriously or
        repeatedly break these terms. If we ever shut Lukis down, we&apos;ll
        give you notice so you can save your drawings.
      </p>

      <h2>Responsibility</h2>
      <p>
        Lukis is provided &ldquo;as is&rdquo;. As far as the law allows, we
        don&apos;t give warranties beyond what these terms say, and we
        aren&apos;t liable for indirect or consequential losses, or for losses
        beyond [liability cap]. Nothing here limits rights you have that the law
        says can&apos;t be limited.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        When we change these terms, we&apos;ll update the date at the top. If a
        change matters, we&apos;ll tell you by email before it applies. If you
        keep using Lukis after that, the new terms apply.
      </p>

      {/*<h2>Law</h2>*/}
      {/*<p>*/}
      {/*  These terms are governed by the laws of {JURISDICTION}, and disputes go*/}
      {/*  to its courts, unless the law where you live says otherwise.*/}
      {/*</p>*/}

      <h2>Contact</h2>
      <p>
        Questions about these terms go to {contact}. How we handle your data is
        in the <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Open-source software</h2>
      <p>
        Lukis&apos;s drawing editor is built on Excalidraw, which is used under
        the MIT License:
      </p>
      <pre>{EXCALIDRAW_LICENSE}</pre>
    </LegalPage>
  )
}

// From ../excalidraw/LICENSE; the license asks for it in every copy.
const EXCALIDRAW_LICENSE = `MIT License

Copyright (c) 2020 Excalidraw

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`
