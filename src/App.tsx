import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Filter,
  Gem,
  ListChecks,
  Map,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  TrendingDown,
  TrendingUp,
  UserRound,
  Zap,
} from 'lucide-react'
import './App.css'
import {
  activeVersion,
  checkedAt,
  guides,
  heroTiers,
  metaPicks,
  paragonTiers,
  patchChanges,
  sourceRefs,
  strategyCards,
  towerRatings,
} from './data/content'
import type {
  Category,
  Guide,
  HeroTier,
  MetaPick,
  ParagonTier,
  PatchChange,
  SourceRef,
  StrategyCard,
  TowerRating,
} from './data/content'
import {
  beginnerMapStages,
  beginnerRules,
  beginnerSources,
  beginnerUnlocks,
} from './data/beginner'
import type { BeginnerMapStage, BeginnerRule, BeginnerUnlock } from './data/beginner'
import {
  buildChimpsGuide,
  buildMapModeGuide,
  gameModes,
  mapProfiles,
  totalMapModeGuides,
} from './data/mapGuides'
import type { ChimpsGuide, GameMode, MapModeGuide, MapProfile } from './data/mapGuides'
import { imageAssets, mapImageAsset } from './data/images'
import type { ImageKey } from './data/images'

type AppTab = 'meta' | 'beginner' | 'changes' | 'heroes' | 'paragons' | 'strategies' | 'guides' | 'towers' | 'maps'

const appTabs: Array<{
  id: AppTab
  label: string
  description: string
  filter: Category
  icon: LucideIcon
}> = [
  { id: 'meta', label: 'Meta', description: 'Ranked current picks', filter: 'All', icon: Trophy },
  { id: 'beginner', label: 'Beginner', description: 'Start path and unlocks', filter: 'Beginner', icon: Sparkles },
  { id: 'changes', label: 'Changes', description: 'Buffs, nerfs, fixes', filter: 'All', icon: CalendarDays },
  { id: 'heroes', label: 'Heroes', description: 'Hero tier list', filter: 'Heroes', icon: UserRound },
  { id: 'paragons', label: 'Paragons', description: 'Boss and freeplay priority', filter: 'Paragons', icon: Gem },
  { id: 'strategies', label: 'Strats', description: 'Reusable build shells', filter: 'Strats', icon: Zap },
  { id: 'guides', label: 'Guides', description: 'Map-mode guidebook', filter: 'All', icon: BookOpen },
  { id: 'towers', label: 'Towers', description: 'Full tower roster', filter: 'All', icon: Filter },
  { id: 'maps', label: 'Maps', description: 'Map notes and routes', filter: 'Maps', icon: Map },
]

const tabAliases: Record<string, AppTab> = {
  start: 'beginner',
  beginners: 'beginner',
  'beginner-guide': 'beginner',
  patches: 'changes',
  strats: 'strategies',
  strategy: 'strategies',
  tower: 'towers',
  map: 'maps',
}

const popularFilters: Array<{ label: string; tab: AppTab }> = [
  { label: 'Start here', tab: 'beginner' },
  { label: 'Ravine', tab: 'maps' },
  { label: 'Adora', tab: 'heroes' },
  { label: 'Pat Fusty', tab: 'heroes' },
  { label: 'Bomb Paragon', tab: 'paragons' },
  { label: 'Glue Strike', tab: 'changes' },
  { label: 'Merchantman', tab: 'changes' },
  { label: 'Boss week', tab: 'strategies' },
]

function resolveTabFromHash(): AppTab {
  if (typeof window === 'undefined') return 'meta'

  const hash = window.location.hash.replace('#', '').toLowerCase()
  if (!hash) return 'meta'

  if (hash in tabAliases) return tabAliases[hash]

  return appTabs.some((tab) => tab.id === hash) ? (hash as AppTab) : 'meta'
}

function sourceMatchesQuery(source: SourceRef, query: string) {
  return source.label.toLowerCase().includes(query) || source.url.toLowerCase().includes(query)
}

function matchesMeta(item: MetaPick, query: string) {
  if (!query) return true
  return [
    item.title,
    item.category,
    item.mode,
    item.bestFor,
    item.mapFocus,
    item.why,
    item.impactNote,
    item.difficulty,
  ].some((value) => value.toLowerCase().includes(query))
    || item.sources.some((source) => sourceMatchesQuery(source, query))
}

function matchesGuide(item: Guide, query: string) {
  if (!query) return true
  return [item.title, item.category, item.map, item.summary, item.updatedAt, ...item.steps]
    .some((value) => value.toLowerCase().includes(query))
    || item.sources.some((source) => sourceMatchesQuery(source, query))
}

function matchesPatch(item: PatchChange, query: string) {
  if (!query) return true
  return [item.title, item.type, item.detail, item.source.label].some((value) =>
    value.toLowerCase().includes(query),
  )
}

function matchesHero(item: HeroTier, query: string) {
  if (!query) return true
  return [item.hero, item.tier, item.role, item.bestFor, item.patchNote, item.trend, item.ease].some(
    (value) => value.toLowerCase().includes(query),
  )
    || item.sources.some((source) => sourceMatchesQuery(source, query))
}

function matchesParagon(item: ParagonTier, query: string) {
  if (!query) return true
  return [
    item.paragon,
    item.tier,
    item.role,
    item.bestFor,
    item.patchNote,
    item.trend,
    item.priority,
  ].some((value) => value.toLowerCase().includes(query))
    || item.sources.some((source) => sourceMatchesQuery(source, query))
}

function matchesStrategy(item: StrategyCard, query: string) {
  if (!query) return true
  return [
    item.title,
    item.category,
    item.mode,
    item.priority,
    item.setup,
    item.watchOut,
    ...item.worksWith,
  ].some((value) => value.toLowerCase().includes(query))
    || item.sources.some((source) => sourceMatchesQuery(source, query))
}

function matchesTower(item: TowerRating, query: string) {
  if (!query) return true
  return [item.unit, item.className, item.role, item.chimpsTier, item.bossTier, item.ease, item.trend, item.note].some(
    (value) => value.toLowerCase().includes(query),
  )
}

function matchesMap(item: MapProfile, query: string) {
  if (!query) return true
  return [
    item.name,
    item.difficulty,
    item.focus,
    item.recommendation,
    item.laneProfile,
    item.waterAccess,
    item.sightlines,
    item.placement,
    ...item.tags,
    ...item.coreTowers,
    ...item.heroPool,
  ].some((value) =>
    value.toLowerCase().includes(query),
  )
}

