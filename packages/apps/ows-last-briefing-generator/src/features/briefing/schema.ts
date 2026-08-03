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
export const turnSideSchema = z.enum(['left', 'right'])

export const briefingSchema = z.object({
  verbose: z.boolean(),
  combinedBriefing: z.boolean(),
  raceGender: raceGenderSchema,
  distanceKm: z.number().min(0).nullable(),
  isRelay: z.boolean(),
  hasIntermediateGate: z.boolean(),

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

  lapCount: z.number().min(0).nullable(),
  lapDistanceKm: z.number().min(0).nullable(),
  turnBuoyCount: z.number().min(0).nullable(),
  turnBuoyColor: z.string(),
  guidanceBuoyCount: z.number().min(0).nullable(),
  guidanceBuoyColor: z.string(),
  turnSide: turnSideSchema,

  startType: startTypeSchema,
  finishFunnelBuoyColor: z.string(),

  changeoverType: changeoverTypeSchema,
})

export type RaceGender = z.infer<typeof raceGenderSchema>
export type Wetsuits = z.infer<typeof wetsuitsSchema>
export type StartType = z.infer<typeof startTypeSchema>
export type ChangeoverType = z.infer<typeof changeoverTypeSchema>
export type TurnSide = z.infer<typeof turnSideSchema>
export type BriefingValues = z.infer<typeof briefingSchema>

export const otherGender = (gender: RaceGender): RaceGender =>
  gender === 'men' ? 'women' : 'men'
