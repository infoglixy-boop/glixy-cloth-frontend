import Hero from '../components/Hero'
import RackShelf from '../components/RackShelf'
import InsideServer from '../components/InsideServer'
import Explore from '../components/Explore'
import PerfStage from '../components/PerfStage'
import Segments from '../components/Segments'
import CtaBand from '../components/CtaBand'

export default function Home() {
  return (
    <>
      <Hero />
      <RackShelf />
      <Explore />
      <PerfStage />
      <InsideServer />
      <Segments />
      <CtaBand next={{ label: 'Servers', to: '/servers', blurb: 'Compare all twelve machines, filter by type and price.' }} />
    </>
  )
}
