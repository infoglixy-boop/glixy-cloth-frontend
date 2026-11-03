export type Audience = 'B2C' | 'B2B'
export type Kind = 'personal' | 'metal' | 'gpu' | 'storage' | 'colo'

export interface Server {
  id: string
  name: string
  code: string
  kind: Kind
  audience: Audience
  tagline: string
  description: string
  cpu: string
  ram: string
  storage: string
  network: string
  gpu?: string
  units: number // rack units (U) this machine occupies
  price: number // INR per month
  setup: string
  accent: string // main glow colour of the artwork
  accent2: string // secondary colour of the artwork
}

export const KINDS: { id: Kind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'personal', label: 'Personal' },
  { id: 'metal', label: 'Bare Metal' },
  { id: 'gpu', label: 'GPU' },
  { id: 'storage', label: 'Storage' },
  { id: 'colo', label: 'Colocation' },
]

export const KIND_LABEL: Record<Kind, string> = {
  personal: 'Personal',
  metal: 'Bare Metal',
  gpu: 'GPU',
  storage: 'Storage',
  colo: 'Colocation',
}

export const SERVERS: Server[] = [
  {
    id: 'nano',
    name: 'Glixy Nano',
    code: 'NANO-1',
    kind: 'personal',
    audience: 'B2C',
    tagline: 'Your first server, always on.',
    description:
      'A small dedicated slice for personal sites, bots and side projects. Root access, a static IP and nothing shared with noisy neighbours.',
    cpu: '2 vCPU · 3.6 GHz',
    ram: '4 GB DDR5',
    storage: '80 GB NVMe',
    network: '1 Gbps · unmetered',
    units: 1,
    price: 499,
    setup: 'Live in 60 seconds',
    accent: '#ffb066',
    accent2: '#f04d0c',
  },
  {
    id: 'spark',
    name: 'Spark Dev',
    code: 'SPK-4',
    kind: 'personal',
    audience: 'B2C',
    tagline: 'Build, break, ship again.',
    description:
      'A developer box with room for containers, CI runners and databases. Snapshots every night so you can experiment without fear.',
    cpu: '4 cores · 4.2 GHz',
    ram: '16 GB DDR5',
    storage: '250 GB NVMe',
    network: '1 Gbps · unmetered',
    units: 1,
    price: 1499,
    setup: 'Live in 2 minutes',
    accent: '#ff9a4d',
    accent2: '#f04d0c',
  },
  {
    id: 'arena',
    name: 'Arena Game Host',
    code: 'ARN-8',
    kind: 'personal',
    audience: 'B2C',
    tagline: 'Low ping. High tick rate.',
    description:
      'High-clock cores and DDoS-filtered routes for game worlds and voice servers. One-click installers for the most-played titles.',
    cpu: '8 cores · 5.0 GHz boost',
    ram: '32 GB DDR5',
    storage: '1 TB NVMe',
    network: '2 Gbps · DDoS shield',
    units: 1,
    price: 3999,
    setup: 'Live in 5 minutes',
    accent: '#ff7a45',
    accent2: '#f04d0c',
  },
  {
    id: 'studio',
    name: 'Studio Creator',
    code: 'STD-12',
    kind: 'personal',
    audience: 'B2C',
    tagline: 'Render overnight. Wake up done.',
    description:
      'A creator workstation in the rack: fast cores, lots of memory and big NVMe scratch space for renders, encodes and media libraries.',
    cpu: '12 cores · 4.8 GHz',
    ram: '64 GB DDR5',
    storage: '2 TB NVMe',
    network: '2.5 Gbps · unmetered',
    units: 1,
    price: 6499,
    setup: 'Live in 10 minutes',
    accent: '#ffc285',
    accent2: '#f04d0c',
  },
  {
    id: 'forge',
    name: 'Forge Business',
    code: 'FRG-16',
    kind: 'metal',
    audience: 'B2B',
    tagline: 'The workhorse for growing teams.',
    description:
      'Single-socket bare metal with ECC memory and mirrored NVMe. Ideal for SaaS backends, ERPs and internal tools that must not go down.',
    cpu: '16 cores · 3.9 GHz',
    ram: '128 GB DDR5 ECC',
    storage: '2 × 1.92 TB NVMe (RAID 1)',
    network: '10 Gbps · private VLAN',
    units: 1,
    price: 14999,
    setup: 'Provisioned in 15 minutes',
    accent: '#ff8a2b',
    accent2: '#f04d0c',
  },
  {
    id: 'titan',
    name: 'Titan Enterprise',
    code: 'TTN-64',
    kind: 'metal',
    audience: 'B2B',
    tagline: 'Dual-socket power, single bill.',
    description:
      'Two sockets, half a terabyte of memory and redundant everything. Built for virtualisation hosts, large databases and core banking loads.',
    cpu: '2 × 32 cores · 3.7 GHz',
    ram: '512 GB DDR5 ECC',
    storage: '4 × 3.84 TB NVMe',
    network: '2 × 25 Gbps · bonded',
    units: 2,
    price: 54999,
    setup: 'Provisioned in 4 hours',
    accent: '#ffa94d',
    accent2: '#f04d0c',
  },
  {
    id: 'atlas',
    name: 'Atlas Database',
    code: 'ATL-48',
    kind: 'metal',
    audience: 'B2B',
    tagline: 'Memory first. Latency last.',
    description:
      'A memory-heavy machine tuned for in-memory databases, analytics and caching layers, with battery-backed write cache.',
    cpu: '48 cores · 3.5 GHz',
    ram: '1 TB DDR5 ECC',
    storage: '8 × 3.84 TB NVMe',
    network: '2 × 25 Gbps · bonded',
    units: 2,
    price: 89999,
    setup: 'Provisioned in 6 hours',
    accent: '#ffcf99',
    accent2: '#f04d0c',
  },
  {
    id: 'helix',
    name: 'Helix GPU',
    code: 'HLX-G4',
    kind: 'gpu',
    audience: 'B2B',
    tagline: 'Four accelerators, zero queue.',
    description:
      'Four data-centre GPUs on a high-bandwidth fabric for fine-tuning, inference and simulation. Reserved by the month, never pre-empted.',
    cpu: '32 cores · 3.8 GHz',
    ram: '512 GB DDR5 ECC',
    storage: '4 × 7.68 TB NVMe',
    network: '100 Gbps · RDMA',
    gpu: '4 × 80 GB tensor GPUs',
    units: 4,
    price: 189999,
    setup: 'Provisioned in 24 hours',
    accent: '#ff6b3d',
    accent2: '#f04d0c',
  },
  {
    id: 'nova',
    name: 'Nova GPU Cluster',
    code: 'NVA-G8',
    kind: 'gpu',
    audience: 'B2B',
    tagline: 'Train the model you actually want.',
    description:
      'Eight GPUs per node, linked across nodes with a non-blocking fabric. Sold as dedicated pods with an engineer assigned to your team.',
    cpu: '2 × 48 cores · 3.6 GHz',
    ram: '2 TB DDR5 ECC',
    storage: '8 × 7.68 TB NVMe',
    network: '8 × 400 Gbps · fabric',
    gpu: '8 × 141 GB tensor GPUs',
    units: 8,
    price: 649999,
    setup: 'Planned with an expert',
    accent: '#ff9d5c',
    accent2: '#f04d0c',
  },
  {
    id: 'vault',
    name: 'Vault Storage',
    code: 'VLT-24',
    kind: 'storage',
    audience: 'B2B',
    tagline: 'Petabytes that stay put.',
    description:
      'A 24-bay storage server for backups, archives and object stores. Hot-swap drives, erasure coding and encrypted at rest.',
    cpu: '16 cores · 3.2 GHz',
    ram: '256 GB DDR5 ECC',
    storage: '24 × 20 TB HDD + 2 × 1.92 TB NVMe',
    network: '2 × 25 Gbps · bonded',
    units: 4,
    price: 74999,
    setup: 'Provisioned in 12 hours',
    accent: '#ffd8a8',
    accent2: '#f04d0c',
  },
  {
    id: 'colo1',
    name: 'Colo 1U Slot',
    code: 'C-1U',
    kind: 'colo',
    audience: 'B2B',
    tagline: 'Bring your box. We keep it alive.',
    description:
      'A single rack unit in a Tier IV hall with dual power feeds, remote hands and a cross-connect to any carrier in the building.',
    cpu: 'Your hardware',
    ram: 'Your hardware',
    storage: 'Your hardware',
    network: '1 Gbps · 5 IPs',
    units: 1,
    price: 5999,
    setup: 'Racked in 48 hours',
    accent: '#e8d5c4',
    accent2: '#f04d0c',
  },
  {
    id: 'rack',
    name: 'Full Rack 42U',
    code: 'R-42U',
    kind: 'colo',
    audience: 'B2B',
    tagline: 'A whole rack with your name on it.',
    description:
      'A private, lockable 42U cabinet with metered A+B power, biometric access and your own caged space if you need it.',
    cpu: 'Your hardware',
    ram: 'Your hardware',
    storage: 'Your hardware',
    network: '10 Gbps · /28 block',
    units: 42,
    price: 149999,
    setup: 'Handed over in 7 days',
    accent: '#ffb47a',
    accent2: '#f04d0c',
  },
]

export const REGIONS = ['Mumbai', 'Chennai', 'Delhi NCR', 'Singapore', 'Frankfurt', 'Virginia']

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

/** The cheapest machine — highlighted in the header and footer for marketing. */
export const LOWEST = SERVERS.reduce((a, b) => (b.price < a.price ? b : a))
