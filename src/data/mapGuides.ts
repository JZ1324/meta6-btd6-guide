import type { ImageKey } from './images'

export type MapDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export type MapProfile = {
  name: string
  page: string
  slug: string
  difficulty: MapDifficulty
  hidden?: boolean
  laneProfile: string
  waterAccess: 'None' | 'Light' | 'Useful' | 'Heavy'
  sightlines: 'Open' | 'Mixed' | 'Blocked'
  placement: 'Open' | 'Moderate' | 'Tight'
  focus: string
  recommendation: string
  opening: string
  midgame: string
  lateGame: string
  coreTowers: string[]
  heroPool: string[]
  tags: string[]
  imageKey: ImageKey
}

export type GameMode = {
  name: string
  group: 'Easy' | 'Medium' | 'Hard'
  rounds: string
  rule: string
  economy: string
  priority: string
  opener: string
  plan: string
  finish: string
  danger: string
}

export type MapModeGuide = {
  id: string
  title: string
  map: MapProfile
  mode: GameMode
  summary: string
  steps: string[]
  priorityTowers: string[]
  warning: string
}

type MapSeed = string | { name: string; page?: string; hidden?: boolean }

const gameSlug = (value: string) =>
  value
    .replace('(BTD6)', '')
    .replace('#', '')
    .replace(/'/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const wikiPage = (name: string) => name.replace(/ /g, '_').replace('#', '')

const mapSeed = (seed: MapSeed) => (typeof seed === 'string' ? { name: seed } : seed)

const beginnerMaps: MapSeed[] = [
  'Monkey Meadow',
  'In The Loop',
  'Skull Tweak',
  "Three Mines 'Round",
  'Spa Pits',
  'Tinkerton',
  'Tree Stump',
  'Town Center',
  'Middle of the Road',
  'One Two Tree',
  'Scrapyard',
  'The Cabin',
  'Resort',
  'Skates',
  'Lotus Island',
  'Candy Falls',
  'Winter Park',
  'Carved',
  { name: 'Park Path', page: 'Park_Path_(BTD6)' },
  'Alpine Run',
  'Frozen Over',
  'Cubism',
  'Four Circles',
  'Hedge',
  'End of the Road',
  'Logs',
]

const intermediateMaps: MapSeed[] = [
  'Lost Crevasse',
  'Luminous Cove',
  'Ancient Portal',
  'Sulfur Springs',
  'Water Park',
  'Polyphemus',
  'Covered Garden',
  'Quarry',
  'Quiet Street',
  'Bloonarius Prime',
  'Balance',
  'Encrypted',
  'Bazaar',
  "Adora's Temple",
  'Spring Spring',
  'KartsNDarts',
  'Moon Landing',
  'Haunted',
  { name: 'Downstream', page: 'Downstream_(BTD6)' },
  'Firing Range',
  'Cracked',
  'Streambed',
  'Chutes',
  'Rake',
  'Spice Islands',
]

const advancedMaps: MapSeed[] = [
  'Mushroom Grotto',
  'Party Parade',
  'Sunset Gulch',
  'Enchanted Glade',
  'Last Resort',
  'Castle Revenge',
  'Dark Path',
  'Erosion',
  'Midnight Mansion',
  'Sunken Columns',
  'X Factor',
  'Mesa',
  'Geared',
  'Spillway',
  'Cargo',
  "Pat's Pond",
  'Peninsula',
  'High Finance',
  'Another Brick',
  'Off The Coast',
  'Cornfield',
  'Underground',
]

const expertMaps: MapSeed[] = [
  'Tricky Tracks',
  'Glacial Trail',
  'Dark Dungeons',
  'Sanctuary',
  'Ravine',
  'Flooded Valley',
  'Infernal',
  'Bloody Puddles',
  { name: 'Workshop', page: 'Workshop_(BTD6)' },
  'Quad',
  'Dark Castle',
  'Muddy Puddles',
  { name: '#Ouch', page: 'Ouch' },
]

const hiddenMaps: MapSeed[] = [
  { name: 'Protect The Yacht', hidden: true },
  { name: 'Blons', hidden: true },
]

const heavyWaterMaps = new Set([
  'Lotus Island',
  'Spice Islands',
  'Downstream',
  'Water Park',
  'Luminous Cove',
  'Polyphemus',
  'Off The Coast',
  'Peninsula',
  "Pat's Pond",
  'Cargo',
  'Spillway',
  'Flooded Valley',
  'Protect The Yacht',
])

const lightWaterMaps = new Set([
  'Monkey Meadow',
  'Town Center',
  'Tree Stump',
  'Frozen Over',
  'Alpine Run',
  'Spring Spring',
  'Sulfur Springs',
  'Firing Range',
  'Quiet Street',
  'Balance',
  'Encrypted',
  'Sunken Columns',
  'Dark Castle',
])

const multiLaneMaps = new Set([
  "Three Mines 'Round",
  'Spa Pits',
  'One Two Tree',
  'Chutes',
  'Rake',
  'Spring Spring',
  'KartsNDarts',
  'Bloonarius Prime',
  'Balance',
  'Bazaar',
  "Adora's Temple",
  'High Finance',
  'X Factor',
  'Mesa',
  'Geared',
  'Erosion',
  'Dark Path',
  'Castle Revenge',
  'Sunset Gulch',
  'Tricky Tracks',
  'Dark Dungeons',
  'Sanctuary',
  'Quad',
  'Muddy Puddles',
  'Bloody Puddles',
  '#Ouch',
  'Blons',
])

const blockedSightMaps = new Set([
  'Hedge',
  'The Cabin',
  'Covered Garden',
  'Quarry',
  'Encrypted',
  "Adora's Temple",
  'Moon Landing',
  'High Finance',
  'Cornfield',
  'Underground',
  'Mesa',
  'Workshop',
  'Ravine',
  'Infernal',
  'Dark Dungeons',
  'Glacial Trail',
])

const tightPlacementMaps = new Set([
  'Hedge',
  'Covered Garden',
  'Cornfield',
  'Geared',
  'Mesa',
  'Workshop',
  'Infernal',
  'Ravine',
  'Bloody Puddles',
  'Muddy Puddles',
  'Quad',
  '#Ouch',
  'Blons',
])

const longRouteMaps = new Set([
  'Logs',
  'Resort',
  'Scrapyard',
  'Cubism',
  'Candy Falls',
  'Four Circles',
  'Downstream',
  'Spice Islands',
  'Streambed',
  'Balance',
])

export const gameModes: GameMode[] = [
  {
    name: 'Easy',
    group: 'Easy',
    rounds: '1-40',
    rule: 'Standard cheap early clear.',
    economy: 'Loose cash curve',
    priority: 'Build clean fundamentals and save abilities for round 40.',
    opener: 'Start with a cheap lane holder, then add camo or lead coverage before it matters.',
    plan: 'Use low-cost upgrades and avoid overbuying panic towers.',
    finish: 'Have one MOAB answer ready by round 40.',
    danger: 'Round 40 MOAB if the build only handles bloons.',
  },
  {
    name: 'Primary Only',
    group: 'Easy',
    rounds: '1-40',
    rule: 'Only Primary towers can be placed.',
    economy: 'Loose cash curve',
    priority: 'Use Dart, Boomerang, Bomb, Tack, Ice, and Glue coverage deliberately.',
    opener: 'Use Dart or Tack for cheap pressure, then add Bomb/Glue/Ice for layers and control.',
    plan: 'Respect camo and lead limits; buy village support only if the game mode allows it in your version/event.',
    finish: 'Stack primary damage before the round 40 MOAB.',
    danger: 'Camo and lead checks can surprise primary-only routes.',
  },
  {
    name: 'Deflation',
    group: 'Easy',
    rounds: '31-60',
    rule: 'Fixed starting cash and no income.',
    economy: 'No income after setup',
    priority: 'Spend the full setup on coverage, not scaling.',
    opener: 'Pre-place a complete setup with camo, lead, ceramic, and MOAB coverage.',
    plan: 'Favor efficient static damage and buffs that work without upgrades later.',
    finish: 'Confirm round 59 camo-lead and round 60 BFB coverage.',
    danger: 'No recovery once the setup starts.',
  },
  {
    name: 'Medium',
    group: 'Medium',
    rounds: '1-60',
    rule: 'Standard medium clear.',
    economy: 'Normal',
    priority: 'Build into one reliable midgame carry.',
    opener: 'Open with cheap defense and buy camo, lead, and MOAB coverage on schedule.',
    plan: 'Transition from early darts/subs/ninja into a supported midgame carry.',
    finish: 'Round 60 needs BFB damage and ceramic cleanup.',
    danger: 'Round 59 camo leads and round 60 BFB.',
  },
  {
    name: 'Reverse',
    group: 'Medium',
    rounds: '1-60',
    rule: 'Bloons run the route backward.',
    economy: 'Normal',
    priority: 'Re-check entrance pressure and tower targeting.',
    opener: 'Place early defense near the new entrance rather than copying standard placement.',
    plan: 'Move support toward the new first-contact zone.',
    finish: 'Keep BFB cleanup near the reversed exit.',
    danger: 'Strong normal-mode exits can become weak reverse starts.',
  },
  {
    name: 'Military Only',
    group: 'Medium',
    rounds: '1-60',
    rule: 'Only Military towers can be placed.',
    economy: 'Normal',
    priority: 'Use Sniper/Sub/Buccaneer/Ace/Heli/Mortar/Dartling/Desperado coverage from map access.',
    opener: 'Choose a low-cost military starter that actually sees the first lane.',
    plan: 'Patch camo/lead with Sniper, Sub, Mortar, Ace, or Dartling paths.',
    finish: 'Bring focused MOAB damage before round 60.',
    danger: 'Maps without water or good line of sight can punish lazy military starts.',
  },
  {
    name: 'Apopalypse',
    group: 'Medium',
    rounds: '1-60',
    rule: 'Continuous rounds with no end-of-round cash.',
    economy: 'Pressure economy',
    priority: 'Buy early pierce and avoid fragile save-ups.',
    opener: 'Start with immediate, consistent pierce and layer control.',
    plan: 'Prefer upgrades that stabilize now over greedier future value.',
    finish: 'Have constant MOAB and ceramic cleanup before the pressure stacks.',
    danger: 'No breaks between waves means weak cleanup compounds quickly.',
  },
  {
    name: 'Hard',
    group: 'Hard',
    rounds: '1-80',
    rule: 'Standard hard clear.',
    economy: 'Normal',
    priority: 'Scale through ceramics, MOABs, BFBs, and the round 80 ZOMG.',
    opener: 'Use a proven starter and build toward a round 63 ceramic answer.',
    plan: 'Support the main DPS with Alchemist, Village, Glue, Ice, or stalls as the map allows.',
    finish: 'Round 80 needs ZOMG damage and cleanup.',
    danger: 'Round 63 ceramics and round 80 ZOMG.',
  },
  {
    name: 'Magic Monkeys Only',
    group: 'Hard',
    rounds: '1-80',
    rule: 'Only Magic towers can be placed.',
    economy: 'Normal',
    priority: 'Lean on Ninja, Alchemist, Wizard, Druid, Super, and Mermonkey access.',
    opener: 'Ninja or Druid starts are safest unless water/Mermonkey gives a cleaner route.',
    plan: 'Use Alchemist buffs, magic camo coverage, and a clear MOAB plan.',
    finish: 'Scale into a supported magic carry before the ZOMG.',
    danger: 'Lead/camo timing and expensive Super Monkey save-ups.',
  },
  {
    name: 'Double HP MOABs',
    group: 'Hard',
    rounds: '1-80',
    rule: 'MOAB-class bloons have double health.',
    economy: 'Normal',
    priority: 'Buy real MOAB DPS earlier than usual.',
    opener: 'Use normal early defense, but reserve cash for MOAB damage.',
    plan: 'Add debuffs, stalls, and focused MOAB damage before round 40 snowballs.',
    finish: 'Round 80 ZOMG is the final damage check.',
    danger: 'MOAB rounds that are normally comfortable become timeout checks.',
  },
  {
    name: 'Half Cash',
    group: 'Hard',
    rounds: '1-80',
    rule: 'Cash earned is heavily reduced.',
    economy: 'Very tight',
    priority: 'Every purchase must solve multiple rounds.',
    opener: 'Use the cheapest reliable starter and avoid redundant coverage.',
    plan: 'Buy efficient crosspaths and only add support when it clearly extends the carry.',
    finish: 'Plan round 63 and round 80 before spending on comfort.',
    danger: 'Overbuying early leaves no cash for the midgame.',
  },
  {
    name: 'Alternate Bloons Rounds',
    group: 'Hard',
    rounds: '3-80',
    rule: 'Harder alternate rounds with earlier special bloons.',
    economy: 'Tight timing',
    priority: 'Camo, lead, purple, and fortified checks arrive earlier.',
    opener: 'Open with coverage in mind, not just raw damage.',
    plan: 'Patch special properties before they appear, especially camo-lead and purples.',
    finish: 'Keep ceramic cleanup and MOAB damage balanced.',
    danger: 'Early special bloons punish incomplete coverage.',
  },
  {
    name: 'Impoppable',
    group: 'Hard',
    rounds: '6-100',
    rule: 'Expensive towers, one life, and round 100.',
    economy: 'Expensive',
    priority: 'Treat it like CHIMPS with farming and powers still available if desired.',
    opener: 'Use a tested start and avoid leaks because one life removes safety margin.',
    plan: 'Scale into late-game damage and reserve cash for rounds 95, 98, and 100.',
    finish: 'Bring DDT detection, round 98 control, and BAD damage.',
    danger: 'DDTs, round 98, and round 100 BAD.',
  },
  {
    name: 'CHIMPS',
    group: 'Hard',
    rounds: '6-100',
    rule: 'No continues, hearts lost, income, monkey knowledge, powers, or selling.',
    economy: 'No extra income',
    priority: 'Use a tested route with no selling and no farming.',
    opener: 'Use a precise map-safe start, then save toward a main carry without leaks.',
    plan: 'Support one or two carries with debuffs, stalls, camo, and DDT coverage.',
    finish: 'Plan exact answers for rounds 95, 98, 99, and 100.',
    danger: 'No recovery from a bad purchase or missed ability window.',
  },
]

function waterAccess(name: string): MapProfile['waterAccess'] {
  if (heavyWaterMaps.has(name)) return 'Heavy'
  if (lightWaterMaps.has(name)) return 'Useful'
  return 'None'
}

function laneProfile(name: string, difficulty: MapDifficulty) {
  if (multiLaneMaps.has(name)) return difficulty === 'Expert' ? 'Punishing multi-lane' : 'Multi-lane'
  if (longRouteMaps.has(name)) return 'Long forgiving route'
  if (difficulty === 'Expert') return 'Short expert route'
  return 'Single main route'
}

function placement(name: string, difficulty: MapDifficulty): MapProfile['placement'] {
  if (tightPlacementMaps.has(name)) return 'Tight'
  if (difficulty === 'Advanced' || difficulty === 'Expert') return 'Moderate'
  return 'Open'
}

function sightlines(name: string): MapProfile['sightlines'] {
  if (blockedSightMaps.has(name)) return 'Blocked'
  if (multiLaneMaps.has(name)) return 'Mixed'
  return 'Open'
}

function coreFor(profile: {
  difficulty: MapDifficulty
  waterAccess: MapProfile['waterAccess']
  placement: MapProfile['placement']
}) {
  if (profile.waterAccess === 'Heavy') return ['Monkey Sub', 'Monkey Buccaneer', 'Admiral Brickell', 'Village']
  if (profile.difficulty === 'Expert') return ['Geraldo', 'Ninja', 'Alchemist', 'Glue/Ice support']
  if (profile.placement === 'Tight') return ['Ninja', 'Alchemist', 'Sniper', 'Global support']
  return ['Dart/Ninja start', 'Alchemist', 'Village', 'Main DPS carry']
}

function heroesFor(difficulty: MapDifficulty, water: MapProfile['waterAccess']) {
  if (water === 'Heavy') return ['Admiral Brickell', 'Etienne', 'Geraldo']
  if (difficulty === 'Expert') return ['Geraldo', 'Corvus', 'Psi']
  if (difficulty === 'Advanced') return ['Sauda', 'Geraldo', 'Etienne']
  return ['Sauda', 'Quincy', 'Etienne']
}

function makeProfile(seed: MapSeed, difficulty: MapDifficulty): MapProfile {
  const map = mapSeed(seed)
  const page = map.page ?? wikiPage(map.name)
  const water = waterAccess(map.name)
  const lanes = laneProfile(map.name, difficulty)
  const place = placement(map.name, difficulty)
  const sight = sightlines(map.name)
  const hidden = map.hidden === true
  const tags = [difficulty, lanes, `${water} water`, `${sight} sightlines`, `${place} placement`]

  return {
    name: map.name,
    page,
    slug: gameSlug(map.name),
    difficulty,
    hidden,
    laneProfile: lanes,
    waterAccess: water,
    sightlines: sight,
    placement: place,
    focus: `${lanes}; ${water.toLowerCase()} water; ${sight.toLowerCase()} sightlines.`,
    recommendation:
      difficulty === 'Expert'
        ? 'Use tested openers, delay greed, and reserve support for rounds 95, 98, and 100.'
        : difficulty === 'Advanced'
          ? 'Scout obstacles and lane timing before committing to a carry.'
          : difficulty === 'Intermediate'
            ? 'Use the map gimmick or water access instead of forcing a generic build.'
            : 'Use this map to practice clean timing, camo/lead checks, and round 40/63/80 planning.',
    opening:
      difficulty === 'Expert'
        ? 'Start with a known-safe opener and place around the first dangerous lane.'
        : water === 'Heavy'
          ? 'Open with water pressure or a cheap land tower that protects early leaks.'
          : 'Open with a cheap tower that sees the longest early segment.',
    midgame:
      place === 'Tight'
        ? 'Commit to one efficient carry and buff it; do not scatter weak towers across cramped space.'
        : 'Build one main DPS core and add support only when the next property check needs it.',
    lateGame:
      difficulty === 'Expert'
        ? 'Pre-plan DDTs, round 98 density, and BAD damage before spending spare cash.'
        : 'Add ceramic cleanup, MOAB damage, and a final round 80 or 100 answer.',
    coreTowers: coreFor({ difficulty, waterAccess: water, placement: place }),
    heroPool: heroesFor(difficulty, water),
    tags,
    imageKey: hidden ? 'lateGameRound' : 'bossRound',
  }
}

export const mapProfiles: MapProfile[] = [
  ...beginnerMaps.map((map) => makeProfile(map, 'Beginner')),
  ...intermediateMaps.map((map) => makeProfile(map, 'Intermediate')),
  ...advancedMaps.map((map) => makeProfile(map, 'Advanced')),
  ...expertMaps.map((map) => makeProfile(map, 'Expert')),
  makeProfile(hiddenMaps[0], 'Intermediate'),
  makeProfile(hiddenMaps[1], 'Expert'),
]

export function buildMapModeGuide(map: MapProfile, mode: GameMode): MapModeGuide {
  const id = `${map.slug}-${gameSlug(mode.name)}`
  const hardMap = map.difficulty === 'Advanced' || map.difficulty === 'Expert'
  const waterLine =
    map.waterAccess === 'Heavy'
      ? 'Use water towers aggressively; Sub/Buccaneer/Brickell lines are part of the map identity.'
      : map.waterAccess === 'Useful'
        ? 'Check whether water gives a cleaner camo or MOAB answer than land-only towers.'
        : 'Do not rely on water access; solve the lane with land, global, or flying towers.'
  const mapWarning =
    map.placement === 'Tight'
      ? 'Placement is tight, so every tower must cover a real round range.'
      : map.sightlines === 'Blocked'
        ? 'Line of sight is blocked, so global towers or carefully opened angles matter.'
        : map.laneProfile.includes('Multi')
          ? 'Multiple lanes mean weak cleanup can leak even when the main carry looks strong.'
          : 'The route is mostly readable; focus on clean timing rather than overbuilding.'

  return {
    id,
    title: `${map.name} ${mode.name}`,
    map,
    mode,
    summary: `${mode.name} on ${map.name}: ${mode.priority} ${waterLine}`,
    steps: [
      `Open: ${mode.opener} ${map.opening}`,
      `Stabilize: ${mode.plan} ${map.midgame}`,
      `Finish: ${mode.finish} ${map.lateGame}`,
      `Map check: ${mapWarning}`,
    ],
    priorityTowers: hardMap
      ? [...map.coreTowers, 'Stall/debuff support']
      : [...map.coreTowers, 'Cheap cleanup'],
    warning: `${mode.danger} ${mapWarning}`,
  }
}

export const totalMapModeGuides = mapProfiles.length * gameModes.length
