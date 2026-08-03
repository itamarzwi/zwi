import type { BriefingValues, RaceGender } from './schema'
import { otherGender } from './schema'

const genderLabel = (gender: RaceGender) =>
  gender === 'men' ? "men's" : "women's"

const chiefIntro = (values: BriefingValues) => {
  const chief = values.chiefRefereeName.trim() || '—'
  if (values.combinedBriefing) {
    return `Good morning, my name is ${chief} and I will be the chief referee for today's ${genderLabel(values.raceGender)} race.`
  }
  return `Good morning, my name is ${chief} and I will be the chief referee for today's race.`
}

const refereeLines = (values: BriefingValues) => {
  const lines: Array<string> = []
  const push = (role: string, name: string, gender?: RaceGender) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const genderTag =
      values.combinedBriefing && gender ? ` (${genderLabel(gender)})` : ''
    lines.push(`${lines.length + 1}. ${role}${genderTag}: ${trimmed}`)
  }

  const own = values.combinedBriefing ? values.raceGender : undefined
  push('Referee 1', values.referee1Name, own)
  push('Referee 2', values.referee2Name, own)

  if (values.combinedBriefing) {
    const other = otherGender(values.raceGender)
    push('Chief Referee', values.otherChiefRefereeName, other)
    push('Referee 1', values.otherReferee1Name, other)
    push('Referee 2', values.otherReferee2Name, other)
  }

  return lines
}

const formatTemp = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return '—'
  if (trimmed.includes('°')) return trimmed
  return `${trimmed}°`
}

const wetsuitsParagraph = (values: BriefingValues) => {
  switch (values.wetsuits) {
    case 'compulsory':
      return 'Wetsuits are compulsory for this race.'
    case 'optional':
      return 'Wetsuits are optional for this race.'
    case 'not_allowed':
      return 'Wetsuits are not allowed for this race.'
    case 'omit':
    default:
      return null
  }
}

