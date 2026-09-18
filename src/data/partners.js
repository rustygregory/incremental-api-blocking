/** App names used across partner OAuth suites in the account. */
const APP_POOL = [
  'Calendar',
  'Time saver',
  'Support desk',
  'Analytics',
  'Chat',
  'Ticketing',
  'Reports',
  'Mobile',
  'Knowledge base',
  'Notifications',
  'Workflows',
  'Insights',
]

function appsFor(count, offset = 0) {
  const apps = []
  for (let i = 0; i < count; i += 1) {
    apps.push(APP_POOL[(offset + i) % APP_POOL.length])
  }
  return apps
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/** Partners available in Version 1 (checkbox modal). Each has 2+ apps. */
export const V1_PARTNERS = [
  { id: 'acme-support', name: 'Acme Support', apps: appsFor(3, 0) },
  { id: 'northstar-labs', name: 'Northstar Labs', apps: appsFor(2, 2) },
  { id: 'bluebird-health', name: 'Bluebird Health', apps: appsFor(4, 4) },
  { id: 'contoso-services', name: 'Contoso Services', apps: appsFor(5, 1) },
]

/** Partners available in Version 2 / 2.1 (searchable multiselect Combobox). */
export const V2_PARTNERS = [
  { id: 'acme-support', name: 'Acme Support', apps: appsFor(3, 0) },
  { id: 'northstar-labs', name: 'Northstar Labs', apps: appsFor(2, 2) },
  { id: 'bluebird-health', name: 'Bluebird Health', apps: appsFor(4, 4) },
  { id: 'contoso-services', name: 'Contoso Services', apps: appsFor(5, 1) },
  { id: 'apex-digital', name: 'Apex Digital', apps: appsFor(2, 3) },
  { id: 'brightline-systems', name: 'Brightline Systems', apps: appsFor(6, 5) },
  { id: 'cascade-analytics', name: 'Cascade Analytics', apps: appsFor(3, 6) },
  { id: 'cobalt-communications', name: 'Cobalt Communications', apps: appsFor(2, 8) },
  { id: 'deltaforge', name: 'Deltaforge', apps: appsFor(4, 0) },
  { id: 'evergreen-ops', name: 'Evergreen Ops', apps: appsFor(5, 2) },
  { id: 'frontier-metrics', name: 'Frontier Metrics', apps: appsFor(2, 7) },
  { id: 'harbor-cloud', name: 'Harbor Cloud', apps: appsFor(3, 9) },
  { id: 'ironclad-software', name: 'Ironclad Software', apps: appsFor(6, 1) },
  { id: 'juniper-data', name: 'Juniper Data', apps: appsFor(2, 4) },
  { id: 'keystone-platforms', name: 'Keystone Platforms', apps: appsFor(4, 10) },
  { id: 'lumen-bridge', name: 'Lumen Bridge', apps: appsFor(3, 0) },
  { id: 'meridian-tech', name: 'Meridian Tech', apps: appsFor(5, 3) },
  { id: 'nimbus-works', name: 'Nimbus Works', apps: appsFor(2, 6) },
  { id: 'orbit-solutions', name: 'Orbit Solutions', apps: appsFor(3, 8) },
  { id: 'pinnacle-partner', name: 'Pinnacle Partner', apps: appsFor(4, 2) },
  { id: 'quantum-relay', name: 'Quantum Relay', apps: appsFor(2, 11) },
  { id: 'redwood-integrations', name: 'Redwood Integrations', apps: appsFor(6, 4) },
  { id: 'summit-channel', name: 'Summit Channel', apps: appsFor(3, 7) },
  { id: 'truenorth-apps', name: 'TrueNorth Apps', apps: appsFor(5, 0) },
  { id: 'vertex-alliance', name: 'Vertex Alliance', apps: appsFor(2, 5) },
]

export const VERSIONS = [
  { id: 'v2', label: 'Version 2', description: 'Searchable multiselect' },
  { id: 'v2.1', label: 'Version 2.1', description: 'Expiration' },
  { id: 'v1', label: 'Version 1', description: 'Checkbox modal', archived: true },
]

/**
 * Blocking / extension phase windows.
 * Phase 2 informed date is TBD.
 * Extensions may land outside a phase window, but not beyond programEnds.
 * Only partners with an extension appear in the configuration table.
 */
export const PHASES = {
  phase1: {
    id: 'phase1',
    informedOn: '2026-09-22',
    /** Sept 22 + 60 days */
    windowEnds: '2026-11-21',
  },
  // phase2: { informedOn: TBD, windowEnds: TBD },
  phase3: {
    id: 'phase3',
    informedOn: '2026-10-27',
    /** Phase 3 extension window ends */
    windowEnds: '2027-03-15',
  },
  /** Final day when all phases are done; max extension end. */
  programEnds: '2027-03-15',
}

/**
 * V2.1 status is evaluated as of this date so Phase 1 shows Expired while
 * Phase 3 (still in window) and post-window extensions stay Granted.
 * (Wall-clock “today” is still before Phase 1 starts.)
 */
export const V21_STATUS_AS_OF = '2026-12-01'

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]

