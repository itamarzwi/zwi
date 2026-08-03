import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { BriefingForm } from '#/features/briefing/BriefingForm'
import { BriefingPreview } from '#/features/briefing/BriefingPreview'
import { defaultBriefingValues } from '#/features/briefing/defaults'
import { generateBriefing } from '#/features/briefing/generate'
import type { BriefingValues } from '#/features/briefing/schema'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const [values, setValues] = useState<BriefingValues>(defaultBriefingValues)
  const sections = generateBriefing(values)

  return (
    <main className="page-wrap px-1.5 pb-4 pt-4 sm:px-4 sm:pb-8 sm:pt-8">
      <div className="no-print mb-4 sm:mb-6" data-print-hide>
        <p className="island-kicker mb-2">Open water swimming</p>
        <h1 className="display-title m-0 text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
          Last Briefing Generator
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sea-ink-soft)] sm:text-base">
          Fill in the details for today's race. The briefing text updates live.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-8 lg:grid-cols-2 lg:items-start">
        <section className="island-shell no-print rounded-xl p-3 sm:rounded-2xl sm:p-5 md:p-6">
          <BriefingForm
            defaultValues={defaultBriefingValues}
            onValuesChange={setValues}
          />
        </section>
        <section className="island-shell print-only-shell overflow-hidden rounded-xl p-0 sm:rounded-2xl lg:sticky lg:top-24">
          <BriefingPreview sections={sections} />
        </section>
      </div>
    </main>
  )
}
