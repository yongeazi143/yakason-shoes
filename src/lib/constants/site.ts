/**
 * Yakason Shoes - Central Site Constants
 * All company details, contacts, branding, legal, and SEO metadata.
 */

export const SITE = {
  name: 'Yakason Global Best Venture',
  shortName: 'Yakason Shoes',
  legalName: 'Yakason Global Best Venture',
  brandCode: 'YAKASON//CRAFT',
  establishedYear: '2005',
  tagline: 'Quality Express in Footwears',
  taglineFull: 'Quality Express in Footwears · Since 2005',
  subTagline: 'Quality Footwear at Best Prices',
  rcNumber: '9908327',
  rcFormatted: 'RC 9908327',
  rcDisplay: 'RC NO: 9908327',
  registrationText: 'CAC (RC 9908327) & SON Registered',
  registrationTextShort: 'CAC RC 9908327 · SON REGISTERED',
  certificationBadge: 'Yakason Global Best Venture · RC 9908327 · SON Registered',
  factoryProof: 'Direct from our Lagos factory floor. CAC (RC 9908327) & SON Certified Quality.',
  preloaderBadge: 'EST. 2005 · RC 9908327',

  clock: {
    city: 'LAGOS',
    timezone: 'Africa/Lagos',
    locale: 'en-GB',
    coordinates: '6.52°N 3.37°E',
  },

  address: {
    factoryAndShowroom: 'Adebohun Street, Iyana Ipaja, Lagos State, Nigeria',
    factoryShort: 'Adebohun Street, Iyana Ipaja',
    factoryShortUppercase: 'ADEBOHUN STREET IYANA IPAJA',
    workshopStreet: 'Adebohun Street Iyana Ipaja',
    attribution: '— YAKASON GLOBAL BEST VENTURE · ADEBOHUN STREET IYANA IPAJA —',
    hours: 'Mon – Sat: 8:00 AM – 6:00 PM',
    dispatchNote: 'Wholesale Carton Dispatches · Inter-State Transit Nationwide',
  },

  contact: {
    phoneDisplay: '+234 803 000 0000 / +234 802 000 0000',
    phones: ['+234 803 000 0000', '+234 802 000 0000'] as const,
    primaryPhone: '+234 803 000 0000',
    secondaryPhone: '+234 802 000 0000',
    email: '', // TODO: Add official company email
  },

  whatsapp: {
    number: '2348033000000',
    orderNumber: '2348000000000',
    prefilledMessage: 'Hello Yakason Shoes, I would like to inquire about bespoke footwear.',
  },

  social: {
    instagram: '', // TODO: Add official Instagram link
    facebook: '', // TODO: Add official Facebook link
    twitter: '', // TODO: Add official X/Twitter link
    linkedin: '', // TODO: Add official LinkedIn link
  },

  navigation: [
    { label: 'THE MANIFESTO', href: '#manifesto', num: '01' },
    { label: '3D ANATOMY OF CRAFT', href: '#anatomy', num: '02' },
    { label: 'COLLECTIONS', href: '#collection', num: '03' },
    { label: 'SERVICES', href: '#services', num: '04' },
  ] as const,

  logo: {
    path: '/brand/logo.png',
    svgPath: '/brand/logo.svg',
    alt: 'Logo',
    width: 854,
    height: 352,
  },

  model3d: {
    path: '/models/shoes-split.glb',
    title: "Men's Black Dress Shoes",
    author: 'CherilusUploads (Sketchfab)',
    modelUrl: 'https://sketchfab.com/3d-models/mens-black-dress-shoes-5a256faa6cf94de08482ba98565c2269',
    licenseName: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
    modificationNote: 'Modified: split into two pairs and rescaled.',
  },

  newsletter: {
    badge: 'NEWSLETTER',
    headline: 'Stay close to the craft.',
    description: 'New collections, bulk-order offers and updates from Yakason Global Best Venture. No spam.',
    placeholder: 'Your email address',
    buttonText: 'SUBSCRIBE',
    subscribingText: 'SUBSCRIBING...',
    successMessage: "You're on the list. Thank you.",
    errorMessage: 'Please enter a valid email address.',
    privacyNote: 'We respect your inbox. Unsubscribe anytime.',
  },

  seo: {
    title: 'Yakason Shoes | Quality Express in Footwears · Since 2005',
    description: 'Bespoke corporate shoes, handcrafted school wear, and tactical safety boots made with pride in Lagos, Nigeria. CAC (RC 9908327) & SON Registered.',
    keywords: [
      'Yakason Shoes',
      'Nigerian handmade shoes',
      'Corporate Oxford',
      'Bespoke shoes Lagos',
      'School shoes bulk Nigeria',
      'Military Boots Lagos',
    ] as const,
    openGraph: {
      title: 'Yakason Shoes | Handcrafted Footwear Since 2005',
      description: 'Quality Express in Footwears. Cut, closed, lasted and finished by trained hands in Lagos.',
      images: ['/brand/logo.png'] as const,
    },
  },

  footer: {
    brandDescription: 'Quality Express in Footwears. Handcrafted in Lagos, Nigeria since 2005. Supplying corporate executives, schools, and paramilitary institutions with durable Nigerian excellence.',
    copyright: '© 2005 – 2026 Yakason Global Best Venture. All rights reserved.',
    watermark: 'YAKASONSHOES · EST. 2005',
  },
} as const;

export type SiteConfig = typeof SITE;