function formatExpirationDate(date) {
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function atLocalNoon(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

function toPartnerRow(partner, { isoDate, phase }) {
  const expiresAt = atLocalNoon(isoDate)
  return {
    id: partner.id,
    name: partner.name,
    phase,
    expiresAt: expiresAt.toISOString(),
    expirationDate: formatExpirationDate(expiresAt),
  }
}

/**
 * Flatten partners into modal options: "Partner - App".
 * One extension covers the whole OAuth suite, so after save every app for
 * that partner is removed from the add list.
 */
export function partnerAppOptions(partners) {
  return partners.flatMap((partner) =>
    (partner.apps || []).map((appName) => ({
      id: `${partner.id}__${slugify(appName)}`,
      partnerId: partner.id,
      partnerName: partner.name,
      appName,
      label: `${partner.name} - ${appName}`,
    })),
  )
}

/**
 * Ten seeded partners for Version 2.1 only (V2 starts empty).
 * Mixed order — not grouped by phase in the table.
 * - 4 × Phase 1 → window end Nov 21, 2026
 * - 3 × Phase 3 → window end March 15, 2027
 * - 3 × after-window → March 15, 2027 (program hard stop)
 */
export function seededPartnersForVersion(versionId) {
  if (versionId !== 'v2.1') return []

  const phase1 = PHASES.phase1.windowEnds
  const phase3 = PHASES.phase3.windowEnds
  const afterWindow = PHASES.programEnds
  const ten = V2_PARTNERS.slice(0, 10)

  const specs = [
    { partner: ten[0], isoDate: phase1, phase: 'phase1' },
    { partner: ten[7], isoDate: afterWindow, phase: 'after-window' },
    { partner: ten[1], isoDate: phase1, phase: 'phase1' },
    { partner: ten[4], isoDate: phase3, phase: 'phase3' },
    { partner: ten[2], isoDate: phase1, phase: 'phase1' },
    { partner: ten[8], isoDate: afterWindow, phase: 'after-window' },
    { partner: ten[5], isoDate: phase3, phase: 'phase3' },
    { partner: ten[3], isoDate: phase1, phase: 'phase1' },
    { partner: ten[9], isoDate: afterWindow, phase: 'after-window' },
    { partner: ten[6], isoDate: phase3, phase: 'phase3' },
  ]

  return specs.map(({ partner, isoDate, phase }) => toPartnerRow(partner, { isoDate, phase }))
}

export function partnersForVersion(versionId) {
  return versionId === 'v2' || versionId === 'v2.1' ? V2_PARTNERS : V1_PARTNERS
}

export function partnerAppOptionsForVersion(versionId) {
  return partnerAppOptions(partnersForVersion(versionId))
}

export function isComboboxVersion(versionId) {
  return versionId === 'v2' || versionId === 'v2.1'
}
