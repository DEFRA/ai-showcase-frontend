/**
 * Shared content for the "AI at Defra" design prototypes.
 *
 * This is the renderVals() data lifted out of the three mockups' DCLogic classes
 * and moved server-side. It is passed to the Monument, Parcels and Daylight
 * controllers so every variant renders identical copy. Per-variant extras that a
 * single variant needs (Monument's ledger tilt values and status tone, Parcels'
 * parcel copy, Daylight's status area, the differing summary lengths) live
 * alongside each case study.
 */

export const caseStudies = [
  {
    num: '01',
    title: 'Forecasting air quality, street by street',
    status: 'Live pilot',
    statusTone: 'green',
    tilt: -14,
    area: 'Air quality',
    summaryMonument:
      'A correction model learns each monitoring site’s habits, so local authorities get an earlier, more local warning when pollution is likely to spike. Forecasters review every output; the model advises, people decide.',
    summaryDaylight:
      'A correction model learns each monitoring site’s habits, so local authorities get an earlier, more local warning when pollution is likely to spike. The model advises. People decide.',
    summaryParcels:
      'A correction model learns each monitoring site’s habits, so local authorities get an earlier, more local warning. The model advises. People decide.'
  },
  {
    num: '02',
    title: 'Faster checks for farm payments',
    status: 'Discovery',
    statusTone: 'amber',
    tilt: 8,
    area: 'Farm payments',
    summaryMonument:
      'Testing whether AI can pre-sort claim queries so caseworkers reach the hard cases sooner. No decisions are automated, and nothing changes for farmers unless the evidence holds.',
    summaryDaylight:
      'Testing whether AI can pre-sort claim queries so caseworkers reach the hard cases sooner. No decisions are automated.',
    summaryParcels:
      'Pre-sorting claim queries so caseworkers reach the hard cases sooner. Nothing is automated.'
  },
  {
    num: '03',
    title: 'Mapping peatland from above',
    status: 'Pilot',
    statusTone: 'green',
    tilt: -6,
    area: 'Nature recovery',
    summaryMonument:
      'Machine vision on aerial survey imagery helps field teams decide where restoration visits will do the most good across upland sites.',
    summaryDaylight:
      'Machine vision on aerial survey imagery helps field teams decide where restoration visits will do the most good.',
    summaryParcels:
      'Machine vision on aerial imagery points restoration teams to where visits do the most good.'
  },
  {
    num: '04',
    title: 'From idea to a Defra AI team in days',
    status: 'Live',
    statusTone: 'green',
    tilt: 12,
    area: 'Ways of working',
    summaryMonument:
      'A guided triage flow helps any Defra team describe a problem and find out quickly whether AI is the right tool for it, and what to do next if it isn’t.',
    summaryDaylight:
      'A guided triage flow helps any Defra team describe a problem and find out quickly whether AI is the right tool for it.',
    summaryParcels:
      'A guided triage flow tells any Defra team quickly whether AI is the right tool for their problem.'
  }
]

// Bodies are kept to roughly equal length (about two lines) so the three
// principle cards read as a set, not 4/3/2 uneven blocks.
export const principles = [
  {
    title: 'People decide, not the AI',
    body: 'No AI decides about a person, a farm or a river alone. A named person answers for every output.'
  },
  {
    title: 'Evidence before scale',
    body: 'Every pilot runs against a baseline set up front. If it does not beat it, we switch it off.'
  },
  {
    title: 'AI worth its footprint',
    body: 'We track the energy each AI model uses, and retire the ones that do not earn their keep.'
  }
]

export const posts = [
  {
    date: '30 June 2026',
    title: 'Why we publish our prompts',
    author: 'Steve Dickinson, delivery lead',
    authorInitials: 'SD',
    tag: 'Openness',
    tagTone: 'green',
    readingTime: '4 min',
    excerpt:
      'Publishing the prompt behind a tool is the cheapest openness we can offer, and the one people actually read. Here is how we decide what goes in.'
  },
  {
    date: '12 June 2026',
    title: 'Evaluating a forecast you can’t see',
    author: 'Ethan Summers, data scientist',
    authorInitials: 'ES',
    tag: 'Evaluation',
    tagTone: 'green',
    readingTime: '5 min',
    excerpt:
      'A correction model is only as good as the baseline you measure it against. We set ours before the pilot began, and it changed how we read the results.'
  },
  {
    date: '27 May 2026',
    title: 'Notes from our first assurance review',
    author: 'Steve Dickinson, delivery lead',
    authorInitials: 'SD',
    tag: 'Assurance',
    tagTone: 'amber',
    readingTime: '3 min',
    excerpt:
      'We put one of our live tools in front of an independent panel. Three things they asked for surprised us, and all three made the tool better.'
  },
  {
    date: '9 May 2026',
    title: 'When the answer is “don’t use AI”',
    author: 'Ethan Summers, data scientist',
    authorInitials: 'ES',
    tag: 'Triage',
    tagTone: 'dim',
    readingTime: '4 min',
    excerpt:
      'Most teams who come to us leave with a simpler fix than a model. Saying no early is part of the job, and we track how often we do it.'
  }
]

/**
 * Structured content for the redesigned inner pages. Each variant renders these
 * in its own visual idiom (Monument furrow rail, Parcels land-use plan, Daylight
 * ink gantt), so the copy is one source of truth. Deliberately no "transparency
 * register" references (that component was removed); openness is expressed as
 * "explain in the open".
 */
