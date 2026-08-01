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

const courseBlock = (values: BriefingValues) => {
  const parts = [
    values.courseShape.trim() && `Shape: ${values.courseShape.trim()}.`,
    values.courseDistance.trim() &&
      `Distance: ${values.courseDistance.trim()}.`,
    values.laps.trim() && `Laps: ${values.laps.trim()}.`,
    values.turnBuoyColor.trim() &&
      `Turn buoy colour: ${values.turnBuoyColor.trim()}.`,
    values.guidanceBuoyNotes.trim() && values.guidanceBuoyNotes.trim(),
  ].filter(Boolean)

  if (parts.length === 0) {
    return 'Course details will be confirmed on site.'
  }
  return parts.join(' ')
}

const startBlock = (values: BriefingValues) => {
  if (values.startType === 'in_water') {
    return [
      'You will start the race from inside the water.',
      'The Chief Referee will signal that the start is imminent with several short whistle blasts and a green flag held upright, then point the flag at the Starter.',
      'On the Starter\'s command “Take your marks”, take your starting position on the start line immediately.',
      'The Starter will start the race with an audible signal (air horn) and a visual flag signal.',
    ].join(' ')
  }

  return [
    'We will have diving start. Your position on the start platform is based on your number.',
    'The Chief Referee will signal that the start is imminent with several short whistle blasts and a green flag held upright, then point the flag at the Starter.',
    'On the Starter\'s command “Take your marks”, you must immediately take your starting position with at least one foot in contact with the front of the starting platform.',
    'The Starter will start the race with an audible signal (air horn) and a visual flag signal.',
  ].join(' ')
}

const conductionBlock = (values: BriefingValues) => {
  const lines = [
    'During the race, officials may issue warnings with whistle signals, a yellow flag, or a red flag.',
    'A signal will be used for removal from the water.',
    'Any infringement in the finish funnel results in a red flag immediately.',
    'In case of emergency, the race may be abandoned.',
  ]

  if (values.hasTimeLimit) {
    const detail = values.timeLimitText.trim()
    lines.push(
      detail
        ? `Time limit: ${detail}.`
        : 'A time limit applies; athletes outside the limit may be removed from the water.',
    )
  }

  if (values.hasIntermediateGate) {
    lines.push(
      'You must swim through the intermediate gate. If you miss it, you may only correct the course if it is safe, does not interfere with others, is corrected before the next turn buoy, and no unfair advantage is gained.',
    )
  }

  return lines.join(' ')
}

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

export const generateBriefing = (values: BriefingValues): string => {
  const safety = values.safetyOfficerName.trim() || '—'
  const officials = refereeLines(values)

  const intro = [
    chiefIntro(values),
    officials.length > 0 ? `Together with me are:\n${officials.join('\n')}` : null,
    `And our safety officer is ${safety}.`,
  ]
    .filter(Boolean)
    .join('\n')

  const weatherParts = [
    `The water temperature is ${formatTemp(values.waterTemp)}, air temperature is ${formatTemp(values.airTemp)}.`,
    values.weatherNotes.trim() || null,
    wetsuitsParagraph(values),
  ].filter(Boolean)

  const sections: Array<[string, string]> = [
    ['Intro', intro],
    ['Weather conditions', weatherParts.join('\n')],
    ['Course layout', courseBlock(values)],
    ['Start of the race', startBlock(values)],
    ['Conduction of the race & infringements', conductionBlock(values)],
    [
      'End of the race',
      [
        'The finish is through a finish funnel marked with orange buoys.',
        'You MUST ENTER THE FUNNEL.',
        'If you go below or above the funnel, you will be disqualified.',
        'If you miss the funnel, go back and enter it.',
      ].join(' '),
    ],
    [
      'Medical and safety',
      [
        'When you get on the start platform you must bring your accreditation.',
        'When you leave the water for any reason you must take your accreditation back.',
        'You cannot leave the water without taking your accreditation back.',
        'If you feel bad, need help, or want to leave the water for any reason during the race, turn on your back and raise your arm in the air. A boat will come to you.',
      ].join(' '),
    ],
  ]

  if (values.distanceKm > 5) {
    const location =
      values.feedingPlatformLocation.trim() || 'as indicated on the course'
    sections.push([
      'Feeding',
      [
        `The feeding platform is ${location}.`,
        'Do not grab the feeding pole.',
      ].join(' '),
    ])
  }

  if (values.isRelay) {
    sections.push(['Changeover', changeoverBlock(values)])
  }

  return sections.map(([title, body]) => `## ${title}\n${body}`).join('\n\n')
}
