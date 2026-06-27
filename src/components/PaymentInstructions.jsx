import { useState } from 'react'
import { Clipboard, Info } from 'lucide-react'
import { posthog } from '../lib/posthog'

const paymentOptions = [
  {
    method: 'JazzCash',
    label: 'Account Number',
    value: '0300-0000000',
    name: 'Account Name',
    details: 'Zainab Mohsin',
  },
  {
    method: 'EasyPaisa',
    label: 'Account Number',
    value: '0301-0000000',
    name: 'Account Name',
    details: 'Zainab Mohsin',
  },
  {
    method: 'Bank Transfer',
    label: 'Account Number',
    value: '1234-5678-9012-3456',
    name: 'Account Title',
    details: 'Dr. Zainab Mohsin',
    subtitle: 'IBAN: PK00HABB0000001234567890',
    branch: 'Rawalpindi Main Branch',
  },
]

export default function PaymentInstructions() {
  const [copied, setCopied] = useState('')

  const handleCopy = async (method, value) => {
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(method)
      posthog.capture('account_number_copied', { method: method.toLowerCase().replace(' ', '_') })
      window.setTimeout(() => setCopied(''), 1800)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="rounded-3xl border border-[#FEF3C7] bg-[#FEF3C7] p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3 text-text">
        <Info className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-text">Payment Instructions</h2>
          <p className="text-sm text-text-muted">Send payment manually, then enter your transaction ID below.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {paymentOptions.map((option) => (
          <div key={option.method} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text">{option.method}</p>
                <p className="mt-1 text-sm text-text-muted">{option.label}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(option.method, option.value)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-secondary transition hover:bg-secondary/20"
              >
                <Clipboard className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-base font-semibold text-text">{option.value}</p>
            <p className="text-sm text-text-muted">{option.details}</p>
            {option.subtitle && <p className="mt-1 text-sm text-text-muted">{option.subtitle}</p>}
            {option.branch && <p className="mt-1 text-sm text-text-muted">Branch: {option.branch}</p>}
            {copied === option.method && <p className="mt-3 text-sm text-secondary">Copied!</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
