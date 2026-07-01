// Minimal server-side CKAN client — plain fetch, no dependency, no React coupling.
// Used ONLY in getStaticProps/getStaticPaths, so it never reaches the browser bundle.

// CKAN backend base URL. Override at deploy time with the DMS env var.
export const DMS = (process.env.DMS || 'https://kyletxprod.ogopendata.com').replace(/\/+$/, '')

// Filters baked in by /portaljs-connect-ckan. Empty array = no filter.
export const ORG_FILTER: string[] = []
export const GROUP_FILTER: string[] = []

// Max datasets to pre-render at build time (SSG). Raise for larger catalogs;
// note every dataset becomes one statically generated page.
export const MAX_DATASETS = 200

// CKAN REST shapes — only the fields the pages read.
type CkanResource = { id: string; name?: string; format?: string; url?: string }
type CkanOrganization = { name?: string; title?: string }
export type CkanPackage = {
  name: string
  title?: string
  notes?: string
  metadata_modified?: string
  num_resources?: number
  organization?: CkanOrganization
  resources?: CkanResource[]
}

export type SearchArgs = {
  offset?: number
  limit?: number
  tags?: string[]
  orgs?: string[]
  groups?: string[]
}

// Build a CKAN `fq` filter-query from org/group/tag lists (OR within a field).
function buildFq({ orgs = [], groups = [], tags = [] }: SearchArgs): string {
  const clause = (field: string, vals: string[]) =>
    vals.length ? `${field}:(${vals.map((v) => `"${v}"`).join(' OR ')})` : ''
  return [clause('organization', orgs), clause('groups', groups), clause('tags', tags)]
    .filter(Boolean)
    .join(' ')
}

async function ckanAction(action: string, params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${DMS}/api/3/action/${action}?${qs}`)
  if (!res.ok) throw new Error(`CKAN ${action} failed: ${res.status} ${res.statusText}`)
  const body = await res.json()
  if (!body?.success) throw new Error(`CKAN ${action} returned success=false`)
  return body.result
}

// The two-method surface the pages use. Add more actions (organization_list,
// datastore_search, …) here as you extend the portal.
export const ckan = {
  async packageSearch(
    args: SearchArgs = {}
  ): Promise<{ datasets: CkanPackage[]; count: number }> {
    const params: Record<string, string> = {
      start: String(args.offset ?? 0),
      rows: String(args.limit ?? MAX_DATASETS),
    }
    const fq = buildFq(args)
    if (fq) params.fq = fq
    const result = await ckanAction('package_search', params)
    return { datasets: result.results ?? [], count: result.count ?? 0 }
  },
  async getDatasetDetails(slug: string): Promise<CkanPackage> {
    return ckanAction('package_show', { id: slug })
  },
}

// A card is the serializable shape passed to client components from the
// server-side data functions (never pass the raw CKAN responses around unfiltered).
export type DatasetCard = {
  slug: string
  namespace: string // CKAN org name — the @<namespace> URL segment
  name: string // display title
  description: string
  org: string // department display title (e.g. "Finance")
  formats: string[] // distinct uppercased resource formats (e.g. ["PDF", "CSV"])
  numResources: number
  modified: string // ISO date, '' if unknown
}

// Map a raw CKAN package to the serializable card shape the pages render.
export function toCard(d: CkanPackage): DatasetCard {
  const formats = Array.from(
    new Set((d.resources || []).map((r) => (r.format || '').toUpperCase()).filter(Boolean))
  )
  return {
    slug: d.name,
    namespace: d.organization?.name || 'dataset',
    name: d.title || d.name,
    description: d.notes ? d.notes.slice(0, 240) : '',
    org: d.organization?.title || d.organization?.name || 'City of Kyle',
    formats,
    numResources: d.num_resources ?? (d.resources || []).length,
    modified: d.metadata_modified || '',
  }
}

export type Department = { namespace: string; title: string; count: number }

// Count datasets per department (CKAN org), sorted by count desc, only non-empty.
export function departmentCounts(cards: DatasetCard[]): Department[] {
  const map = new Map<string, Department>()
  for (const c of cards) {
    const d = map.get(c.namespace) || { namespace: c.namespace, title: c.org, count: 0 }
    d.count += 1
    map.set(c.namespace, d)
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
}

// Canonical showcase URL — keeps the template's /@<namespace>/<slug> structure.
// The CKAN organization name is the namespace (it groups datasets by publisher,
// i.e. the 'owner' namespace mode); falls back to 'dataset' when an org is absent.
export function datasetHref(d: { namespace: string; slug: string }): string {
  return `/@${d.namespace}/${d.slug}`
}