const formatKm = (value: number) => {
  const rounded = Math.round(value * 1000) / 1000
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

const formatLapCount = (value: number) => {
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

export const lapDistanceFromCount = (distanceKm: number, lapCount: number) =>
  lapCount > 0 && distanceKm > 0
    ? Math.floor((distanceKm * 1000) / lapCount) / 1000
    : 0

export const lapCountFromDistance = (
  distanceKm: number,
  lapDistanceKm: number,
) =>
  lapDistanceKm > 0 && distanceKm > 0
    ? Math.round((distanceKm / lapDistanceKm) * 100) / 100
    : 0

const buoyNoun = (count: number, kind: 'turning' | 'guidance') => {
  const base = kind === 'turning' ? 'turning buoy' : 'guidance buoy'
  return count === 1 ? base : `${base}s`
}

const courseBlock = (values: BriefingValues) => {
  const turnColour = values.turnBuoyColor.trim() || '—'
  const guidanceColour = values.guidanceBuoyColor.trim() || '—'
  const turnCount = values.turnBuoyCount
  const guidanceCount = values.guidanceBuoyCount
  const side = values.turnSide
  const lapCount = values.lapCount > 0 ? values.lapCount : null
  const lapDistanceKm = values.lapDistanceKm > 0 ? values.lapDistanceKm : null

  return [
    'The course of the race will be the same as what was shown at the Teams Meeting.',
    `We have ${turnCount} ${turnColour} ${buoyNoun(turnCount, 'turning')} and ${guidanceCount} ${guidanceColour} ${buoyNoun(guidanceCount, 'guidance')}.`,
    `You must pass the ${turnColour} turning buoys with your ${side} shoulder. That means the buoys are on your ${side} when you go around them.`,
    `You can pass the ${guidanceColour} guidance buoys on either side.`,
    lapCount != null ? `The number of laps is ${formatLapCount(lapCount)}.` : null,
    values.distanceKm > 0
      ? `The race distance is ${formatKm(values.distanceKm)} km.`
      : null,
    lapDistanceKm != null
      ? `Each lap is ${formatKm(lapDistanceKm)} km.`
      : null,
  ]
    .filter(Boolean)
    .join(' ')
}

const startSignal = () =>
  'For the start we will do several short whistles and hold up a green flag, then point the flag at the Starter.'

const startBlock = (values: BriefingValues) => {
  if (values.startType === 'in_water') {
    return [
      'You will start the race from inside the water.',
      startSignal(),
      "The starter will say \"Take your marks\", then start the race with an air horn and a flag signal.",
    ].join(' ')
  }

  return [
    'We will have a diving start. Your position on the start platform is based on your number. Please stand where your number is marked.',
    startSignal(),
    "The starter will say \"Take your marks\", and you must take your starting position, with one foot touching the front of the platform.",
    "If you don't take your starting position, you may receive a yellow flag.",
    'Then the starter will start the race with an air horn and a flag signal.',
  ].join(' ')
}

const timeLimitMinutes = (distanceKm: number) =>
  Math.ceil((distanceKm * 2) / 10) * 10

const conductionBlock = (values: BriefingValues) => {
  const lines = [
    'During the race, a yellow flag is an official warning, and a red flag means you are disqualified, but any infringement in the finish funnel will lead to an immediate red flag.',
    'We will also use a signal if you must leave the water (demonstrate signal).',
    'If there is an emergency abandonment, we will signal it with long whistles and a red flag waved overhead. If you see or hear this signal, you must listen to the safety boats and leave the water.',
    `The time limit for today's race is ${timeLimitMinutes(values.distanceKm)} minutes after the first finisher.`,
  ]

  if (values.hasIntermediateGate) {
    lines.push(
      'We have an intermediate gate, you must swim through it. If you don\'t, you will be disqualified.',
    )
  }

  return lines.join(' ')
}

const endBlock = () =>
  [
    'The finish is marked by a finish funnel with orange buoys.',
    'You must enter through the funnel entrance.',
    'If you go over or under the funnel, you will be disqualified.',
    'If you miss the entrance, you must turn back, enter the funnel, and then finish.',
  ].join(' ')

const changeoverBlock = (values: BriefingValues) => {
  if (values.changeoverType === 'in_water') {
    return [
      'Relay changeover is in the water.',
      'The change is made when there is body contact with the current swimmer.',
      'Do not leave early — wait for a legal change.',
    ].join(' ')
  }

  return [
    'Relay changeover is from the change pontoon.',
    'Jump only after the touch.',
    'Keep one hand on the pontoon until the change has been made.',
  ].join(' ')
}

export type BriefingSection = {
  title: string
  body: string
}

export const generateBriefing = (values: BriefingValues): BriefingSection[] => {
  const safety = values.safetyOfficerName.trim() || '—'
  const officials = refereeLines(values)

  const intro = [
    chiefIntro(values),
    officials.length > 0
      ? `Together with me are:\n${officials.join('\n')}`
      : null,
    `And our safety officer is ${safety}.`,
  ]
    .filter(Boolean)
    .join('\n')

  const weatherParts = [
    `The water temperature is ${formatTemp(values.waterTemp)}, air temperature is ${formatTemp(values.airTemp)}.`,
    values.weatherNotes.trim() || null,
    wetsuitsParagraph(values),
  ].filter(Boolean)

  const sections: BriefingSection[] = [
    { title: 'Intro', body: intro },
    { title: 'Weather conditions', body: weatherParts.join('\n') },
    { title: 'Course layout', body: courseBlock(values) },
    { title: 'Start of the race', body: startBlock(values) },
    {
      title: 'Conduction of the race & infringements',
      body: conductionBlock(values),
    },
    { title: 'End of the race', body: endBlock() },
    {
      title: 'Medical and safety',
      body: [
        'When you get on the start platform you must bring your accreditation.',
        'When you leave the water for any reason you must take your accreditation back.',
        'You cannot leave the water without taking your accreditation back.',
        'If you feel bad, need help, or want to leave the water for any reason during the race, turn on your back and raise your arm in the air. A boat will come to you.',
      ].join(' '),
    },
    { title: 'Wildlife', body: '[Wildlife]' },
  ]

  if (values.distanceKm > 5) {
    sections.push({
      title: 'Feeding',
      body: 'Grabbing the feeding pole is forbidden and may lead to disqualification.',
    })
  }

  if (values.isRelay) {
    sections.push({ title: 'Changeover', body: changeoverBlock(values) })
  }

  return sections
}

export const briefingToPlainText = (sections: BriefingSection[]) =>
  sections.map(({ title, body }) => `${title}\n${body}`).join('\n\n')
