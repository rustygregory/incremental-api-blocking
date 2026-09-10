/** Partners available in Version 1 (checkbox modal). */
export const V1_PARTNERS = [
  { id: 'acme-support', name: 'Acme Support' },
  { id: 'northstar-labs', name: 'Northstar Labs' },
  { id: 'bluebird-health', name: 'Bluebird Health' },
  { id: 'contoso-services', name: 'Contoso Services' },
]

/** Partners available in Version 2 (searchable multiselect Combobox). */
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
]

export function partnersForVersion(versionId) {
  return versionId === 'v2' ? V2_PARTNERS : V1_PARTNERS
}
