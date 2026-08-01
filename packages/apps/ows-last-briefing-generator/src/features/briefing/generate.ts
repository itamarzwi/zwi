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

const parseLeadingNumber = (value: string) => {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
}

const courseBlock = (values: BriefingValues) => {
  const shape = values.courseShape.trim() || '—'
  const turnColour = values.turnBuoyColor.trim() || '—'
  const description = values.guidanceBuoyNotes.trim()
  const lapsText = values.laps.trim() || '—'
  const distanceKm = values.distanceKm

  const descriptionSentence = description
    ? ` ${description.replace(/\.*$/, '')}.`
    : ''

  const lapCount = parseLeadingNumber(lapsText)
  const lapLengthSentence =
    lapCount && lapCount > 0 && distanceKm > 0
      ? `Each lap is ${Math.floor((distanceKm * 1000) / lapCount) / 1000} km.`
      : null

  return [
    'The swimming course of the race is as provided to you at the Teams Meeting.',
    `You are required to round the ${turnColour} turning buoys on a ${shape} course.${descriptionSentence}`,
    'All other buoys are directional only.',
    'You are required to swim the complete course.',
    `The number of laps is ${lapsText}.`,
    distanceKm > 0 ? `The race distance is ${distanceKm} km.` : null,
    lapLengthSentence,
  ]
    .filter(Boolean)
    .join(' ')
}

const startSignal = () =>
  'The Chief Referee will signal that the start is about to begin with several short whistle blasts and a green flag held up, then point the flag at the Starter.'

const startBlock = (values: BriefingValues) => {
  if (values.startType === 'in_water') {
    return [
      'You will start the race from inside the water.',
      startSignal(),
      'On the Starter’s command “Take your marks”, take your starting position on the start line at once.',
      'The Starter will start the race with an air horn and a flag signal.',
    ].join(' ')
  }

  return [
    'We will have a diving start. Your position on the start platform is based on your number.',
    startSignal(),
    'On the Starter’s command “Take your marks”, you must take your starting position at once, with at least one foot touching the front of the starting platform.',
    'The Starter will start the race with an air horn and a flag signal.',
  ].join(' ')
}

const conductionBlock = (values: BriefingValues) => {
  const lines = [
    'During the race, officials may use whistle signals to get your attention.',
    'A yellow flag is an official warning.',
    'A red flag means you are disqualified.',
    'Officials will also use a clear signal if you must leave the water.',
    'Any infringement in the finish funnel leads to a red flag at once and you are disqualified.',
    'If the race must be stopped for safety, officials will signal emergency abandonment with repeated long whistle blasts and a red flag waved overhead — I will demonstrate this signal now. When you see or hear that signal, stop racing and leave the water as directed by the safety boats.',
  ]

  if (values.hasTimeLimit) {
    const detail = values.timeLimitText.trim()
    lines.push(
      detail
        ? `A time limit applies: ${detail}. Athletes outside the limit may be removed from the water.`
        : 'A time limit applies. Athletes outside the limit may be removed from the water.',
    )
  }

  if (values.hasIntermediateGate) {
    lines.push(
      'You must swim through the intermediate gate. If you miss it, you may only go back and correct your course if it is safe, you do not interfere with other athletes, you correct it before the next turn buoy, and you gain no unfair advantage.',
    )
  }

  return lines.join(' ')
}

const endBlock = () =>
  [
    'The finish is marked by a finish funnel with orange buoys.',
    'To record a valid finish, you must enter and swim through the funnel.',
    'If you swim outside the funnel — above or below the line of buoys — you will be disqualified.',
    'If you miss the entrance to the funnel, you must turn back, enter the funnel correctly, and then finish.',
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
  ]

  if (values.distanceKm > 5) {
    const location =
      values.feedingPlatformLocation.trim() || 'as indicated on the course'
    sections.push({
      title: 'Feeding',
      body: [
        `The feeding platform is ${location}.`,
        'Grabbing the feeding pole is forbidden and may lead to disqualification.',
      ].join(' '),
    })
  }

  if (values.isRelay) {
    sections.push({ title: 'Changeover', body: changeoverBlock(values) })
  }

  return sections
}

export const briefingToPlainText = (sections: BriefingSection[]) =>
  sections.map(({ title, body }) => `${title}\n${body}`).join('\n\n')

