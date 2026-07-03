const localAssets = import.meta.glob<string>('../assets/btd6/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const localAsset = (path: string) => {
  const src = localAssets[`../assets/btd6/${path}`]

  if (!src) {
    throw new Error(`Missing BTD6 asset: ${path}`)
  }

  return src
}

const localAssetOptional = (path: string) => localAssets[`../assets/btd6/${path}`]

const wikiUrl = (page: string) => `https://bloons.fandom.com/wiki/${page}`

const tower = (path: string, name: string, page: string) => ({
  src: localAsset(`towers/${path}`),
  alt: `${name} tower portrait from Bloons TD 6.`,
  source: 'Bloons Wiki tower portrait',
  credit: 'Bloons Wiki',
  url: wikiUrl(page),
})

const hero = (path: string, name: string, page: string) => ({
  src: localAsset(`characters/${path}`),
  alt: `${name} hero portrait from Bloons TD 6.`,
  source: 'Bloons Wiki hero portrait',
  credit: 'Bloons Wiki',
  url: wikiUrl(page),
})

const paragon = (path: string, name: string, page: string) => ({
  src: localAsset(`paragons/${path}`),
  alt: `${name} paragon portrait from Bloons TD 6.`,
  source: 'Bloons Wiki paragon portrait',
  credit: 'Bloons Wiki',
  url: wikiUrl(page),
})

