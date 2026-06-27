import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { posthog } from '../lib/posthog'

export default function HeroSection() {
  const handleCta = (button) => {
    posthog.capture('hero_cta_clicked', { button })
  }

  return (
    <section className="overflow-hidden rounded-[3rem] bg-hero p-8 sm:p-12 lg:p-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Consultant gynecologist</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-text md:text-5xl lg:text-6xl">
            Dr. Zainab Mohsin
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-text-muted">
            Consultant Gynecologist & Women&apos;s Health Educator empowering mothers with knowledge — before and after birth.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/classes"
              onClick={() => handleCta('browse_classes')}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43]"
            >
              Browse Classes
            </Link>
            <Link
              to="/booking"
              onClick={() => handleCta('book_consultation')}
              className="inline-flex items-center justify-center rounded-full border border-primary bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-slate-50"
            >
              Book a Consultation
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-[2rem] border border-slate-200 bg-green-100 p-10 text-text"
        >
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-52 w-full items-center justify-center rounded-[1.5rem] bg-white text-2xl font-semibold text-primary">
              Dr. Zainab Photo
            </div>
            <p className="text-sm leading-6 text-text-muted">
              Trusted online care for expecting moms, postpartum families, and newborn support.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
