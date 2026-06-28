import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

export default function ThankYou() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
      <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-semibold text-text">Booking Received!</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          Thank you for your booking. Dr. Zainub will verify your payment and connect with you via WhatsApp soon.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '03314896544'}`} className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43]" target="_blank" rel="noreferrer">
            Confirm on WhatsApp
          </a>
          <Link to="/" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-text transition hover:bg-slate-50">
            Go Home
          </Link>
          <Link to="/classes" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-text transition hover:bg-slate-50">
            Browse More Classes
          </Link>
        </div>
      </div>
    </main>
  )
}
