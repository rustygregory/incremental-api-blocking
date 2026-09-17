/** Partners available in Version 1 (checkbox modal). */
export const V1_PARTNERS = [
  { id: 'acme-support', name: 'Acme Support' },
  { id: 'northstar-labs', name: 'Northstar Labs' },
  { id: 'bluebird-health', name: 'Bluebird Health' },
  { id: 'contoso-services', name: 'Contoso Services' },
]

/** Partners available in Version 2 / 2.1 (searchable multiselect Combobox). */
export const V2_PARTNERS = [
  { id: 'acme-support', name: 'Acme Support' },
  { id: 'northstar-labs', name: 'Northstar Labs' },
  { id: 'bluebird-health', name: 'Bluebird Health' },
  { id: 'contoso-services', name: 'Contoso Services' },
  { id: 'apex-digital', name: 'Apex Digital' },
  { id: 'brightline-systems', name: 'Brightline Systems' },
  { id: 'cascade-analytics', name: 'Cascade Analytics' },
  { id: 'cobalt-communications', name: 'Cobalt Communications' },
  { id: 'deltaforge', name: 'Deltaforge' },
  { id: 'evergreen-ops', name: 'Evergreen Ops' },
  { id: 'frontier-metrics', name: 'Frontier Metrics' },
  { id: 'harbor-cloud', name: 'Harbor Cloud' },
  { id: 'ironclad-software', name: 'Ironclad Software' },
  { id: 'juniper-data', name: 'Juniper Data' },
  { id: 'keystone-platforms', name: 'Keystone Platforms' },
  { id: 'lumen-bridge', name: 'Lumen Bridge' },
  { id: 'meridian-tech', name: 'Meridian Tech' },
  { id: 'nimbus-works', name: 'Nimbus Works' },
  { id: 'orbit-solutions', name: 'Orbit Solutions' },
  { id: 'pinnacle-partner', name: 'Pinnacle Partner' },
  { id: 'quantum-relay', name: 'Quantum Relay' },
  { id: 'redwood-integrations', name: 'Redwood Integrations' },
  { id: 'summit-channel', name: 'Summit Channel' },
  { id: 'truenorth-apps', name: 'TrueNorth Apps' },
  { id: 'vertex-alliance', name: 'Vertex Alliance' },
]

export const VERSIONS = [
  { id: 'v1', label: 'Version 1', description: 'Checkbox modal' },
  { id: 'v2', label: 'Version 2', description: 'Searchable multiselect' },
  { id: 'v2.1', label: 'Version 2.1', description: 'Expiration' },
]

/**
 * Blocking / extension phase windows.
 * Phase 2 informed date is TBD.
 * March 6, 2027 is the hard stop — extensions may land outside a phase
 * window, but not beyond this date. Only partners with an extension appear.
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

  // Indices: 0–3 phase1, 4–6 phase3, 7–9 after-window — then shuffle display
  // order so post-window rows sit among phase partners.
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

export function isComboboxVersion(versionId) {
  return versionId === 'v2' || versionId === 'v2.1'
}
