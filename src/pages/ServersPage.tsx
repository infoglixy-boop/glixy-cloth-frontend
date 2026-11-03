import PageHead from '../components/PageHead'
import RackShelf from '../components/RackShelf'
import Catalog from '../components/Catalog'
import Segments from '../components/Segments'
import CtaBand from '../components/CtaBand'
import { SERVERS } from '../data/servers'

export default function ServersPage() {
  return (
    <>
      <PageHead
        eyebrow="Servers"
        title={['Twelve machines.', 'One rack. Your slot.']}
        lead={`From a ₹499 personal box to a private 42U cage — ${SERVERS.length} configurations across personal, bare metal, GPU, storage and colocation. Pick one in the rack or compare them all below.`}
        jumps={[
          ['Rack selector', 'racks'],
          ['Full catalogue', 'catalog'],
          ['Business & personal', 'segments'],
        ]}
      />
      <RackShelf />
      <Catalog />
      <Segments />
      <CtaBand
        title="Not sure which machine fits?"
        text="Tell us your workload and traffic. We’ll recommend a server, a region and a rack slot — and price it."
        next={{ label: 'Benchmarks', to: '/benchmarks', blurb: 'See how dedicated hardware compares with cloud VMs and VPS.' }}
      />
    </>
  )
}
