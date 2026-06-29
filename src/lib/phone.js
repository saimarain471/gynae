// Phone number helpers for Pakistani numbers.

// Converts a phone number into the international format that wa.me expects
// (digits only, no leading 0, with the 92 country code).
// Examples:
//   "0300-1234567" -> "923001234567"
//   "03001234567"  -> "923001234567"
//   "+92 300 1234567" -> "923001234567"
//   "923001234567" -> "923001234567"
export function toWhatsAppNumber(raw) {
  if (!raw) return ''
  const digits = String(raw).replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('92')) return digits
  if (digits.startsWith('0')) return '92' + digits.slice(1)
  // Bare local number without the leading 0 (e.g. 3001234567)
  if (digits.length === 10) return '92' + digits
  return digits
}