export const imageAssets = {
  bossRound: {
    src: localAsset('press/btd6-press-11.jpg'),
    alt: 'Bloons TD 6 official press-kit gameplay screenshot showing a boss round with towers, bloons, and the upgrade panel.',
    source: 'Official BTD6 press kit',
    credit: 'Ninja Kiwi via IMPRESS',
    url: 'https://impress.games/press-kit/ninjakiwi/bloons-td-6',
  },
  lateGameRound: {
    src: localAsset('press/btd6-press-12.jpg'),
    alt: 'Bloons TD 6 official press-kit gameplay screenshot showing late-game towers, BAD bloons, and a red map.',
    source: 'Official BTD6 press kit',
    credit: 'Ninja Kiwi via IMPRESS',
    url: 'https://impress.games/press-kit/ninjakiwi/bloons-td-6',
  },

  dartMonkey: tower('dart-monkey.png', 'Dart Monkey', 'Dart_Monkey_(BTD6)'),
  boomerangMonkey: tower('boomerang-monkey.png', 'Boomerang Monkey', 'Boomerang_Monkey_(BTD6)'),
  bombShooter: tower('bomb-shooter.png', 'Bomb Shooter', 'Bomb_Shooter_(BTD6)'),
  tackShooter: tower('tack-shooter.png', 'Tack Shooter', 'Tack_Shooter_(BTD6)'),
  iceMonkey: tower('ice-monkey.png', 'Ice Monkey', 'Ice_Monkey_(BTD6)'),
  glueGunner: tower('glue-gunner.png', 'Glue Gunner', 'Glue_Gunner_(BTD6)'),
  sniperMonkey: tower('sniper-monkey.png', 'Sniper Monkey', 'Sniper_Monkey_(BTD6)'),
  monkeySub: tower('monkey-sub.png', 'Monkey Sub', 'Monkey_Sub_(BTD6)'),
  monkeyBuccaneer: tower('monkey-buccaneer.png', 'Monkey Buccaneer', 'Monkey_Buccaneer_(BTD6)'),
  monkeyAce: tower('monkey-ace.png', 'Monkey Ace', 'Monkey_Ace_(BTD6)'),
  heliPilot: tower('heli-pilot.png', 'Heli Pilot', 'Heli_Pilot_(BTD6)'),
  mortarMonkey: tower('mortar-monkey.png', 'Mortar Monkey', 'Mortar_Monkey_(BTD6)'),
  dartlingGunner: tower('dartling-gunner.png', 'Dartling Gunner', 'Dartling_Gunner_(BTD6)'),
  desperado: tower('desperado.png', 'Desperado', 'Desperado'),
  wizardMonkey: tower('wizard-monkey.png', 'Wizard Monkey', 'Wizard_Monkey_(BTD6)'),
  superMonkey: tower('super-monkey.png', 'Super Monkey', 'Super_Monkey_(BTD6)'),
  ninjaMonkey: tower('ninja-monkey.png', 'Ninja Monkey', 'Ninja_Monkey_(BTD6)'),
  alchemist: tower('alchemist.png', 'Alchemist', 'Alchemist'),
  druid: tower('druid.png', 'Druid', 'Druid'),
  mermonkey: tower('mermonkey.png', 'Mermonkey', 'Mermonkey'),
  bananaFarm: tower('banana-farm.png', 'Banana Farm', 'Banana_Farm_(BTD6)'),
  spikeFactory: tower('spike-factory.png', 'Spike Factory', 'Spike_Factory_(BTD6)'),
  monkeyVillage: tower('monkey-village.png', 'Monkey Village', 'Monkey_Village_(BTD6)'),
  engineerMonkey: tower('engineer-monkey.png', 'Engineer Monkey', 'Engineer_Monkey_(BTD6)'),
  beastHandler: tower('beast-handler.png', 'Beast Handler', 'Beast_Handler'),
  glueStrike: tower('glue-strike.png', 'Glue Strike', 'Glue_Strike'),
  carrierFlagship: tower('carrier-flagship.png', 'Carrier Flagship', 'Carrier_Flagship'),
  popseidon: tower('popseidon.png', 'Popseidon', 'Popseidon'),

  quincy: hero('quincy.png', 'Quincy', 'Quincy_(BTD6)'),
  gwendolin: hero('gwendolin.png', 'Gwendolin', 'Gwendolin_(BTD6)'),
  strikerJones: hero('striker-jones.png', 'Striker Jones', 'Striker_Jones'),
  obynGreenfoot: hero('obyn-greenfoot.png', 'Obyn Greenfoot', 'Obyn_Greenfoot'),
  captainChurchill: hero('captain-churchill.png', 'Captain Churchill', 'Captain_Churchill'),
  benjamin: hero('benjamin.png', 'Benjamin', 'Benjamin_(BTD6)'),
  ezili: hero('ezili.png', 'Ezili', 'Ezili'),
  patFusty: hero('pat-fusty.png', 'Pat Fusty', 'Pat_Fusty_(BTD6)'),
  adora: hero('adora.png', 'Adora', 'Adora_(BTD6)'),
  admiralBrickell: hero('admiral-brickell.png', 'Admiral Brickell', 'Admiral_Brickell'),
  etienne: hero('etienne.png', 'Etienne', 'Etienne'),
  sauda: hero('sauda.png', 'Sauda', 'Sauda_(BTD6)'),
  psi: hero('psi.png', 'Psi', 'Psi'),
  geraldo: hero('geraldo.png', 'Geraldo', 'Geraldo'),
  corvus: hero('corvus.png', 'Corvus', 'Corvus_(BTD6)'),
  rosalia: hero('rosalia.png', 'Rosalia', 'Rosalia'),
  silas: hero('silas.png', 'Silas', 'Silas'),
  danDMonke: hero('dan-dmonke.png', "Dan D'Monke", "Dan_D'Monke"),

  apexPlasmaMaster: paragon('apex-plasma-master.png', 'Apex Plasma Master', 'Apex_Plasma_Master'),
  glaiveDominus: paragon('glaive-dominus.png', 'Glaive Dominus', 'Glaive_Dominus'),
  ascendedShadow: paragon('ascended-shadow.png', 'Ascended Shadow', 'Ascended_Shadow'),
  navarchOfTheSeas: paragon('navarch-of-the-seas.png', 'Navarch of the Seas', 'Navarch_of_the_Seas'),
  masterBuilder: paragon('master-builder.png', 'Master Builder', 'Master_Builder'),
  goliathDoomship: paragon('goliath-doomship.png', 'Goliath Doomship', 'Goliath_Doomship'),
  magusPerfectus: paragon('magus-perfectus.png', 'Magus Perfectus', 'Magus_Perfectus'),
  nauticSiegeCore: paragon('nautic-siege-core.png', 'Nautic Siege Core', 'Nautic_Siege_Core'),
  crucibleOfSteelAndFlame: paragon(
    'crucible-of-steel-and-flame.png',
    'Crucible of Steel and Flame',
    'Crucible_of_Steel_and_Flame',
  ),
  megaMassiveMunitionsFactory: paragon(
    'mega-massive-munitions-factory.webp',
    'Mega Massive Munitions Factory',
    'Mega_Massive_Munitions_Factory',
  ),
  bombParagon: paragon(
    'bomb-paragon.png',
    'Ballistic Obliteration Missile Bunker',
    'Ballistic_Obliteration_Missile_Bunker',
  ),
  heraldOfEverfrost: paragon('herald-of-everfrost.webp', 'Herald of Everfrost', 'Herald_of_Everfrost'),
  rootOfAllNature: paragon('root-of-all-nature.png', 'Root of all Nature', 'Root_of_all_Nature'),
} as const