function matchesMode(item: GameMode, query: string) {
  if (!query) return true
  return [
    item.name,
    item.group,
    item.rounds,
    item.rule,
    item.economy,
    item.priority,
    item.opener,
    item.plan,
    item.finish,
    item.danger,
  ].some((value) => value.toLowerCase().includes(query))
}

function matchesMapModeGuide(item: MapModeGuide, query: string) {
  if (!query) return true
  return (
    matchesMap(item.map, query)
    || matchesMode(item.mode, query)
    || item.summary.toLowerCase().includes(query)
    || item.warning.toLowerCase().includes(query)
    || item.steps.some((step) => step.toLowerCase().includes(query))
    || item.priorityTowers.some((tower) => tower.toLowerCase().includes(query))
  )
}

function matchesBeginnerUnlock(item: BeginnerUnlock, query: string) {
  if (!query) return true
  return [
    item.title,
    item.kind,
    item.priority,
    item.why,
    item.firstGoal,
    item.avoid,
    ...item.tags,
  ].some((value) => value.toLowerCase().includes(query))
    || item.sources.some((source) => sourceMatchesQuery(source, query))
}

function matchesBeginnerStage(item: BeginnerMapStage, query: string) {
  if (!query) return true
  return [
    item.title,
    item.level,
    item.goal,
    item.danger,
    item.nextAction,
    ...item.mapNames,
    ...item.medals,
    ...item.unlockFocus,
  ].some((value) => value.toLowerCase().includes(query))
    || item.sources.some((source) => sourceMatchesQuery(source, query))
}

function matchesBeginnerRule(item: BeginnerRule, query: string) {
  if (!query) return true
  return [item.title, item.detail].some((value) => value.toLowerCase().includes(query))
}

function matchesChimpsGuide(item: ChimpsGuide, query: string) {
  if (!query) return true
  return [
    item.title,
    item.routeType,
    item.risk,
    item.summary,
    item.opener.title,
    item.opener.body,
    item.map.name,
    item.map.difficulty,
    item.map.focus,
    ...item.opener.towers,
    ...item.buildOrder,
    ...item.placementNotes,
    ...item.abilityNotes,
    ...item.failChecks,
    ...item.alternateCores,
    ...item.roundPlan.flatMap((round) => [round.rounds, round.plan, round.reason]),
  ].some((value) => value.toLowerCase().includes(query))
    || item.tutorialLinks.some((source) => sourceMatchesQuery(source, query))
}

function categoryApplies(category: Category, item: { category?: Category; difficulty?: string }) {
  if (category === 'All') return true
  if (category === 'Maps') return Boolean(item.difficulty)
  if (category === 'Strats') return false
  return item.category === category || item.difficulty === category
}

function categoryAppliesToStrategy(category: Category, item: StrategyCard) {
  if (category === 'All' || category === 'Strats') return true
  return item.category === category
}

function categoryAppliesToHeroes(category: Category) {
  return category === 'All' || category === 'Heroes'
}

function categoryAppliesToParagons(category: Category) {
  return category === 'All' || category === 'Paragons' || category === 'Bosses' || category === 'Advanced'
}

function patchImageKey(change: PatchChange): ImageKey {
  const title = change.title.toLowerCase()

  if (title.includes('adora')) return 'adora'
  if (title.includes('pat')) return 'patFusty'
  if (title.includes('churchill')) return 'captainChurchill'
  if (title.includes('bomb')) return 'bombParagon'
  if (title.includes('druid')) return 'rootOfAllNature'
  if (title.includes('wizard')) return 'magusPerfectus'
  if (title.includes('engineer')) return 'masterBuilder'
  if (title.includes('glue')) return 'glueStrike'
  if (title.includes('merchantman')) return 'carrierFlagship'
  if (title.includes('popseidon')) return 'popseidon'
  if (title.includes('he-man')) return 'danDMonke'
  if (title.includes('corvus')) return 'corvus'
  if (title.includes('spectre') || title.includes('flying')) return 'lateGameRound'

  return change.type === 'Buff' ? 'bossRound' : 'lateGameRound'
}

function ImageFrame({
  imageKey,
  className = '',
  priority = false,
}: {
  imageKey: ImageKey
  className?: string
  priority?: boolean
}) {
  const image = imageAssets[imageKey]

  return (
    <figure className={`image-frame ${className}`}>
      <img src={image.src} alt={image.alt} loading={priority ? 'eager' : 'lazy'} />
      <figcaption>
        <span>{image.source}</span>
        <a href={image.url} target="_blank" rel="noreferrer">
          {image.credit}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  )
}

function MapImageFrame({
  map,
  className = '',
  priority = false,
}: {
  map: MapProfile
  className?: string
  priority?: boolean
}) {
  const image = mapImageAsset(map.slug, map.name, map.page)

  return (
    <figure className={`image-frame ${className}`}>
      <img src={image.src} alt={image.alt} loading={priority ? 'eager' : 'lazy'} />
      <figcaption>
        <span>{image.source}</span>
        <a href={image.url} target="_blank" rel="noreferrer">
          {image.credit}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  )
}

