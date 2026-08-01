import { useState } from 'react'

import { Button } from '#/components/ui/button'

type BriefingPreviewProps = {
  text: string
}

export function BriefingPreview({ text }: BriefingPreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
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
      <pre
        id="briefing-print-content"
        className="briefing-preview m-0 whitespace-pre-wrap rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 font-mono text-sm leading-relaxed text-[var(--sea-ink)]"
      >
        {text}
      </pre>
    </div>
  )
}
