// Shared constants used across booking pages and payment components

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '03314896544'

export const PAYMENT_ACCOUNTS = {
  JazzCash: { label: 'JazzCash', number: '0300-0000000', holder: 'Zainab Mohsin' },
  EasyPaisa: { label: 'EasyPaisa', number: '0301-0000000', holder: 'Zainab Mohsin' },
  'Bank Transfer': { label: 'HBL Bank', number: 'PK00HABB0000001234567890', holder: 'Dr. Zainab Mohsin' },
}

export const PAYMENT_INFO_MAP = Object.fromEntries(
  Object.entries(PAYMENT_ACCOUNTS).map(([key, { label, number, holder }]) => [
    key,
    `${label}: ${number} (${holder})`,
  ])
)

export const PAYMENT_METHODS = ['JazzCash', 'EasyPaisa', 'Bank Transfer']

export const TIME_SLOTS = [
  'Morning (9 AM – 12 PM)',
  'Afternoon (12 PM – 3 PM)',
  'Evening (4 PM – 7 PM)',
]
