import type { InfoPageKey } from '../context/StoreContext'

export type InfoSection = { heading?: string; body: string[] }

export type InfoPage = {
  key: InfoPageKey
  title: string
  kicker: string
  intro: string
  sections: InfoSection[]
}

const lastUpdated = 'Last updated: 18 June 2026'

export const INFO_PAGES: Record<InfoPageKey, InfoPage> = {
  about: {
    key: 'about',
    title: 'About Glixy',
    kicker: 'Our Story',
    intro:
      "Glixy was born in 2023 out of a simple obsession — clothing that says something. We're a homegrown streetwear label out of Mumbai, designing officially-licensed merch and original drops for people who'd rather start a conversation than blend in.",
    sections: [
      {
        heading: 'What we make',
        body: [
          'Heavyweight oversized tees, structured shirts, hoodies and bottoms — every piece printed and stitched in India to retain colour and shape wash after wash.',
          'Our drops happen every Friday, in limited runs. When a fit sells out, it usually stays out.',
        ],
      },
      {
        heading: 'How we make it',
        body: [
          'We work with two GOTS-certified mills in Tirupur for the cotton, and partner with two family-run print houses in Bangalore for our DTG and screen prints.',
          "There's no middleman, no markup, no greenwashing. We tell you what something costs to make on every product page.",
        ],
      },
      {
        heading: 'Where we are headed',
        body: [
          'In 2026 we are opening two flagship stores — one in Bandra, one in Indiranagar — and launching womenswear with our autumn capsule. Subscribe to the newsletter to be on the list.',
        ],
      },
    ],
  },

  careers: {
    key: 'careers',
    title: 'Careers at Glixy',
    kicker: 'We are hiring',
    intro:
      "We're a small team that ships fast and trusts each other. If you love clothes, hate slide-decks, and want a hand in everything from product to marketing — read on.",
    sections: [
      {
        heading: 'Open roles',
        body: [
          'Senior Apparel Designer — Mumbai, hybrid',
          'E-commerce Frontend Engineer (React/TypeScript) — remote, IST hours',
          'Performance Marketer (Meta + Google) — remote',
          'Studio Coordinator, Photography & Look-books — Mumbai, on-site',
        ],
      },
      {
        heading: 'Why Glixy',
        body: [
          'Stock options from day one for every full-time role.',
          'Unlimited paid leave, with a four-day work week between 15 June and 31 August.',
          '₹50,000 / year learning budget — books, courses, conferences.',
          'Two paid trips a year to our mills and print houses so you know exactly where your work ends up.',
        ],
      },
      {
        heading: 'How to apply',
        body: [
          'Drop your CV (or, honestly, just a link to anything you have made) to careers@glixy.in with the role in the subject line. We reply to every application within 7 working days.',
        ],
      },
    ],
  },

  sustainability: {
    key: 'sustainability',
    title: 'Sustainability',
    kicker: 'Made better',
    intro:
      'Fashion is the second-most polluting industry on the planet. We are not going to fix that single-handedly, but we are not going to pretend it does not matter either. Here is where we are, honestly.',
    sections: [
      {
        heading: 'Materials',
        body: [
          '92% of our cotton is GOTS-certified organic, sourced from Tirupur.',
          'All polyester used in our active line is 100% recycled (rPET).',
          'No virgin polybags — every Glixy order ships in a fully compostable mailer.',
        ],
      },
      {
        heading: 'Production',
        body: [
          'Water-based, AZO-free inks for every print.',
          'Average production-to-delivery distance: 1,180 km. We do not ship from China.',
          'Solar covers 41% of our largest print facility — targeting 80% by end of 2026.',
        ],
      },
      {
        heading: 'Take-back',
        body: [
          'Send any worn-out Glixy piece back to us in any condition and we will recycle the fibres and give you ₹150 in store credit. Free shipping label included in every order.',
        ],
      },
    ],
  },

  privacy: {
    key: 'privacy',
    title: 'Privacy Policy',
    kicker: lastUpdated,
    intro:
      'Glixy ("we", "us") respects your privacy. This policy explains what personal data we collect, how we use it, and the rights you have. By using glixy.in you agree to this policy.',
    sections: [
      {
        heading: '1. What we collect',
        body: [
          'Account data: name, email, phone, password (hashed). Required only if you create an account.',
          'Order data: shipping/billing addresses, items ordered, payment status. We never store card numbers — payments are handled by Razorpay (PCI-DSS Level 1).',
          'Browsing data: device, browser, pages visited, referrer. Collected via first-party cookies and GA4. You can opt out via the cookie banner.',
        ],
      },
      {
        heading: '2. How we use it',
        body: [
          'To fulfil orders, send shipping updates and process returns.',
          'To send marketing emails — only if you opt in. You can unsubscribe from every email.',
          'To improve the site (heatmaps, A/B tests). Always anonymised.',
        ],
      },
      {
        heading: '3. Sharing',
        body: [
          'Shipping partners (Delhivery, BlueDart, XpressBees) get only what they need to deliver your order.',
          'We never sell your data to third parties.',
        ],
      },
      {
        heading: '4. Your rights',
        body: [
          'You can request a copy of your data, ask us to delete it, or correct it, by emailing privacy@glixy.in. We respond within 30 days as per the DPDP Act, 2023.',
        ],
      },
    ],
  },

  terms: {
    key: 'terms',
    title: 'Terms & Conditions',
    kicker: lastUpdated,
    intro:
      'These Terms govern your use of glixy.in and any purchase you make from us. By placing an order you accept these Terms in full. If you do not agree, please do not use the site.',
    sections: [
      {
        heading: '1. Eligibility',
        body: [
          'You must be at least 18 years old, or have parental consent, to make a purchase on Glixy.',
          'You agree to provide accurate, current and complete information at checkout.',
        ],
      },
      {
        heading: '2. Pricing & availability',
        body: [
          'All prices are in INR and inclusive of GST.',
          'We may correct typographical errors in pricing at any time. If a wrong price is shown after you have paid, you will be refunded the difference within 5 working days.',
          'Stock is updated in real time. Rarely, an item may go out of stock between checkout and dispatch — we will refund you in full and notify you within 24 hours.',
        ],
      },
      {
        heading: '3. Orders',
        body: [
          'Orders are confirmed once payment is received and a confirmation email is sent.',
          'We reserve the right to cancel any order suspected of fraud, reselling or bulk-buying. Refund is processed within 7 working days in such cases.',
        ],
      },
      {
        heading: '4. Intellectual property',
        body: [
          'All designs, prints, photographs and copy on glixy.in are the property of Glixy Lifestyle Pvt. Ltd. or our licensors.',
          'You may not reproduce, sell or distribute our content without written permission.',
        ],
      },
      {
        heading: '5. Liability',
        body: [
          "To the maximum extent permitted by law, Glixy's liability is limited to the value of the order in question. We are not liable for indirect or consequential losses.",
        ],
      },
      {
        heading: '6. Jurisdiction',
        body: [
          'These Terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts of Mumbai.',
        ],
      },
    ],
  },

  shipping: {
    key: 'shipping',
    title: 'Shipping & Delivery',
    kicker: 'Fast, free, tracked',
    intro:
      'We ship across India, Monday to Saturday, from our warehouse in Bhiwandi. Every order is tracked end-to-end and you will get SMS / WhatsApp updates from dispatch to delivery.',
    sections: [
      {
        heading: 'Charges',
        body: [
          'Free Standard Shipping on every order above ₹999.',
          'Below ₹999: a flat ₹49 contribution.',
          'Express delivery (next-day in metros): ₹149 — choose at checkout.',
        ],
      },
      {
        heading: 'Timelines',
        body: [
          'Metros (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Pune, Kolkata): 2–4 working days.',
          'Tier-2 / 3 cities: 3–6 working days.',
          'Northeast and remote pin codes: 5–8 working days.',
          'Order placed before 1 PM IST = dispatched the same day, Monday to Saturday.',
        ],
      },
      {
        heading: 'International',
        body: [
          'We ship to the US, UK, UAE, Canada and Australia via DHL Express. Flat $25 shipping, delivered in 4–7 working days. Duties and taxes are calculated at checkout — no surprises.',
        ],
      },
      {
        heading: 'Tracking',
        body: [
          'Use the Track Order link in the footer or click the tracking link in your dispatch email. Tracking is also embedded in your Glixy account.',
        ],
      },
    ],
  },

  returns: {
    key: 'returns',
    title: 'Returns & Exchanges',
    kicker: '15 days, easy & free',
    intro:
      "Tried it on and it isn't quite right? No drama. You have 15 days from the date of delivery to send it back, free of charge.",
    sections: [
      {
        heading: 'How it works',
        body: [
          '1. Go to Track Order in the footer, find your order, and click Return.',
          '2. Choose a refund or an exchange. Exchanges are free; refunds are credited to the original payment method.',
          '3. We pick up the parcel from your address within 48 hours.',
          '4. Refund is processed within 5 working days of the parcel reaching our warehouse.',
        ],
      },
      {
        heading: "What's eligible",
        body: [
          'Unworn, unwashed items with original tags attached.',
          'Original packaging is appreciated but not mandatory.',
        ],
      },
      {
        heading: "What's not",
        body: [
          'Innerwear, socks and customised products are non-returnable for hygiene reasons.',
          'Sale items marked "Final Sale" are not eligible for refund — exchange only.',
        ],
      },
    ],
  },

  faqs: {
    key: 'faqs',
    title: 'Frequently Asked Questions',
    kicker: 'Quick answers',
    intro:
      "If your question is not here, drop us a line and we will reply within 24 hours.",
    sections: [
      {
        heading: 'How do I know my size?',
        body: [
          'Every product page has a "Find my size" link with model fit notes, body measurements and a chest/length chart. If in doubt, our oversized tees fit relaxed — size down if you want a regular fit.',
        ],
      },
      {
        heading: 'Do you offer Cash on Delivery?',
        body: [
          "Yes, COD is available for orders up to ₹3,000 across India. A non-refundable convenience fee of ₹49 applies.",
        ],
      },
      {
        heading: 'Are your tees pre-shrunk?',
        body: [
          'Yes — every cotton garment is pre-shrunk and bio-washed. Wash inside-out, cold, and air dry to keep the print sharp.',
        ],
      },
      {
        heading: 'Can I cancel an order?',
        body: [
          "You can cancel from your account within 4 hours of placing the order, before we dispatch. After that, you'll need to start a return.",
        ],
      },
      {
        heading: 'Where are you based?',
        body: [
          'Our HQ and studio are in Bandra West, Mumbai. Our warehouse and print houses are in Bhiwandi, Tirupur and Bangalore.',
        ],
      },
    ],
  },

  track: {
    key: 'track',
    title: 'Track Your Order',
    kicker: 'Live updates',
    intro:
      'Enter your order number (starts with GLX-) and the email or phone used at checkout. You will see the current status, the delivery agent, and an updated ETA.',
    sections: [
      {
        heading: 'Where do I find my order number?',
        body: [
          'It is at the top of your order confirmation email, on your WhatsApp confirmation, and on your account orders page.',
        ],
      },
      {
        heading: 'Need a hand?',
        body: [
          'Email orders@glixy.in or WhatsApp +91 98765 43210 — we are around 7 days a week, 9 AM to 9 PM IST.',
        ],
      },
    ],
  },

  contact: {
    key: 'contact',
    title: 'Contact Us',
    kicker: 'Reach out',
    intro:
      'Got a question, a suggestion or just want to say hi? We read everything ourselves.',
    sections: [
      {
        heading: 'Customer support',
        body: [
          'Email: hello@glixy.in',
          'WhatsApp: +91 98765 43210',
          'Hours: 9 AM – 9 PM IST, Monday to Sunday.',
        ],
      },
      {
        heading: 'Press & collaborations',
        body: ['press@glixy.in — we typically respond within 48 hours.'],
      },
      {
        heading: 'HQ',
        body: [
          'Glixy Lifestyle Pvt. Ltd.',
          '4th Floor, Linking Road, Bandra West',
          'Mumbai 400050, India',
          'GSTIN: 27AABCG1234L1ZA',
        ],
      },
    ],
  },
}
