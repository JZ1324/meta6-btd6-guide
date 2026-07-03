import { sourceLinks } from './images'

export type BeginnerSource = {
  label: string
  url: string
}

export type BeginnerUnlock = {
  rank: number
  title: string
  kind: 'Tower XP' | 'Hero' | 'Monkey Knowledge' | 'Account habit'
  priority: string
  why: string
  firstGoal: string
  avoid: string
  tags: string[]
  sources: BeginnerSource[]
}

export type BeginnerMapStage = {
  id: string
  title: string
  level: string
  mapNames: string[]
  goal: string
  medals: string[]
  unlockFocus: string[]
  danger: string
  nextAction: string
  sources: BeginnerSource[]
}

export type BeginnerRule = {
  title: string
  detail: string
}

export const beginnerSources = {
  maps: { label: 'Bloons Wiki maps', url: sourceLinks.wikiMaps },
  beginnerMaps: { label: 'Bloons Wiki beginner maps', url: sourceLinks.wikiBeginnerDifficulty },
  medals: { label: 'Bloons Wiki medals', url: sourceLinks.wikiMedals },
  monkeyKnowledge: { label: 'Bloons Wiki monkey knowledge', url: sourceLinks.wikiMonkeyKnowledge },
  beginnerVideo: { label: 'Beginner guide video', url: sourceLinks.beginnerGuideVideo },
  knowledgeVideo: { label: 'Recent monkey knowledge guide', url: sourceLinks.beginnerKnowledgeVideo },
  mapPlaylist: { label: 'Beginner map tutorial playlist', url: sourceLinks.beginnerMapsPlaylist },
} satisfies Record<string, BeginnerSource>

export const beginnerUnlocks: BeginnerUnlock[] = [
  {
    rank: 1,
    title: 'Level core towers before chasing hard medals',
    kind: 'Tower XP',
    priority: 'Dart, Tack, Boomerang, Bomb, Ninja, Alchemist, Village, Spike Factory',
    why: 'These unlock cheap early defense, buffs, camo/lead coverage, and backline safety. They make most beginner and intermediate maps easier without farming.',
    firstGoal: 'Get useful tier-3 and tier-4 paths: Ninja 4xx/xx4, Alchemist 4xx, Village x2x/2xx, Tack xx4, Spike Factory xx4.',
    avoid: 'Do not grind one flashy tower while the support roster is still 0-0-0.',
    tags: ['tower xp', 'first unlocks', 'support core'],
    sources: [beginnerSources.maps, beginnerSources.beginnerVideo],
  },
  {
    rank: 2,
    title: 'Buy Sauda first for simple map clears',
    kind: 'Hero',
    priority: 'Sauda first, then Benjamin or Etienne depending on playstyle',
    why: 'Sauda handles early rounds on many beginner maps and lets a new player focus on learning camo, lead, MOABs, and upgrades.',
    firstGoal: 'Use Sauda on single-lane beginner maps; use Quincy when saving monkey money; use Benjamin later for farm-heavy non-CHIMPS play.',
    avoid: 'Do not buy expensive heroes before you know whether you need early carry, economy, or global camo.',
    tags: ['heroes', 'sauda', 'quincy', 'benjamin', 'etienne'],
    sources: [beginnerSources.beginnerVideo],
  },
  {
    rank: 3,
    title: 'Spend early Monkey Knowledge on economy and consistency',
    kind: 'Monkey Knowledge',
    priority: 'More Cash, Bonus Monkey, Monkey Education, Mo Monkey Money, hero cost/XP boosts',
    why: 'Early knowledge should make every run smoother: more starting room, faster tower XP, more monkey money, and earlier hero levels.',
    firstGoal: 'Treat these as targets, not a perfect tree order; some knowledge needs prerequisites before it appears.',
    avoid: 'Do not rush niche late-game knowledge before basic economy, XP, and hero consistency.',
    tags: ['monkey knowledge', 'account xp', 'monkey money', 'heroes'],
    sources: [beginnerSources.monkeyKnowledge, beginnerSources.knowledgeVideo],
  },
  {
    rank: 4,
    title: 'Unlock camo, lead, and MOAB answers on purpose',
    kind: 'Tower XP',
    priority: 'Camo before round 24, lead before round 28, MOAB damage before round 40',
    why: 'Most beginner losses happen because the build misses a property check, not because the player lacks a late-game tower.',
    firstGoal: 'Use Ninja, Sub, Sniper, Wizard, Village, Bomb, Alchemist, or hero abilities to cover these checks.',
    avoid: 'Do not enter round 40 with only bloon cleanup and no focused MOAB damage.',
    tags: ['camo', 'lead', 'moab', 'round 40'],
    sources: [beginnerSources.medals, beginnerSources.beginnerVideo],
  },
  {
    rank: 5,
    title: 'Farm medals broadly instead of grinding freeplay',
    kind: 'Account habit',
    priority: 'Clear Easy, Medium, and Hard on many maps before pushing deep freeplay',
    why: 'New medals teach different rounds and map layouts, while freeplay is a slower way to learn the core game.',
    firstGoal: 'Move across beginner maps, then repeat the same pattern on forgiving intermediate maps.',
    avoid: 'Do not sit in freeplay with low-level towers if the goal is learning and unlocking practical upgrades.',
    tags: ['medals', 'maps', 'xp route', 'beginner maps'],
    sources: [beginnerSources.medals, beginnerSources.maps],
  },
]

