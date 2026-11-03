import PageHead from '../components/PageHead'
import Mission from '../components/Mission'
import CtaBand from '../components/CtaBand'

export default function MissionPage() {
  return (
    <>
      <PageHead
        eyebrow="Mission"
        title={['Serious infrastructure,', 'made simple.']}
        lead="Why Glixy exists, where we are going and the four promises behind every server we rack."
      />
      <Mission />
      <CtaBand
        title="Build the next thing on metal you can touch."
        next={{ label: 'Contact', to: '/contact', blurb: 'Sales, support and partnerships.' }}
      />
    </>
  )
}
