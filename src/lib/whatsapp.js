const DEFAULT_WHATSAPP_NUMBER = '923314896544'

export function getWhatsAppNumber() {
  const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
  const digits = rawNumber.replace(/\D/g, '')

  if (digits.startsWith('00')) return digits.slice(2)
  if (digits.startsWith('0')) return `92${digits.slice(1)}`
  return digits
}

export function buildWhatsAppUrl(message = '') {
  const number = getWhatsAppNumber()
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${query}`
}
