import PageHead from '../components/PageHead'
import Trust from '../components/Trust'
import CtaBand from '../components/CtaBand'

export default function TrustPage() {
  return (
    <>
      <PageHead
        eyebrow="Trust"
        title={['Trust you can', 'check for yourself.']}
        lead="Uptime, business health, compliance, security and policies — everything customers, auditors and lenders ask us, in one place."
        jumps={[
          ['Uptime', 'uptime'],
          ['Compliance', 'compliance'],
          ['Investors & lenders', 'lenders'],
        ]}
      />
      <Trust />
      <CtaBand
        title="Doing due diligence on Glixy?"
        text="Banks, investors and enterprise buyers can request our company profile, financial statements and compliance documents."
        prefill={{ audience: 'B2B', note: 'Investor / lender enquiry — please share company profile and financials' }}
        next={{ label: 'Mission', to: '/mission', blurb: 'Why we exist and what we promise.' }}
      />
    </>
  )
}
