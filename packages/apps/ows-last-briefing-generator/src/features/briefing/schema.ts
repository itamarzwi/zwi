import { z } from 'zod'

export const raceGenderSchema = z.enum(['men', 'women'])
export const wetsuitsSchema = z.enum([
  'omit',
  'compulsory',
  'optional',
  'not_allowed',
])
export const startTypeSchema = z.enum(['platform', 'in_water'])
export const changeoverTypeSchema = z.enum(['pontoon', 'in_water'])

export const briefingSchema = z.object({
  combinedBriefing: z.boolean(),
  raceGender: raceGenderSchema,
  distanceKm: z.number().min(0),
  isRelay: z.boolean(),
  hasIntermediateGate: z.boolean(),
  hasTimeLimit: z.boolean(),
  timeLimitText: z.string(),

  chiefRefereeName: z.string(),
  referee1Name: z.string(),
  referee2Name: z.string(),
  otherChiefRefereeName: z.string(),
  otherReferee1Name: z.string(),
  otherReferee2Name: z.string(),
  safetyOfficerName: z.string(),

  waterTemp: z.string(),
  airTemp: z.string(),
  weatherNotes: z.string(),
  wetsuits: wetsuitsSchema,

  courseShape: z.string(),
  courseDistance: z.string(),
  laps: z.string(),
  turnBuoyColor: z.string(),
  guidanceBuoyNotes: z.string(),

  startType: startTypeSchema,

  feedingPlatformLocation: z.string(),

  changeoverType: changeoverTypeSchema,
})

export type RaceGender = z.infer<typeof raceGenderSchema>
export type Wetsuits = z.infer<typeof wetsuitsSchema>
export type StartType = z.infer<typeof startTypeSchema>
export type ChangeoverType = z.infer<typeof changeoverTypeSchema>
export type BriefingValues = z.infer<typeof briefingSchema>

export const otherGender = (gender: RaceGender): RaceGender =>
  gender === 'men' ? 'women' : 'men'
