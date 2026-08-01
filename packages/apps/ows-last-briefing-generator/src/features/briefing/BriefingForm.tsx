import { Input } from '#/components/ui/input'
import { useAppForm } from '#/hooks/form'
import type { BriefingValues, RaceGender } from './schema'
import { otherGender } from './schema'

const genderShort = (gender: RaceGender) =>
  gender === 'men' ? 'Men' : 'Women'

type BriefingFormProps = {
  defaultValues: BriefingValues
  onValuesChange: (values: BriefingValues) => void
}

type RefereeNameField =
  | 'referee1Name'
  | 'referee2Name'
  | 'otherChiefRefereeName'
  | 'otherReferee1Name'
  | 'otherReferee2Name'

export function BriefingForm({
  defaultValues,
  onValuesChange,
}: BriefingFormProps) {
  const form = useAppForm({
    defaultValues,
    listeners: {
      onChange: ({ formApi }) => {
        onValuesChange(formApi.state.values)
      },
      onChangeDebounceMs: 0,
    },
  })

  const renderRefereeRow = (
    role: string,
    nameField: RefereeNameField,
    showGender: boolean,
    gender?: RaceGender,
  ) => (
    <tr key={nameField} className="border-t border-[var(--line)]">
      <td className="whitespace-nowrap px-2 py-1 text-sm text-[var(--sea-ink)]">
        {role}
      </td>
      {showGender ? (
        <td className="whitespace-nowrap px-2 py-1 text-sm text-[var(--sea-ink-soft)]">
          {gender ? genderShort(gender) : ''}
        </td>
      ) : null}
      <td className="px-2 py-1">
        <form.Field name={nameField}>
          {(field) => (
            <Input
              className="h-8"
              value={field.state.value}
              placeholder="Name"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </td>
    </tr>
  )

  return (
    <form
      className="no-print space-y-8"
      data-print-hide
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
          Race setup
        </h2>
        <div className="grid items-end gap-4 sm:grid-cols-2">
          <form.AppField name="combinedBriefing">
            {(field) => (
              <field.Switch label="Combined men's & women's briefing" />
            )}
          </form.AppField>
          <form.Subscribe selector={(s) => s.values.combinedBriefing}>
            {(combined) => (
              <form.AppField name="raceGender">
                {(field) => (
                  <div
                    className={
                      combined ? undefined : 'hidden sm:block sm:invisible'
                    }
                  >
                    <field.Select
                      label="Race"
                      disabled={!combined}
                      values={[
                        { label: "Men's", value: 'men' },
                        { label: "Women's", value: 'women' },
                      ]}
                    />
                  </div>
                )}
              </form.AppField>
            )}
          </form.Subscribe>
          <form.AppField name="isRelay">
            {(field) => <field.Switch label="Relay event" />}
          </form.AppField>
          <form.AppField name="hasIntermediateGate">
            {(field) => <field.Switch label="Intermediate gate" />}
          </form.AppField>
          <form.AppField name="hasTimeLimit">
            {(field) => <field.Switch label="Time limit applies" />}
          </form.AppField>
        </div>
        <form.Subscribe selector={(s) => s.values.hasTimeLimit}>
          {(hasTimeLimit) =>
            hasTimeLimit ? (
              <form.AppField name="timeLimitText">
                {(field) => (
                  <field.TextField
                    label="Time limit details"
                    placeholder="e.g. 30 minutes after the first finisher"
                  />
                )}
              </form.AppField>
            ) : null
          }
        </form.Subscribe>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--sea-ink)]">Intro</h2>
        <form.AppField name="chiefRefereeName">
          {(field) => (
            <field.TextField
              label="Chief referee (speaker)"
              placeholder="Your name"
            />
          )}
        </form.AppField>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--sea-ink)]">
            Referees
          </h3>
          <form.Subscribe
            selector={(s) =>
              [s.values.combinedBriefing, s.values.raceGender] as const
            }
          >
            {([combined, raceGender]) => {
              const other = otherGender(raceGender)
              return (
                <div className="overflow-x-auto rounded-md border border-[var(--line)]">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[var(--foam)] text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                        <th className="px-2 py-1.5 font-semibold">Role</th>
                        {combined ? (
                          <th className="px-2 py-1.5 font-semibold">Race</th>
                        ) : null}
                        <th className="px-2 py-1.5 font-semibold">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderRefereeRow(
                        'Referee 1',
                        'referee1Name',
                        combined,
                        raceGender,
                      )}
                      {renderRefereeRow(
                        'Referee 2',
                        'referee2Name',
                        combined,
                        raceGender,
                      )}
                      {combined ? (
                        <>
                          {renderRefereeRow(
                            'Chief Referee',
                            'otherChiefRefereeName',
                            true,
                            other,
                          )}
                          {renderRefereeRow(
                            'Referee 1',
                            'otherReferee1Name',
                            true,
                            other,
                          )}
                          {renderRefereeRow(
                            'Referee 2',
                            'otherReferee2Name',
                            true,
                            other,
                          )}
                        </>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              )
            }}
          </form.Subscribe>
        </div>

        <form.AppField name="safetyOfficerName">
          {(field) => (
            <field.TextField label="Safety officer" placeholder="Full name" />
          )}
        </form.AppField>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
          Weather conditions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="waterTemp">
            {(field) => (
              <field.TextField label="Water temperature" placeholder="22" />
            )}
          </form.AppField>
          <form.AppField name="airTemp">
            {(field) => (
              <field.TextField label="Air temperature" placeholder="26" />
            )}
          </form.AppField>
        </div>
        <form.AppField name="weatherNotes">
          {(field) => (
            <field.TextArea
              label="Wind / rain / sun expectations"
              placeholder="What we expect from conditions today…"
              rows={3}
            />
          )}
        </form.AppField>
        <form.AppField name="wetsuits">
          {(field) => (
            <field.Select
              label="Wetsuits"
              values={[
                { label: 'Do not mention', value: 'omit' },
                { label: 'Compulsory', value: 'compulsory' },
                { label: 'Optional', value: 'optional' },
                { label: 'Not allowed', value: 'not_allowed' },
              ]}
            />
          )}
        </form.AppField>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
          Course layout
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="courseShape">
            {(field) => (
              <field.TextField label="Shape" placeholder="e.g. rectangle" />
            )}
          </form.AppField>
          <form.AppField name="distanceKm">
            {(field) => (
              <field.TextField
                label="Distance in km"
                type="number"
                placeholder="e.g. 10"
              />
            )}
          </form.AppField>
          <form.AppField name="laps">
            {(field) => (
              <field.TextField label="Laps" placeholder="e.g. 4" />
            )}
          </form.AppField>
          <form.AppField name="turnBuoyColor">
            {(field) => (
              <field.TextField
                label="Turn buoy colour"
                placeholder="e.g. yellow"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="guidanceBuoyNotes">
          {(field) => (
            <field.TextArea
              label="Brief course description"
              placeholder="Turn direction, guidance buoys, other course notes…"
              rows={2}
            />
          )}
        </form.AppField>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
          Start of the race
        </h2>
        <form.AppField name="startType">
          {(field) => (
            <field.Select
              label="Start type"
              values={[
                { label: 'Platform / diving start', value: 'platform' },
                { label: 'In-water start', value: 'in_water' },
              ]}
            />
          )}
        </form.AppField>
      </section>

      <form.Subscribe selector={(s) => s.values.distanceKm}>
        {(distanceKm) =>
          distanceKm > 5 ? (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
                Feeding
              </h2>
              <form.AppField name="feedingPlatformLocation">
                {(field) => (
                  <field.TextField
                    label="Feeding platform location"
                    placeholder="e.g. on the right side after buoy 2"
                  />
                )}
              </form.AppField>
            </section>
          ) : null
        }
      </form.Subscribe>

      <form.Subscribe selector={(s) => s.values.isRelay}>
        {(isRelay) =>
          isRelay ? (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
                Changeover
              </h2>
              <form.AppField name="changeoverType">
                {(field) => (
                  <field.Select
                    label="Changeover type"
                    values={[
                      { label: 'Change pontoon', value: 'pontoon' },
                      { label: 'In-water', value: 'in_water' },
                    ]}
                  />
                )}
              </form.AppField>
            </section>
          ) : null
        }
      </form.Subscribe>
    </form>
  )
}