export type ImageKey = keyof typeof imageAssets

export function mapImageAsset(slug: string, name: string, page: string) {
  const thumbnail = localAssetOptional(`maps/${slug}.webp`)

  return {
    src: thumbnail ?? imageAssets.bossRound.src,
    alt: `${name} map thumbnail from Bloons TD 6.`,
    source: thumbnail ? 'Bloons Wiki map thumbnail' : imageAssets.bossRound.source,
    credit: thumbnail ? 'Bloons Wiki' : imageAssets.bossRound.credit,
    url: thumbnail ? wikiUrl(page) : imageAssets.bossRound.url,
  }
}

export const sourceLinks = {
  pressKit: 'https://impress.games/press-kit/ninjakiwi/bloons-td-6',
  ninjaKiwiTerms: 'https://store.steampowered.com/eula/1276390_eula_0',
  steamAnnouncements: 'https://steamcommunity.com/app/960090/announcements/',
  wikiBalance: 'https://bloons.fandom.com/wiki/Bloons_TD_6/Balance_changes',
  wikiV55: 'https://bloons.fandom.com/wiki/Bloons_TD_6/Balance_changes/Version_55.x',
  wikiV56: 'https://bloons.fandom.com/wiki/Bloons_TD_6/Balance_changes/Version_56.x',
  wikiMaps: 'https://bloons.fandom.com/wiki/Maps',
  wikiBeginnerDifficulty: 'https://bloons.fandom.com/wiki/Beginner_Difficulty',
  wikiMedals: 'https://bloons.fandom.com/wiki/Medals',
  wikiMonkeyKnowledge: 'https://bloons.fandom.com/wiki/Monkey_Knowledge_(BTD6)',
  wikiChimpsStrategies: 'https://bloons.fandom.com/wiki/C.H.I.M.P.S./Strategies',
  wikiBossStrategies: 'https://bloons.fandom.com/wiki/Boss_Bloon/Strategies',
  wikiFreeplayStrategies: 'https://bloons.fandom.com/wiki/BTD6_Freeplay_Mode/Strategies',
  wikiTowers: 'https://bloons.fandom.com/wiki/Towers',
  wikiHeroes: 'https://bloons.fandom.com/wiki/Heroes',
  wikiParagons: 'https://bloons.fandom.com/wiki/Paragons',
  hbombParagonTier: 'https://www.youtube.com/watch?v=lncUwtg49J8',
  beginnerGuideVideo: 'https://www.youtube.com/watch?v=Z37qm1rZjtc',
  beginnerKnowledgeVideo: 'https://www.youtube.com/watch?v=TEWmzDz4Wwo',
  beginnerMapsPlaylist: 'https://www.youtube.com/playlist?list=PLr76aLjMsUaXXzdZyfQ3zaPeP_QB0XKCZ',
  btd6Index: 'https://btd6index.win/',
  chimpsTierListV54:
    'https://www.reddit.com/r/btd6/comments/1tokyxi/comprehensive_tier_list_for_chimps_by_path/',
  freeplayTierListV55:
    'https://www.reddit.com/r/btd6/comments/1tzoqyl/universal_freeplay_towers_tierlist_for_v55/',
}
