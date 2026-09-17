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

function toPartnerRow(partner, isoDate) {
  const expiresAt = atLocalNoon(isoDate)
  return {
    id: partner.id,
    name: partner.name,
    expiresAt: expiresAt.toISOString(),
    expirationDate: formatExpirationDate(expiresAt),
  }
}

/**
 * Ten seeded partners for V2 / V2.1.
 * - First 3 + last 4: phase 1 (same expiration date)
 * - Middle 3: requested after their window (different expiration date)
 *
 * V2: phase 1 date is still in the future → all Granted.
 * V2.1: phase 1 date is past → Expired; post-window three stay Granted.
 */
export function seededPartnersForVersion(versionId) {
  const phase1Iso = versionId === 'v2.1' ? '2026-07-19' : '2026-11-16'
  const postWindowIso = '2027-01-15'
  const ten = V2_PARTNERS.slice(0, 10)

  return ten.map((partner, index) => {
    const isPostWindow = index >= 3 && index <= 5
    return toPartnerRow(partner, isPostWindow ? postWindowIso : phase1Iso)
  })
}

export function partnersForVersion(versionId) {
  return versionId === 'v2' || versionId === 'v2.1' ? V2_PARTNERS : V1_PARTNERS
}

export function isComboboxVersion(versionId) {
  return versionId === 'v2' || versionId === 'v2.1'
}
