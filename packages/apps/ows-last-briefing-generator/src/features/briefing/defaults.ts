import type { BriefingValues } from './schema'

export const defaultBriefingValues: BriefingValues = {
  combinedBriefing: false,
  raceGender: 'men',
  distanceKm: 10,
  isRelay: false,
  hasIntermediateGate: false,
  hasTimeLimit: false,
  timeLimitText: '30 minutes after the first finisher',

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
  wetsuits: 'optional',

  courseShape: 'Triangle loop',
  courseDistance: '10 km',
  laps: '4 laps',
  turnBuoyColor: 'Yellow',
  guidanceBuoyNotes:
    'Turn clockwise around yellow turn buoys. White guidance buoys mark the course line.',

  startType: 'platform',

  feedingPlatformLocation: 'Right side after buoy 2',

  changeoverType: 'pontoon',
}
