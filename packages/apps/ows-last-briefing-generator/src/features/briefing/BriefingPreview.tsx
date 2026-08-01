import { useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  briefingToPlainText,
  type BriefingSection,
} from '#/features/briefing/generate'

type BriefingPreviewProps = {
  sections: BriefingSection[]
}

export function BriefingPreview({ sections }: BriefingPreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(briefingToPlainText(sections))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      <div
        className="no-print flex flex-wrap items-center justify-between gap-2"
        data-print-hide
      >
        <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
          Briefing preview
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button type="button" onClick={handlePrint}>
            Print
          </Button>
        </div>
      </div>
      <article
        id="briefing-print-content"
        className="briefing-preview space-y-5 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 text-[var(--sea-ink)]"
      >
        <h1 className="print-only-title m-0 mb-6 text-2xl font-bold tracking-tight">
          Chief Referee Last Briefing
        </h1>
        {sections.map((section) => (
          <section key={section.title} className="briefing-section space-y-2">
            <h2 className="m-0 text-base font-bold tracking-tight sm:text-lg">
              {section.title}
            </h2>
            <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed sm:text-[15px]">
              {section.body}
            </p>
          </section>
        ))}
      </article>
    </div>
  )
}
