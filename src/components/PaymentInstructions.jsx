import { useState } from 'react'
import { Smartphone, Wallet, Landmark, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { posthog } from '../lib/posthog'

const paymentOptions = [
  {
    method: 'JazzCash',
    value: '0300-0000000',
    details: 'Zainab Mohsin',
    iconBg: '#E8F5E9',
    iconColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  {
    method: 'EasyPaisa',
    value: '0301-0000000',
    details: 'Zainab Mohsin',
    iconBg: '#E3F2FD',
    iconColor: '#1565C0',
    borderColor: '#2563EB',
  },
  {
    method: 'Bank Transfer',
    value: '1234-5678-9012-3456',
    details: 'Dr. Zainab Mohsin',
    subtitle: 'IBAN: PK00HABB0000001234567890',
    branch: 'Rawalpindi Main Branch',
    iconBg: '#FFF3E8',
    iconColor: '#E65100',
    borderColor: '#EA580C',
  },
]

export default function PaymentInstructions() {
  const [copied, setCopied] = useState('')
  const [open, setOpen] = useState(false)

  const handleCopy = async (method, value) => {
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(method)
      posthog.capture('account_number_copied', { method: method.toLowerCase().replace(' ', '_') })
      window.setTimeout(() => setCopied(''), 2000)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="rounded-[2rem] border border-[#F4A261]/20 bg-[#FAFAF8] p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#1A1A2E]">Send payment to any of these accounts</p>
        <p className="mt-1 text-xs text-[#6B7280]">After sending, enter your Transaction ID in the form below</p>
      </div>

      <div className="flex flex-col gap-3">
        {paymentOptions.map((option) => {
          const Icon = option.method === 'JazzCash' ? Smartphone : option.method === 'EasyPaisa' ? Wallet : Landmark

          return (
            <div key={option.method} className={`rounded-2xl border border-gray-100 bg-white p-4 shadow-sm ${option.borderColor ? 'border-l-4' : ''}`} style={{ borderLeftColor: option.borderColor }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: option.iconBg, color: option.iconColor }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">{option.method}</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">Tap to copy</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-base font-semibold text-[#1A1A2E]">{option.value}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{option.details}</p>
              {option.subtitle && <p className="mt-1 text-xs text-[#6B7280]">{option.subtitle}</p>}
              {option.branch && <p className="mt-1 text-xs text-[#6B7280]">Branch: {option.branch}</p>}
              <button
                type="button"
                onClick={() => handleCopy(option.method, option.value)}
                className="mt-3 w-full rounded-xl border border-[#52B788]/30 py-2 text-sm font-medium text-[#2D6A4F] transition hover:bg-[#E1F5EE]"
              >
                {copied === option.method ? '✓ Copied!' : <span className="inline-flex items-center justify-center gap-2"><Copy size={14} /> Tap to copy</span>}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between text-sm text-[#6B7280]">
          <span>Which method is fastest?</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {open && (
          <div className="mt-3 space-y-1 text-xs text-[#6B7280]">
            <p>JazzCash — fastest, usually verified within 1 hour</p>
            <p>EasyPaisa — fast, verified within 1-2 hours</p>
            <p>Bank Transfer — verified within a few hours (business hours only)</p>
          </div>
        )}
      </div>
    </section>
  )
}
