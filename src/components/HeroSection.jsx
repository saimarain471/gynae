import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Star, Users, Award, Clock, ChevronRight, GraduationCap } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

function useCounter(target, duration = 1800, startOnView = true) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(!startOnView)
  const ref = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!startOnView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [startOnView])

  useEffect(() => {
    if (!started) return
    let current = 0
    const step = target / (duration / 16)

    intervalRef.current = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(intervalRef.current)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [started, target, duration])

  return { count, ref }
}

function CredentialPill({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#52B788]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#2D6A4F] shadow-sm">
      <Icon size={13} className="flex-shrink-0 text-[#52B788]" />
      {text}
    </div>
  )
}

function StatCard({ icon: Icon, target, suffix, label, delay }) {
  const { count, ref } = useCounter(target)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center px-4 py-3 text-center"
    >
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#E1F5EE]">
        <Icon size={18} className="text-[#2D6A4F]" />
      </div>
      <span className="text-2xl font-bold leading-none text-[#1A1A2E] tabular-nums">
        {count}{suffix}
      </span>
      <span className="mt-1 text-xs leading-snug text-[#6B7280]">{label}</span>
    </motion.div>
  )
}

export default function HeroSection() {
  const { settings } = useSiteSettings()
  const [imgError, setImgError] = useState(false)
  const consultationFee = settings?.consultation_fee ?? 2000

  return (
    <section className="relative overflow-hidden bg-[#FAFAF8] pb-12 pt-16 md:pb-16 md:pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#E1F5EE] opacity-50" />
        <div className="absolute -left-32 top-1/2 h-64 w-64 rounded-full bg-[#E1F5EE] opacity-30" />
        <div className="absolute bottom-0 right-1/3 h-48 w-48 rounded-full bg-[#F4A261]/10 opacity-60" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 flex items-center gap-2"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E1F5EE] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#2D6A4F]">
                <ShieldCheck size={13} />
                Verified Gynecologist
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                <Star size={12} className="fill-[#F4A261] text-[#F4A261]" />
                <Star size={12} className="fill-[#F4A261] text-[#F4A261]" />
                <Star size={12} className="fill-[#F4A261] text-[#F4A261]" />
                <Star size={12} className="fill-[#F4A261] text-[#F4A261]" />
                <Star size={12} className="fill-[#F4A261] text-[#F4A261]" />
                <span className="ml-1 font-medium text-[#1A1A2E]">4.9</span>
              </span>
            </motion.div>

            <h1 className="mb-3 font-['Playfair_Display'] text-4xl font-bold leading-tight text-[#1A1A2E] md:text-5xl">
              Dr. Zainab{' '}
              <span className="text-[#2D6A4F]">Mohsin</span>
            </h1>

            <p className="mb-4 text-lg font-medium text-[#2D6A4F] md:text-xl">
              Consultant Gynecologist &amp; Women&apos;s Health Educator
            </p>

            <p className="mb-6 max-w-md text-base leading-relaxed text-[#6B7280]">
              Learn everything about pregnancy, safe delivery, and newborn care — guided by a specialist you can trust, from the comfort of home.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mb-8 flex flex-wrap gap-2"
            >
              <CredentialPill icon={GraduationCap} text="MBBS" />
              <CredentialPill icon={Award} text="FCPS — Gynecology &amp; Obstetrics" />
              <CredentialPill icon={Clock} text="10+ Years Experience" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <Link
                to="/classes"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2D6A4F] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#245c43]"
              >
                Browse classes
                <ChevronRight size={16} />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#52B788]/40 bg-white px-6 py-3.5 text-sm font-semibold text-[#2D6A4F] transition-all duration-200 hover:border-[#F4A261] hover:bg-[#F4A261]/10"
              >
                Book consultation — PKR {consultationFee.toLocaleString()}
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 flex items-center gap-2 text-xs text-[#6B7280]"
            >
              <Users size={13} className="text-[#52B788]" />
              Joined by <span className="font-semibold text-[#2D6A4F]">500+ mothers</span> from across Pakistan
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative h-80 w-72 md:h-96 md:w-80">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-[#52B788]/20 bg-[#E1F5EE]">
                {!imgError ? (
                  <img
                    src="/dr-zainab.jpg"
                    alt="Dr. Zainab Mohsin — Consultant Gynecologist"
                    className="h-full w-full object-cover object-top"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-[#E1F5EE]">
                    <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#2D6A4F]/10">
                      <span className="text-2xl font-bold text-[#2D6A4F] font-['Playfair_Display']">ZM</span>
                    </div>
                    <p className="text-sm font-semibold text-[#2D6A4F]">Dr. Zainab Mohsin</p>
                    <p className="mt-1 text-xs text-[#374151]">Photo coming soon</p>
                  </div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute -left-6 top-8 flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-3 py-2.5 shadow-md"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#E1F5EE]">
                  <Award size={16} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-[10px] leading-none text-[#6B7280]">Qualification</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#1A1A2E]">FCPS Gynecology</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, duration: 0.4 }}
                className="absolute -right-6 bottom-12 flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-3 py-2.5 shadow-md"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFF3E8]">
                  <Star size={16} className="fill-[#F4A261] text-[#F4A261]" />
                </div>
                <div>
                  <p className="text-[10px] leading-none text-[#6B7280]">Patient rating</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#1A1A2E]">4.9 / 5.0</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="absolute -left-4 bottom-6 flex items-center gap-2 rounded-2xl bg-[#2D6A4F] px-3 py-2.5 shadow-md"
              >
                <Users size={14} className="text-white" />
                <p className="text-xs font-semibold text-white">500+ mothers</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-14 grid grid-cols-2 divide-x divide-[#52B788]/15 overflow-hidden rounded-2xl border border-[#52B788]/20 bg-white md:grid-cols-4"
        >
          <StatCard icon={Users} target={500} suffix="+" label="Mothers trained" delay={0.6} />
          <StatCard icon={Clock} target={10} suffix="+" label="Years of experience" delay={0.7} />
          <StatCard icon={GraduationCap} target={6} suffix="" label="Online classes" delay={0.8} />
          <StatCard icon={Star} target={4.9} suffix="" label="Average rating" delay={0.9} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          <span className="text-xs text-[#6B7280]">Secure payments via</span>
          {['JazzCash', 'EasyPaisa', 'HBL Bank Transfer'].map((method) => (
            <span
              key={method}
              className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-[#6B7280]"
            >
              {method}
            </span>
          ))}
          <span className="text-xs text-[#6B7280]">· Verified on WhatsApp</span>
        </motion.div>
      </div>
    </section>
  )
}
