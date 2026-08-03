import type { BriefingValues } from './schema'

export const defaultBriefingValues: BriefingValues = {
  verbose: false,
  combinedBriefing: false,
  raceGender: 'men',
  distanceKm: 10,
  isRelay: false,
  hasIntermediateGate: true,

  chiefRefereeName: 'YOUR_NAME',
  referee1Name: 'REF_1',
  referee2Name: 'REF_2',
  otherChiefRefereeName: 'OTHER_CHIEF',
  otherReferee1Name: 'OTHER_REF_1',
  otherReferee2Name: 'OTHER_REF_2',
  safetyOfficerName: 'SAFETY_OFFICER',

  waterTemp: '21',
  airTemp: '26',
  weatherNotes:
    'Light breeze expected, mostly sunny with a low chance of brief showers.',
  wetsuits: 'omit',

  lapCount: 6,
  lapDistanceKm: 1.66,
  turnBuoyCount: 4,
  turnBuoyColor: 'yellow',
  guidanceBuoyCount: 2,
  guidanceBuoyColor: 'red',
  turnSide: 'left',

  startType: 'platform',
  finishFunnelBuoyColor: 'orange',

  changeoverType: 'pontoon',
}
