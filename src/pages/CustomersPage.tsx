import PageHead from '../components/PageHead'
import Customers from '../components/Customers'
import Segments from '../components/Segments'
import CtaBand from '../components/CtaBand'

export default function CustomersPage() {
  return (
    <>
      <PageHead
        eyebrow="Customers"
        title={['From hostel rooms', 'to bank vaults.']}
        lead="Startups, shops, banks, AI labs, game studios, creators, government teams and students — what each one struggles with, and what they get from Glixy."
        jumps={[
          ['Who uses Glixy', 'customers'],
          ['Business & personal plans', 'segments'],
        ]}
      />
      <Customers />
      <Segments />
      <CtaBand next={{ label: 'Trust', to: '/trust', blurb: 'Uptime, compliance and the company behind the servers.' }} />
    </>
  )
}