export const beginnerMapStages: BeginnerMapStage[] = [
  {
    id: 'first-medals',
    title: 'First medals',
    level: 'Tutorial to early account levels',
    mapNames: ['Town Center', 'Monkey Meadow', 'Tree Stump', 'In The Loop'],
    goal: 'Learn tower placement, round 24 camo, round 28 lead, and round 40 MOAB timing.',
    medals: ['Easy Standard', 'Medium Standard', 'Hard Standard'],
    unlockFocus: ['Dart / Tack starters', 'Ninja camo', 'Bomb or Alchemist lead', 'One MOAB answer'],
    danger: 'Buying too many random towers instead of one upgraded carry.',
    nextAction: 'After Hard feels comfortable, try Magic Monkeys Only and Double HP MOABs on the same maps.',
    sources: [beginnerSources.beginnerMaps, beginnerSources.medals],
  },
  {
    id: 'long-safe-routes',
    title: 'Safe XP route',
    level: 'Beginner medals',
    mapNames: ['Logs', 'Resort', 'Cubism', 'Candy Falls', 'Four Circles'],
    goal: 'Use long tracks to level towers and practice clean save-ups without harsh leaks.',
    medals: ['Easy medals', 'Medium medals', 'Hard medals', 'First Impoppable attempts'],
    unlockFocus: ['Alchemist buffs', 'Village support', 'Spike Factory backline', 'Hero leveling'],
    danger: 'The map is forgiving, so bad habits can still pass. Check whether the build would survive shorter tracks.',
    nextAction: 'Use these maps to learn one full build from start to round 80 before moving up.',
    sources: [beginnerSources.beginnerMaps, beginnerSources.mapPlaylist],
  },
  {
    id: 'water-and-angles',
    title: 'Water and angles',
    level: 'Beginner to intermediate transition',
    mapNames: ['Lotus Island', 'Frozen Over', 'Town Center', 'Downstream'],
    goal: 'Learn when Sub, Buccaneer, and Brickell-style water setups are stronger than forcing land towers.',
    medals: ['Military Only', 'Reverse', 'Hard Standard'],
    unlockFocus: ['Monkey Sub', 'Buccaneer', 'Sniper support', 'Village camo support'],
    danger: 'Ignoring water on maps where it gives the cleanest line or cheapest camo solution.',
    nextAction: 'Try Downstream after beginner water maps feel routine.',
    sources: [beginnerSources.maps, beginnerSources.beginnerVideo],
  },
  {
    id: 'blocked-sightlines',
    title: 'Blocked sightlines',
    level: 'Hard medals practice',
    mapNames: ['Hedge', 'The Cabin', 'Carved', 'One Two Tree'],
    goal: 'Practice global damage, obstacle-aware placement, and support footprints before advanced maps.',
    medals: ['Hard Standard', 'Alternate Bloons Rounds', 'Impoppable on the easier picks'],
    unlockFocus: ['Sniper', 'Ninja', 'Ace', 'Mortar', 'Village placement'],
    danger: 'Strong towers can be bad if terrain blocks the lane they need to hit.',
    nextAction: 'When these feel stable, start adding CHIMPS rules on the easiest beginner maps.',
    sources: [beginnerSources.beginnerMaps, beginnerSources.mapPlaylist],
  },
  {
    id: 'intermediate-gate',
    title: 'Intermediate gate',
    level: 'Ready for harder maps',
    mapNames: ['Streambed', 'Cracked', 'Firing Range', 'Balance', 'Encrypted'],
    goal: 'Move into intermediate layouts while keeping the same round-check discipline.',
    medals: ['Easy to Hard', 'ABR', 'First CHIMPS attempts on easier maps only'],
    unlockFocus: ['DDT preparation', 'Ceramic cleanup', 'Alchemist/Village support discipline'],
    danger: 'Jumping into expert maps before round 63, 78, 95, and 98 are understood.',
    nextAction: 'Use the Guides tab for CHIMPS once Hard/Impoppable clears are consistent.',
    sources: [beginnerSources.maps, beginnerSources.medals],
  },
]

export const beginnerRules: BeginnerRule[] = [
  {
    title: 'One carry, then support',
    detail: 'A buffed main tower usually beats five weak unbuffed towers. Upgrade one plan before adding comfort towers.',
  },
  {
    title: 'Check properties before they arrive',
    detail: 'Camo by 24, lead by 28, MOAB damage by 40, ceramic control by 63, DDT coverage by 90.',
  },
  {
    title: 'Use beginner maps as labs',
    detail: 'Repeat the same build on Logs, Resort, and Cubism to learn whether it is actually reliable.',
  },
  {
    title: 'Do not rush CHIMPS',
    detail: 'CHIMPS removes knowledge, selling, farms, powers, and continues. Learn Hard and Impoppable timing first.',
  },
]
