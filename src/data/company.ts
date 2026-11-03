/*
 * Company facts shown in the Trust section and footer.
 * Fill these with your real registration details — banks, enterprise buyers and
 * government tenders check them. Empty values show as "To be added".
 * Never mark a certification "certified" until you hold the certificate.
 */
export const COMPANY = {
  legalName: '', // e.g. "Glixy Technologies Private Limited"
  cin: '', // Corporate Identification Number (MCA)
  gstin: '',
  udyam: '', // Udyam (MSME) registration number
  dpiit: '', // Startup India recognition number
  registeredOffice: '',
  supportEmail: '',
  supportPhone: '',
  grievanceOfficer: '', // name + email, required under India's IT Rules
}

export type ComplianceStatus = 'certified' | 'in-progress' | 'planned'

export const COMPLIANCE: { name: string; what: string; status: ComplianceStatus }[] = [
  { name: 'ISO/IEC 27001', what: 'Information security management', status: 'planned' },
  { name: 'SOC 2 Type II', what: 'Independent audit of security & availability controls', status: 'planned' },
  { name: 'PCI DSS', what: 'Card-data security for payment workloads', status: 'planned' },
  { name: 'MeitY cloud empanelment', what: 'Eligibility for Indian government workloads', status: 'planned' },
  { name: 'DPDP Act 2023', what: 'India’s Digital Personal Data Protection readiness', status: 'planned' },
  { name: 'Tier III / IV facility', what: 'Certified data-centre design for our halls', status: 'planned' },
  { name: 'Udyam (MSME)', what: 'Registered micro, small & medium enterprise', status: 'planned' },
  { name: 'Startup India (DPIIT)', what: 'Government-recognised startup', status: 'planned' },
]

export const SECURITY = [
  ['24×7 network operations centre', 'Engineers on shift around the clock, every day of the year.'],
  ['Biometric + mantrap access', 'Two-factor entry, CCTV with 90-day retention, visitor logs.'],
  ['A+B power, diesel backup', 'Dual utility feeds, UPS and generator fuel on site.'],
  ['Encrypted, off-site backups', 'Daily snapshots stored in a second region.'],
  ['Always-on DDoS filtering', 'Volumetric attacks scrubbed before they reach your server.'],
  ['Fire suppression & cooling', 'Gas-based suppression and N+1 precision cooling.'],
]

export const POLICIES = [
  { id: 'sla', label: 'Service level agreement' },
  { id: 'refund', label: 'Refund & cancellation policy' },
  { id: 'privacy', label: 'Privacy policy (DPDP)' },
  { id: 'terms', label: 'Terms of service' },
  { id: 'aup', label: 'Acceptable use policy' },
  { id: 'disclosure', label: 'Responsible disclosure' },
]

export const PAYMENTS = ['GST-compliant invoices', 'UPI, cards, NEFT & RTGS', 'Purchase orders & net-30', 'Annual prepay discounts']