export const strategy = {
  focus: [
    {
      area: 'Forecasting and early warning',
      gain: 'A few hours of notice changes what people can do',
      example: 'Air quality'
    },
    {
      area: 'Sorting and routing work',
      gain: 'Specialists reach the cases that need judgement sooner',
      example: 'Farm payments'
    },
    {
      area: 'Reading the environment from imagery',
      gain: 'Field teams go where restoration does the most good',
      example: 'Peatland'
    }
  ],
  boundaries: [
    'Automating a decision about a person, a farm or a river',
    'Deploying an AI tool we cannot explain',
    'Scaling a pilot that has not beaten its baseline'
  ],
  measures: [
    {
      term: 'Baseline first',
      body: 'Agreed and written down before a pilot starts, never reconstructed after.'
    },
    {
      term: 'Explained in the open',
      body: 'We say in public what each live tool does and who is accountable for it.'
    },
    {
      term: 'Retire honestly',
      body: 'We publish what moved, what did not, and what we switched off.'
    }
  ],
  // focus[] and tracks[] are index-aligned; Monument strategy zips them by index.
  // `state` keys the Daylight gantt bars: 'committed' renders solid, 'planned'
  // renders as a hairline-outlined bar.
  tracks: [
    {
      name: 'Forecasting and early warning',
      from: 2026,
      to: 2028,
      phase: 'Scaling',
      state: 'committed'
    },
    {
      name: 'Sorting and routing work',
      from: 2026,
      to: 2027,
      phase: 'Piloting',
      state: 'committed'
    },
    {
      name: 'Reading the environment from imagery',
      from: 2027,
      to: 2028,
      phase: 'Discovery',
      state: 'planned'
    }
  ],
  milestone: { at: 'Spring 2027', label: 'Next public update' },
  nextUpdate: 'Spring 2027'
}

/** The journey a request takes, from idea to retirement. `branch` marks a fork. */
export const lifecycle = [
  {
    gate: 'Triage',
    decision: 'Is AI even the right tool?',
    outcome: 'Most teams leave with something simpler',
    branch: 'stop'
  },
  {
    gate: 'Baseline',
    decision: 'What does good look like, agreed up front?',
    outcome: 'Written down before any model is built'
  },
  {
    gate: 'Assurance',
    decision: 'Independent review before it goes live',
    outcome: 'The panel can send it back'
  },
  {
    gate: 'Live',
    decision: 'Explained in the open, with a named owner',
    outcome: 'A person is accountable for every output'
  },
  {
    gate: 'Measured',
    decision: 'Did it beat the baseline?',
    outcome: 'Scaled if yes, switched off if no'
  },
  {
    gate: 'Retired',
    decision: 'Still earning its energy and its keep?',
    outcome: 'Retired in the open when it stops',
    branch: 'off'
  }
]

/** Current openings. `tone` splits the team into build (green) and understand (amber). */
export const roles = [
  {
    title: 'Machine learning scientist',
    discipline: 'Science',
    area: 'Environmental models',
    band: 'G7',
    salary: '£54,000 to £62,000',
    location: 'London or remote',
    closing: '4 August 2026',
    owns: 'The environmental models behind live forecasts',
    tone: 'green',
    plate: 'contours'
  },
  {
    title: 'Machine learning engineer',
    discipline: 'Engineering',
    area: 'Geospatial AI',
    band: 'G7',
    salary: '£54,000 to £62,000',
    location: 'London, Bristol or remote',
    closing: '11 August 2026',
    owns: 'Getting geospatial AI into production and keeping it there',
    tone: 'green',
    plate: 'grid'
  },
  {
    title: 'Designer, AI services',
    discipline: 'Design',
    area: 'Public-facing services',
    band: 'SEO',
    salary: '£44,000 to £51,000',
    location: 'Hybrid',
    closing: '18 August 2026',
    owns: 'How AI shows up in public-facing services',
    tone: 'amber',
    plate: 'flow'
  },
  {
    title: 'User researcher, AI',
    discipline: 'Research',
    area: 'How people work with AI',
    band: 'SEO',
    salary: '£44,000 to £51,000',
    location: '12 months, hybrid',
    closing: '18 August 2026',
    owns: 'How people actually work alongside AI tools',
    tone: 'amber',
    plate: 'wave'
  }
]

/** How hiring runs, start to offer. */
export const hiringStages = [
  {
    stage: 'Apply',
    detail: 'Civil Service Jobs: a CV and a short statement',
    days: '15 min'
  },
  { stage: 'Sift', detail: 'Against the Success Profiles behaviours' },
  { stage: 'Technical exercise', detail: 'A take-home, no live coding' },
  { stage: 'Panel', detail: 'Two interviewers, one from the delivery team' },
  { stage: 'Offer', detail: 'Feedback either way, within a week' }
]

/** The one bar every role is held to. */
export const hiringBar = [
  'You care about getting it right in the open',
  'You are comfortable when the answer is "do not use AI"',
  'You do not need a government or environment background'
]

export const outcomes = [
  {
    figure: '4 hrs',
    label: 'Earlier delivery of local alerts to environmental health teams'
  },
  {
    figure: '12%',
    label: 'Improvement in site-level forecast accuracy over the pilot period'
  },
  { figure: '170', label: 'Monitoring sites covered by the correction model' }
]

/** Shared "air quality" case-study page facts, identical across variants. */
export const caseFacts = [
  {
    term: 'The network',
    body: 'About 170 UK-AIR monitoring sites report hourly. All readings were already public.'
  },
  {
    term: 'Oversight',
    body: 'A forecaster reviews every output before publication. Overrides are logged.'
  },
  {
    term: 'The data',
    body: 'Forecast history, observed readings and weather reanalysis. No personal data.'
  }
]

export const showcase = {
  caseStudies,
  principles,
  posts,
  outcomes,
  caseFacts,
  strategy,
  lifecycle,
  roles,
  hiringStages,
  hiringBar
}

export default showcase