function SourceLinks({ sources }: { sources: SourceRef[] }) {
  return (
    <div className="source-links" aria-label="Sources">
      {sources.map((source) => (
        <a href={source.url} target="_blank" rel="noreferrer" key={`${source.label}-${source.url}`}>
          {source.label}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

function ImpactBadge({ impact }: { impact: MetaPick['patchImpact'] }) {
  const Icon = impact === 'Buffed' ? TrendingUp : impact === 'Nerfed' ? TrendingDown : AlertTriangle
  return (
    <span className={`impact impact-${impact.toLowerCase()}`}>
      <Icon size={14} aria-hidden="true" />
      {impact}
    </span>
  )
}

function Trend({ trend }: { trend: TowerRating['trend'] }) {
  const Icon = trend === 'Up' ? TrendingUp : trend === 'Down' ? TrendingDown : AlertTriangle
  return (
    <span className={`trend trend-${trend.toLowerCase()}`}>
      <Icon size={14} aria-hidden="true" />
      {trend}
    </span>
  )
}

function Tier({ value }: { value: string }) {
  return <span className={`tier tier-${value.replace('+', 'plus').toLowerCase()}`}>{value}</span>
}

function RiskBadge({ value }: { value: ChimpsGuide['risk'] }) {
  return <span className={`risk-badge risk-${value.toLowerCase()}`}>{value} risk</span>
}

function PatchItem({ change }: { change: PatchChange }) {
  return (
    <article className={`patch-item patch-${change.type.toLowerCase()}`}>
      <ImageFrame imageKey={patchImageKey(change)} className="patch-thumb" />
      <span>{change.type}</span>
      <div>
        <h3>{change.title}</h3>
        <p>{change.detail}</p>
        <SourceLinks sources={[change.source]} />
      </div>
    </article>
  )
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('a, button, input, select, textarea'))
}

function ChimpsDeepGuide({ guide }: { guide: ChimpsGuide }) {
  return (
    <article className="chimps-deep-guide">
      <MapImageFrame map={guide.map} className="chimps-map-art" priority />
      <div className="chimps-main">
        <div className="guide-meta">
          <span>{guide.map.difficulty}</span>
          <span>CHIMPS</span>
          <span>Rounds 6-100</span>
        </div>
        <div className="chimps-title-row">
          <div>
            <h3>{guide.title}</h3>
            <p>{guide.summary}</p>
          </div>
          <RiskBadge value={guide.risk} />
        </div>

        <section className="chimps-opener" aria-label="Recommended CHIMPS opener">
          <div>
            <ShieldCheck size={18} aria-hidden="true" />
            <h4>{guide.opener.title}</h4>
          </div>
          <p>{guide.opener.body}</p>
          <div className="works-with">
            {guide.opener.towers.map((tower) => (
              <span key={tower}>{tower}</span>
            ))}
          </div>
        </section>

        <div className="chimps-columns">
          <section>
            <div className="mini-heading">
              <ListChecks size={16} aria-hidden="true" />
              <h4>Build Order</h4>
            </div>
            <ol>
              {guide.buildOrder.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          <section>
            <div className="mini-heading">
              <AlertTriangle size={16} aria-hidden="true" />
              <h4>Fail Checks</h4>
            </div>
            <ul>
              {guide.failChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="round-plan" aria-label="CHIMPS round checkpoints">
          <div className="mini-heading">
            <CalendarDays size={16} aria-hidden="true" />
            <h4>Round Checkpoints</h4>
          </div>
          <div className="round-plan-grid">
            {guide.roundPlan.map((round) => (
              <article key={round.rounds}>
                <strong>{round.rounds}</strong>
                <p>{round.plan}</p>
                <span>{round.reason}</span>
              </article>
            ))}
          </div>
        </section>

        <div className="chimps-columns">
          <section>
            <div className="mini-heading">
              <Map size={16} aria-hidden="true" />
              <h4>Placement Notes</h4>
            </div>
            <ul>
              {guide.placementNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
          <section>
            <div className="mini-heading">
              <Zap size={16} aria-hidden="true" />
              <h4>Ability Timing</h4>
            </div>
            <ul>
              {guide.abilityNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="alternate-core-row" aria-label="Alternate CHIMPS cores">
          <div className="mini-heading">
            <Sparkles size={16} aria-hidden="true" />
            <h4>Alternate Cores</h4>
          </div>
          <div className="works-with">
            {guide.alternateCores.map((core) => (
              <span key={core}>{core}</span>
            ))}
          </div>
        </section>

        <section className="tutorial-row" aria-label="CHIMPS tutorial links">
          <div>
            <PlayCircle size={17} aria-hidden="true" />
            <h4>Video / Reference Links</h4>
          </div>
          <SourceLinks sources={guide.tutorialLinks} />
        </section>
      </div>
    </article>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(() => resolveTabFromHash())
  const [query, setQuery] = useState('')
  const [selectedGuideMap, setSelectedGuideMap] = useState('Monkey Meadow')
  const [selectedGuideMode, setSelectedGuideMode] = useState('CHIMPS')
  const [selectedBeginnerStageId, setSelectedBeginnerStageId] = useState(beginnerMapStages[0].id)
  const [selectedBeginnerMapName, setSelectedBeginnerMapName] = useState(beginnerMapStages[0].mapNames[0])
  const guideDetailRef = useRef<HTMLDivElement | null>(null)
  const shouldScrollGuideRef = useRef(false)
  const normalizedQuery = query.trim().toLowerCase()
  const activeTabMeta = appTabs.find((tab) => tab.id === activeTab) ?? appTabs[0]
  const activeFilter = activeTabMeta.filter
  const selectedMap = mapProfiles.find((map) => map.name === selectedGuideMap) ?? mapProfiles[0]
  const selectedMode = gameModes.find((mode) => mode.name === selectedGuideMode) ?? gameModes.at(-1) ?? gameModes[0]
  const selectedGuide = buildMapModeGuide(selectedMap, selectedMode)
  const selectedChimpsGuide = buildChimpsGuide(selectedMap)
  const selectedBeginnerStage =
    beginnerMapStages.find((stage) => stage.id === selectedBeginnerStageId) ?? beginnerMapStages[0]
  const beginnerStageMaps = selectedBeginnerStage.mapNames
    .map((name) => mapProfiles.find((map) => map.name === name))
    .filter((map): map is MapProfile => Boolean(map))
  const selectedBeginnerMap =
    beginnerStageMaps.find((map) => map.name === selectedBeginnerMapName) ?? beginnerStageMaps[0] ?? mapProfiles[0]
  const hasSpecificGuideMap = selectedGuideMap !== 'All maps'
  const showChimpsDepth =
    selectedGuideMode === 'CHIMPS'
    || selectedGuideMode === 'All modes'
    || normalizedQuery.includes('chimps')

  useEffect(() => {
    const handleHashChange = () => setActiveTab(resolveTabFromHash())

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const selectTab = (tab: AppTab) => {
    setActiveTab(tab)
    window.history.replaceState(null, '', `#${tab}`)
  }

  const selectBeginnerStage = (stage: BeginnerMapStage) => {
    setSelectedBeginnerStageId(stage.id)
    setSelectedBeginnerMapName(stage.mapNames[0])
  }

  const scrollGuideIntoView = () => {
    if (typeof window === 'undefined') return

    const scroll = () => {
      guideDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.requestAnimationFrame(scroll)
    window.setTimeout(scroll, 120)
  }

  const openGuide = (mapName: string, modeName: string) => {
    shouldScrollGuideRef.current = true
    setSelectedGuideMap(mapName)
    setSelectedGuideMode(modeName)

    window.setTimeout(() => {
      if (!shouldScrollGuideRef.current) return

      shouldScrollGuideRef.current = false
      scrollGuideIntoView()
    }, 0)
  }

  const openGuidebook = (mapName: string, modeName: string) => {
    shouldScrollGuideRef.current = true
    setSelectedGuideMap(mapName)
    setSelectedGuideMode(modeName)
    selectTab('guides')
    window.setTimeout(scrollGuideIntoView, 160)
  }

  const openGuideFromCard = (
    event: MouseEvent<HTMLElement>,
    mapName: string,
    modeName: string,
  ) => {
    if (isInteractiveTarget(event.target)) return
    openGuide(mapName, modeName)
  }

  useEffect(() => {
    if (!shouldScrollGuideRef.current) return

    shouldScrollGuideRef.current = false
    scrollGuideIntoView()
  }, [selectedGuideMap, selectedGuideMode])

  const filteredMeta = useMemo(
    () =>
      metaPicks.filter((item) => categoryApplies(activeFilter, item) && matchesMeta(item, normalizedQuery)),
    [activeFilter, normalizedQuery],
  )

  const allMapModeGuides = useMemo(
    () => mapProfiles.flatMap((map) => gameModes.map((mode) => buildMapModeGuide(map, mode))),
    [],
  )
  const allChimpsGuides = useMemo(() => mapProfiles.map((map) => buildChimpsGuide(map)), [])

  const filteredFeaturedGuides = useMemo(
    () =>
      guides.filter((item) => categoryApplies(activeFilter, item) && matchesGuide(item, normalizedQuery)),
    [activeFilter, normalizedQuery],
  )

  const filteredMapModeGuides = useMemo(
    () =>
      allMapModeGuides.filter(
        (guide) =>
          (selectedGuideMap === 'All maps' || guide.map.name === selectedGuideMap)
          && (selectedGuideMode === 'All modes' || guide.mode.name === selectedGuideMode)
          && matchesMapModeGuide(guide, normalizedQuery),
      ),
    [allMapModeGuides, normalizedQuery, selectedGuideMap, selectedGuideMode],
  )

  const filteredChimpsGuides = useMemo(
    () =>
      allChimpsGuides.filter(
        (guide) =>
          (selectedGuideMap === 'All maps' || guide.map.name === selectedGuideMap)
          && matchesChimpsGuide(guide, normalizedQuery),
      ),
    [allChimpsGuides, normalizedQuery, selectedGuideMap],
  )

  const filteredPatches = useMemo(
    () => patchChanges.filter((item) => matchesPatch(item, normalizedQuery)),
    [normalizedQuery],
  )

  const filteredHeroes = useMemo(
    () =>
      categoryAppliesToHeroes(activeFilter)
        ? heroTiers.filter((item) => matchesHero(item, normalizedQuery))
        : [],
    [activeFilter, normalizedQuery],
  )

  const filteredParagons = useMemo(
    () =>
      categoryAppliesToParagons(activeFilter)
        ? paragonTiers.filter((item) => matchesParagon(item, normalizedQuery))
        : [],
    [activeFilter, normalizedQuery],
  )

  const filteredStrategies = useMemo(
    () =>
      strategyCards.filter(
        (item) => categoryAppliesToStrategy(activeFilter, item) && matchesStrategy(item, normalizedQuery),
      ),
    [activeFilter, normalizedQuery],
  )

  const filteredTowers = useMemo(
    () => towerRatings.filter((item) => matchesTower(item, normalizedQuery)),
    [normalizedQuery],
  )

  const filteredMaps = useMemo(
    () =>
      mapProfiles.filter((item) => categoryApplies(activeFilter, item) && matchesMap(item, normalizedQuery)),
    [activeFilter, normalizedQuery],
  )

  const filteredBeginnerUnlocks = useMemo(
    () => beginnerUnlocks.filter((item) => matchesBeginnerUnlock(item, normalizedQuery)),
    [normalizedQuery],
  )

  const filteredBeginnerStages = useMemo(
    () => beginnerMapStages.filter((item) => matchesBeginnerStage(item, normalizedQuery)),
    [normalizedQuery],
  )

  const filteredBeginnerRules = useMemo(
    () => beginnerRules.filter((item) => matchesBeginnerRule(item, normalizedQuery)),
    [normalizedQuery],
  )

  const buffCount = patchChanges.filter((item) => item.type === 'Buff').length
  const nerfCount = patchChanges.filter((item) => item.type === 'Nerf').length
  const changeCount = patchChanges.filter((item) => item.type === 'Change' || item.type === 'Fix').length
  const patchGroups: PatchChange['type'][] = ['Buff', 'Nerf', 'Change', 'Fix']
  const tabCounts: Record<AppTab, number> = {
    meta: metaPicks.filter((item) => matchesMeta(item, normalizedQuery)).length,
    beginner: filteredBeginnerUnlocks.length + filteredBeginnerStages.length + filteredBeginnerRules.length,
    changes: filteredPatches.length,
    heroes: heroTiers.filter((item) => matchesHero(item, normalizedQuery)).length,
    paragons: paragonTiers.filter((item) => matchesParagon(item, normalizedQuery)).length,
    strategies: strategyCards.filter((item) => matchesStrategy(item, normalizedQuery)).length,
    guides: normalizedQuery
      ? allMapModeGuides.filter((item) => matchesMapModeGuide(item, normalizedQuery)).length
        + allChimpsGuides.filter((item) => matchesChimpsGuide(item, normalizedQuery)).length
      : totalMapModeGuides + mapProfiles.length,
    towers: filteredTowers.length,
    maps: mapProfiles.filter((item) => matchesMap(item, normalizedQuery)).length,
  }
  const visibleMapModeGuides = filteredMapModeGuides.slice(0, 120)
  const visibleChimpsGuides = filteredChimpsGuides.slice(0, 36)

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" type="button" onClick={() => selectTab('meta')} aria-label="Meta6 home">
          <span>Meta</span>
          <strong>6</strong>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {appTabs.map((item) => {
            const Icon = item.icon
            return (
              <button
                className={item.id === activeTab ? 'active' : ''}
                type="button"
                key={item.id}
                onClick={() => selectTab(item.id)}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>
        <label className="search-control" aria-label="Search builds guides towers and maps">
          <Search size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search builds, guides, towers..."
          />
        </label>
      </header>

      <main id="top" className="tabbed-main">
        <section className="hero-section tabbed-hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <h1 id="page-title">Current BTD6 Meta Hub</h1>
            <div className="meta-row">
              <span className="version-chip">
                <CheckCircle2 size={16} aria-hidden="true" />
                {activeVersion}
              </span>
              <span>Last checked {checkedAt}</span>
              <span className="verified-dot" aria-label="Sources checked"></span>
            </div>
            <p className="source-note">
              Fan-made tabbed strategy resource for patch changes, hero tiers, paragons, routes,
              maps, and tower decisions using BTD6 imagery and source-linked notes.
            </p>
            <SourceLinks
              sources={[
                sourceRefs.steam,
                sourceRefs.wikiV55,
                sourceRefs.index,
                sourceRefs.pressKit,
              ]}
            />
          </div>
          <aside className="snapshot-panel" aria-labelledby="snapshot-title">
            <div className="snapshot-title">
              <div>
                <Sparkles size={16} aria-hidden="true" />
                <h2 id="snapshot-title">Meta Snapshot</h2>
              </div>
              <span>{activeVersion}</span>
            </div>
            <div className="snapshot-grid">
              <div>
                <TrendingUp size={19} aria-hidden="true" />
                <strong>{buffCount}</strong>
                <span>Buffs</span>
              </div>
              <div>
                <TrendingDown size={19} aria-hidden="true" />
                <strong>{nerfCount}</strong>
                <span>Nerfs</span>
              </div>
              <div>
                <Zap size={19} aria-hidden="true" />
                <strong>{changeCount}</strong>
                <span>Fixes / changes</span>
              </div>
            </div>
            <button className="full-link snapshot-action" type="button" onClick={() => selectTab('changes')}>
              See Patch Changes
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </aside>
        </section>

        <section className="tab-layout" aria-label="Tabbed meta sections">
          <aside className="tab-sidebar" aria-label="Section controls">
            <section className="panel compact-panel">
              <h2>Sections</h2>
              <div className="side-tabs">
                {appTabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      className={tab.id === activeTab ? 'active' : ''}
                      key={tab.id}
                      type="button"
                      onClick={() => selectTab(tab.id)}
                    >
                      <Icon size={17} aria-hidden="true" />
                      <span>
                        <strong>{tab.label}</strong>
                        <small>{tab.description}</small>
                      </span>
                      <em>{tabCounts[tab.id]}</em>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="panel compact-panel">
              <h2>Popular Filters</h2>
              <div className="popular-filters">
                {popularFilters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() => {
                      setQuery(filter.label)
                      selectTab(filter.tab)
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="panel compact-panel">
              <h2>Source Stack</h2>
              <div className="quick-links">
                {[
                  sourceRefs.steam,
                  sourceRefs.wikiV55,
                  sourceRefs.index,
                  sourceRefs.pressKit,
                ].map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.label}>
                    {source.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          </aside>

          <div className="tab-content">
            <div className="tab-strip" role="tablist" aria-label="Meta sections">
              {appTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    aria-selected={tab.id === activeTab}
                    className={tab.id === activeTab ? 'active' : ''}
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    role="tab"
                    type="button"
                  >
                    <Icon size={16} aria-hidden="true" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <section className="tab-status" aria-label="Active section">
              <div>
                <span>{activeTabMeta.label}</span>
                <h2>{activeTabMeta.description}</h2>
              </div>
              <strong>{tabCounts[activeTab]} matching</strong>
            </section>

            {activeTab === 'meta' && (
              <section className="panel" aria-labelledby="meta-title">
                <div className="section-heading">
                  <div>
                    <h2 id="meta-title">Top Current Picks</h2>
                    <p>{filteredMeta.length} ranked picks match the current view.</p>
                  </div>
                  <span className="daily-note">Rankings update daily</span>
                </div>
                <div className="meta-list">
                  {filteredMeta.map((item) => (
                    <article className="meta-card" key={item.title}>
                      <div className="rank">#{item.rank}</div>
                      <ImageFrame imageKey={item.imageKey} className="mini-image" priority={item.rank < 3} />
                      <div className="build-main">
                        <h3>{item.title}</h3>
                        <div className="tag-row">
                          <span>{item.category}</span>
                          <span>{item.difficulty}</span>
                        </div>
                      </div>
                      <div className="route-cell">
                        <strong>{item.bestFor}</strong>
                        <span>{item.mapFocus}</span>
                      </div>
                      <div className="why-cell">
                        <strong>Why it works</strong>
                        <p>{item.why}</p>
                      </div>
                      <div className="impact-cell">
                        <ImpactBadge impact={item.patchImpact} />
                        <span>{item.impactNote}</span>
                      </div>
                      <div className="confidence-cell">
                        <strong>{item.confidence}%</strong>
                        <div className="meter" aria-label={`${item.confidence}% confidence`}>
                          <span style={{ width: `${item.confidence}%` }}></span>
                        </div>
                        <SourceLinks sources={item.sources} />
                      </div>
                    </article>
                  ))}
                  {filteredMeta.length === 0 && (
                    <p className="empty-state">No meta picks match this search.</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'beginner' && (
              <section className="panel beginner-panel" aria-labelledby="beginner-title">
                <div className="section-heading">
                  <div>
                    <h2 id="beginner-title">Beginner Start Path</h2>
                    <p>
                      Unlock order, first maps, medal route, and an interactive map path for new players.
                    </p>
                  </div>
                  <SourceLinks
                    sources={[
                      beginnerSources.beginnerMaps,
                      beginnerSources.monkeyKnowledge,
                      beginnerSources.medals,
                    ]}
                  />
                </div>

                <div className="beginner-command">
                  <section className="beginner-unlocks" aria-labelledby="unlock-title">
                    <div className="beginner-section-title">
                      <ListChecks size={16} aria-hidden="true" />
                      <h3 id="unlock-title">What To Unlock First</h3>
                    </div>
                    <div className="unlock-stack">
                      {filteredBeginnerUnlocks.map((unlock) => (
                        <article className="unlock-card" key={unlock.title}>
                          <div className="unlock-rank">{unlock.rank}</div>
                          <div>
                            <div className="guide-meta">
                              <span>{unlock.kind}</span>
                              <span>{unlock.priority}</span>
                            </div>
                            <h3>{unlock.title}</h3>
                            <p>{unlock.why}</p>
                            <strong>{unlock.firstGoal}</strong>
                            <p className="watch-out">{unlock.avoid}</p>
                            <SourceLinks sources={unlock.sources} />
                          </div>
                        </article>
                      ))}
                      {filteredBeginnerUnlocks.length === 0 && (
                        <p className="empty-state">No beginner unlock notes match this search.</p>
                      )}
                    </div>
                  </section>

                  <aside className="beginner-rules" aria-labelledby="rules-title">
                    <div className="beginner-section-title">
                      <ShieldCheck size={16} aria-hidden="true" />
                      <h3 id="rules-title">Beginner Rules</h3>
                    </div>
                    <div className="rule-list">
                      {filteredBeginnerRules.map((rule) => (
                        <article key={rule.title}>
                          <h3>{rule.title}</h3>
                          <p>{rule.detail}</p>
                        </article>
                      ))}
                      {filteredBeginnerRules.length === 0 && (
                        <p className="empty-state">No beginner rules match this search.</p>
                      )}
                    </div>
                  </aside>
                </div>

                <section className="beginner-route" aria-labelledby="route-title">
                  <div className="guidebook-heading">
                    <div>
                      <h3 id="route-title">Interactive Beginner Map</h3>
                      <p>
                        Pick a stage, then click a map node to see what to practice and where to go next.
                      </p>
                    </div>
                    <SourceLinks sources={[beginnerSources.mapPlaylist, beginnerSources.maps]} />
                  </div>

                  <div className="beginner-route-layout">
                    <div className="stage-rail" aria-label="Beginner route stages">
                      {filteredBeginnerStages.map((stage) => (
                        <button
                          className={stage.id === selectedBeginnerStage.id ? 'active' : ''}
                          key={stage.id}
                          type="button"
                          onClick={() => selectBeginnerStage(stage)}
                        >
                          <span>{stage.level}</span>
                          <strong>{stage.title}</strong>
                          <small>{stage.mapNames.join(' -> ')}</small>
                        </button>
                      ))}
                      {filteredBeginnerStages.length === 0 && (
                        <p className="empty-state">No beginner map stages match this search.</p>
                      )}
                    </div>

                    <div className="interactive-map-panel">
                      <div className="map-node-strip" aria-label={`${selectedBeginnerStage.title} maps`}>
                        {beginnerStageMaps.map((map, index) => (
                          <button
                            className={map.name === selectedBeginnerMap.name ? 'active' : ''}
                            key={map.name}
                            type="button"
                            onClick={() => setSelectedBeginnerMapName(map.name)}
                          >
                            <span>{index + 1}</span>
                            <strong>{map.name}</strong>
                            <small>{map.difficulty}</small>
                          </button>
                        ))}
                      </div>

                      <article className="selected-beginner-map">
                        <MapImageFrame map={selectedBeginnerMap} className="selected-map-image" priority />
                        <div>
                          <div className="guide-meta">
                            <span>{selectedBeginnerStage.title}</span>
                            <span>{selectedBeginnerMap.difficulty}</span>
                            <span>{selectedBeginnerMap.laneProfile}</span>
                          </div>
                          <h3>{selectedBeginnerMap.name}</h3>
                          <p>{selectedBeginnerStage.goal}</p>
                          <div className="beginner-detail-grid">
                            <section>
                              <h4>Do These Medals</h4>
                              <ul>
                                {selectedBeginnerStage.medals.map((medal) => (
                                  <li key={medal}>{medal}</li>
                                ))}
                              </ul>
                            </section>
                            <section>
                              <h4>Unlock Focus</h4>
                              <ul>
                                {selectedBeginnerStage.unlockFocus.map((focus) => (
                                  <li key={focus}>{focus}</li>
                                ))}
                              </ul>
                            </section>
                          </div>
                          <p className="watch-out">{selectedBeginnerStage.danger}</p>
                          <strong>{selectedBeginnerStage.nextAction}</strong>
                          <div className="beginner-actions">
                            <button
                              type="button"
                              onClick={() => openGuidebook(selectedBeginnerMap.name, 'Hard')}
                            >
                              Open Hard guide
                              <ChevronRight size={14} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openGuidebook(selectedBeginnerMap.name, 'CHIMPS')}
                            >
                              CHIMPS later
                              <ChevronRight size={14} aria-hidden="true" />
                            </button>
                          </div>
                          <SourceLinks sources={selectedBeginnerStage.sources} />
                        </div>
                      </article>
                    </div>
                  </div>
                </section>
              </section>
            )}

            {activeTab === 'changes' && (
              <section className="panel" aria-labelledby="patches-title">
                <div className="section-heading">
                  <div>
                    <h2 id="patches-title">Recent Buffs, Nerfs & Changes ({activeVersion})</h2>
                    <p>Patch-aware movement pulled from current v55.x notes and follow-up fixes.</p>
                  </div>
                  <a href={sourceRefs.steam.url} target="_blank" rel="noreferrer">
                    Official notes
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
                <div className="change-board">
                  {patchGroups.map((group) => {
                    const groupItems = filteredPatches.filter((change) => change.type === group)
                    return (
                      <section className={`change-column patch-${group.toLowerCase()}`} key={group}>
                        <div className="change-column-title">
                          <span>{group}</span>
                          <strong>{groupItems.length}</strong>
                        </div>
                        <div className="patch-list compact">
                          {groupItems.map((change) => (
                            <PatchItem change={change} key={change.title} />
                          ))}
                          {groupItems.length === 0 && (
                            <p className="empty-state">No {group.toLowerCase()} items match this search.</p>
                          )}
                        </div>
                      </section>
                    )
                  })}
                </div>
              </section>
            )}

            {activeTab === 'heroes' && (
              <section className="panel" aria-labelledby="heroes-title">
                <div className="section-heading">
                  <div>
                    <h2 id="heroes-title">Hero Tier List</h2>
                    <p>Current-meta hero read with character portraits and v55.x movement called out.</p>
                  </div>
                  <span className="legend">
                    <UserRound size={14} aria-hidden="true" />
                    {filteredHeroes.length} heroes
                  </span>
                </div>
                <div className="tier-list">
                  {filteredHeroes.map((hero) => (
                    <article className="tier-row visual-tier-row" key={hero.hero}>
                      <Tier value={hero.tier} />
                      <ImageFrame imageKey={hero.imageKey} className="character-thumb" />
                      <div>
                        <h3>{hero.hero}</h3>
                        <p>{hero.role}</p>
                        <strong>{hero.bestFor}</strong>
                      </div>
                      <Trend trend={hero.trend} />
                      <div className="tier-note">
                        <span>{hero.ease}</span>
                        <p>{hero.patchNote}</p>
                        <SourceLinks sources={hero.sources} />
                      </div>
                    </article>
                  ))}
                  {filteredHeroes.length === 0 && (
                    <p className="empty-state">No hero tiers match this search.</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'paragons' && (
              <section className="panel" aria-labelledby="paragons-title">
                <div className="section-heading">
                  <div>
                    <h2 id="paragons-title">Paragon Tier List</h2>
                    <p>Based on the Hbomb + MehalicPops pro ranking, with wiki mechanics for reference.</p>
                    <SourceLinks sources={[sourceRefs.proParagonTier, sourceRefs.wikiParagons]} />
                  </div>
                  <span className="legend">
                    <Gem size={14} aria-hidden="true" />
                    {filteredParagons.length} paragons
                  </span>
                </div>
                <div className="tier-list">
                  {filteredParagons.map((paragon) => (
                    <article className="tier-row visual-tier-row" key={paragon.paragon}>
                      <Tier value={paragon.tier} />
                      <ImageFrame imageKey={paragon.imageKey} className="character-thumb" />
                      <div>
                        <h3>{paragon.paragon}</h3>
                        <p>{paragon.role}</p>
                        <strong>{paragon.bestFor}</strong>
                      </div>
                      <Trend trend={paragon.trend} />
                      <div className="tier-note">
                        <span>{paragon.priority}</span>
                        <p>{paragon.patchNote}</p>
                        <SourceLinks sources={paragon.sources} />
                      </div>
                    </article>
                  ))}
                  {filteredParagons.length === 0 && (
                    <p className="empty-state">No paragon tiers match this search.</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'strategies' && (
              <section className="panel" aria-labelledby="strategies-title">
                <div className="section-heading">
                  <div>
                    <h2 id="strategies-title">Strategy Library</h2>
                    <p>Practical shells for CHIMPS, boss events, heroes, economy, and beginner clears.</p>
                  </div>
                  <span className="legend">
                    <Zap size={14} aria-hidden="true" />
                    {filteredStrategies.length} strats
                  </span>
                </div>
                <div className="strategy-grid">
                  {filteredStrategies.map((strategy) => (
                    <article className="strategy-card" key={strategy.title}>
                      <ImageFrame imageKey={strategy.imageKey} className="strategy-image" />
                      <div className="strategy-body">
                        <div className="guide-meta">
                          <span>{strategy.category}</span>
                          <span>{strategy.mode}</span>
                        </div>
                        <h3>{strategy.title}</h3>
                        <p>{strategy.setup}</p>
                        <div className="works-with">
                          {strategy.worksWith.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>
                        <strong>{strategy.priority}</strong>
                        <p className="watch-out">{strategy.watchOut}</p>
                        <SourceLinks sources={strategy.sources} />
                      </div>
                    </article>
                  ))}
                  {filteredStrategies.length === 0 && (
                    <p className="empty-state">No strategies match this search.</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'guides' && (
              <section className="panel guidebook-panel" aria-labelledby="guides-title">
                <div className="section-heading">
                  <div>
                    <h2 id="guides-title">Map Mode Guidebook</h2>
                    <p>
                      {mapProfiles.length} maps x {gameModes.length} medal modes = {totalMapModeGuides} route guides.
                    </p>
                  </div>
                  <button className="inline-link" type="button" onClick={() => selectTab('maps')}>
                    Browse maps
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                </div>

                <div className="guide-controls">
                  <label htmlFor="guide-map-select">
                    <span>Map</span>
                    <select
                      id="guide-map-select"
                      aria-label="Map"
                      value={selectedGuideMap}
                      onChange={(event) => setSelectedGuideMap(event.target.value)}
                    >
                      <option>All maps</option>
                      {mapProfiles.map((map) => (
                        <option key={map.name}>{map.name}</option>
                      ))}
                    </select>
                  </label>
                  <label htmlFor="guide-mode-select">
                    <span>Mode</span>
                    <select
                      id="guide-mode-select"
                      aria-label="Mode"
                      value={selectedGuideMode}
                      onChange={(event) => setSelectedGuideMode(event.target.value)}
                    >
                      <option>All modes</option>
                      {gameModes.map((mode) => (
                        <option key={mode.name}>{mode.name}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGuideMap('All maps')
                      setSelectedGuideMode('All modes')
                    }}
                  >
                    Show all
                  </button>
                </div>

                <div ref={guideDetailRef} className="guide-detail-anchor" data-guide-detail>
                  {hasSpecificGuideMap && showChimpsDepth && <ChimpsDeepGuide guide={selectedChimpsGuide} />}

                  {hasSpecificGuideMap && !showChimpsDepth && (
                    <article className="guide-detail">
                      <MapImageFrame map={selectedGuide.map} className="guide-detail-image" priority />
                      <div className="guide-detail-body">
                        <div className="guide-meta">
                          <span>{selectedGuide.map.difficulty}</span>
                          <span>{selectedGuide.mode.name}</span>
                          <span>{selectedGuide.mode.rounds}</span>
                        </div>
                        <h3>{selectedGuide.title}</h3>
                        <p>{selectedGuide.summary}</p>
                        <ol>
                          {selectedGuide.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                        <div className="works-with">
                          {selectedGuide.priorityTowers.map((tower) => (
                            <span key={tower}>{tower}</span>
                          ))}
                        </div>
                        <p className="watch-out">{selectedGuide.warning}</p>
                        <SourceLinks sources={[sourceRefs.wikiMaps, sourceRefs.wikiV55]} />
                      </div>
                    </article>
                  )}
                </div>

                {showChimpsDepth && (
                  <section className="chimps-index" aria-labelledby="chimps-index-title">
                    <div className="guidebook-heading">
                      <div>
                        <h3 id="chimps-index-title">CHIMPS Deep Guides</h3>
                        <p>
                          Showing {visibleChimpsGuides.length} of {filteredChimpsGuides.length} map-specific CHIMPS plans.
                        </p>
                      </div>
                      {filteredChimpsGuides.length > visibleChimpsGuides.length && (
                        <span>Use map or search filters to narrow the full CHIMPS guide index.</span>
                      )}
                    </div>
                    <div className="chimps-card-grid">
                      {visibleChimpsGuides.map((guide) => (
                        <article
                          className="chimps-mini-card guide-select-card"
                          key={guide.id}
                          onClick={(event) => openGuideFromCard(event, guide.map.name, 'CHIMPS')}
                        >
                          <MapImageFrame map={guide.map} className="chimps-mini-image" />
                          <div>
                            <div className="guide-meta">
                              <span>{guide.map.difficulty}</span>
                              <span>{guide.routeType}</span>
                            </div>
                            <h3>{guide.map.name}</h3>
                            <p>{guide.summary}</p>
                            <div className="chimps-mini-actions">
                              <RiskBadge value={guide.risk} />
                              <button
                                className="card-open-button"
                                type="button"
                                onClick={() => openGuide(guide.map.name, 'CHIMPS')}
                              >
                                Open guide
                                <ChevronRight size={13} aria-hidden="true" />
                              </button>
                            </div>
                            <SourceLinks sources={[guide.tutorialLinks[0]]} />
                          </div>
                        </article>
                      ))}
                      {filteredChimpsGuides.length === 0 && (
                        <p className="empty-state">No CHIMPS deep guides match this search.</p>
                      )}
                    </div>
                  </section>
                )}

                <div className="guidebook-heading">
                  <div>
                    <h3>Guide Matrix</h3>
                    <p>
                      Showing {visibleMapModeGuides.length} of {filteredMapModeGuides.length} matching guides.
                    </p>
                  </div>
                  {filteredMapModeGuides.length > visibleMapModeGuides.length && (
                    <span>Use search, map, or mode filters to narrow the full matrix.</span>
                  )}
                </div>

                <div className="mode-guide-grid">
                  {visibleMapModeGuides.map((guide) => (
                    <article
                      className="mode-guide-card guide-select-card"
                      key={guide.id}
                      onClick={(event) => openGuideFromCard(event, guide.map.name, guide.mode.name)}
                    >
                      <MapImageFrame map={guide.map} className="mode-guide-image" />
                      <div>
                        <div className="guide-meta">
                          <span>{guide.map.difficulty}</span>
                          <span>{guide.mode.name}</span>
                        </div>
                        <h3>{guide.title}</h3>
                        <p>{guide.summary}</p>
                        <strong>{guide.warning}</strong>
                        <button
                          className="card-open-button"
                          type="button"
                          onClick={() => openGuide(guide.map.name, guide.mode.name)}
                        >
                          Open guide
                          <ChevronRight size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  ))}
                  {filteredMapModeGuides.length === 0 && (
                    <p className="empty-state">No map-mode guides match this search.</p>
                  )}
                </div>

                <div className="featured-guides">
                  <h3>Featured Route Notes</h3>
                  <div className="guide-list">
                    {filteredFeaturedGuides.map((guide) => (
                      <article className="guide-card" key={guide.title}>
                        <ImageFrame imageKey={guide.imageKey} className="guide-image" />
                        <div>
                          <div className="guide-meta">
                            <span>{guide.category}</span>
                            <span>{guide.map}</span>
                          </div>
                          <h3>{guide.title}</h3>
                          <p>{guide.summary}</p>
                          <ul>
                            {guide.steps.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ul>
                          <div className="guide-footer">
                            <span>Updated {guide.updatedAt}</span>
                            <SourceLinks sources={guide.sources} />
                          </div>
                        </div>
                      </article>
                    ))}
                    {filteredFeaturedGuides.length === 0 && (
                      <p className="empty-state">No featured guides match this search.</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'towers' && (
              <section className="panel" aria-labelledby="towers-title">
                <div className="section-heading">
                  <div>
                    <h2 id="towers-title">All Monkeys & Towers</h2>
                    <p>Full current standard tower roster with class, role, image, and fast meta context.</p>
                  </div>
                  <span className="legend">
                    <Filter size={14} aria-hidden="true" />
                    {filteredTowers.length} roster rows
                  </span>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Unit</th>
                        <th>Class</th>
                        <th>Role</th>
                        <th>CHIMPS</th>
                        <th>Boss</th>
                        <th>Ease</th>
                        <th>Trend</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTowers.map((tower) => (
                        <tr key={tower.unit}>
                          <td>
                            <div className="unit-cell">
                              <ImageFrame imageKey={tower.imageKey} className="unit-thumb" />
                              <span>{tower.unit}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`class-chip class-${tower.className.toLowerCase()}`}>
                              {tower.className}
                            </span>
                          </td>
                          <td>{tower.role}</td>
                          <td>
                            <Tier value={tower.chimpsTier} />
                          </td>
                          <td>
                            <Tier value={tower.bossTier} />
                          </td>
                          <td>{tower.ease}</td>
                          <td>
                            <Trend trend={tower.trend} />
                          </td>
                          <td>{tower.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTowers.length === 0 && (
                    <p className="empty-state">No tower rows match this search.</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'maps' && (
              <section className="panel compact-panel" aria-labelledby="maps-title">
                <div className="section-heading flush-heading">
                  <div>
                    <h2 id="maps-title">All Maps</h2>
                    <p>{filteredMaps.length} map profiles with routing flags, thumbnails, and guide shortcuts.</p>
                  </div>
                  <SourceLinks sources={[sourceRefs.wikiMaps]} />
                </div>
                <div className="map-list map-grid">
                  {filteredMaps.map((map) => (
                    <article key={map.name}>
                      <MapImageFrame map={map} className="map-image" />
                      <div>
                        <span>{map.hidden ? `${map.difficulty} hidden` : map.difficulty}</span>
                        <h3>{map.name}</h3>
                        <p>{map.focus}</p>
                        <strong>{map.recommendation}</strong>
                        <div className="works-with map-tags">
                          {map.tags.slice(1, 4).map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <button
                          className="map-guide-button"
                          type="button"
                          onClick={() => {
                            setSelectedGuideMap(map.name)
                            setSelectedGuideMode('CHIMPS')
                            selectTab('guides')
                          }}
                        >
                          CHIMPS guide
                          <ChevronRight size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  ))}
                  {filteredMaps.length === 0 && <p className="empty-state">No map notes match this search.</p>}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Fan-made strategy resource. Bloons TD 6 is by Ninja Kiwi.</p>
        <div>
          <a href={sourceRefs.pressKit.url} target="_blank" rel="noreferrer">
            Press-kit imagery
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href="https://bloons.fandom.com/wiki/Bloons_Wiki" target="_blank" rel="noreferrer">
            Character thumbnails
            <ExternalLink size={13} aria-hidden="true" />
          </a>
          <a href="https://store.steampowered.com/eula/1276390_eula_0" target="_blank" rel="noreferrer">
            Fan content terms
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
