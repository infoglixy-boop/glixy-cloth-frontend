/** WhatsApp chat for Glixy. Every link opens with a ready-made message so the team knows where it came from. */
export const WA_PHONE = '919734632596'

export const WA_DEFAULT =
  'Hi Glixy Labs! 👋 I found you on your website and would like to know more about Glixy SLM and your virtual desktops. Could we talk?'

export const waLink = (text: string = WA_DEFAULT) =>
  `https://api.whatsapp.com/send/?phone=${WA_PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`

/** Message for a specific machine, e.g. from a server card or the rack detail sheet. */
export const waServer = (name: string, price: string) =>
  waLink(`Hi Glixy Labs! 👋 I found you on your website and I'm interested in the ${name} server (${price}/mo). Could we talk?`)
