import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap, Award, Clock, Users, Star, Heart,
  Activity, Briefcase, Baby, Droplets, TrendingUp,
  BookOpen, Video, MessageCircle, CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import GynaeBackground from '../components/GynaeBackground'
import SEO from '../components/SEO'

export default function About() {
  const [imgError, setImgError] = useState(false)

  return (
    <>
      <SEO
        title="About Dr. Zainab Mohsin"
        description="Meet Dr. Zainab Mohsin — gynecologist offering pregnancy classes, newborn care, and consultations across Pakistan."
        url="https://gynae.vercel.app/about"
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a3d2e] via-[#2D6A4F] to-[#52B788] py-20 md:py-28">
        <GynaeBackground variant="default" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white">
              <Activity size={13} />
              Meet Your Doctor
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl font-bold leading-tight text-white md:text-5xl">
              About Dr. Zainab
              <span className="block text-[#86efac]">Mohsin</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
              A passionate gynecologist dedicated to empowering women with knowledge — from the first trimester to the first steps of motherhood.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {[
                { icon: GraduationCap, title: 'MBBS', subtitle: 'Bachelor of Medicine & Surgery' },
                { icon: Award, title: 'FCPS', subtitle: 'Gynecology & Obstetrics' },
                { icon: Clock, title: '10+ Years', subtitle: 'Clinical Experience' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-white/60">{item.subtitle}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative mx-auto w-64 md:w-72"
          >
            <div className="relative h-80 overflow-hidden rounded-[2rem] border-4 border-white/30 shadow-2xl md:h-96">
              {!imgError ? (
                <img src="/dr-zainab.jpg" alt="Dr. Zainab Mohsin" className="h-full w-full object-cover object-top" onError={() => setImgError(true)} />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#E1F5EE] to-[#B7E4C7] text-center">
                  <span className="font-['Playfair_Display'] text-5xl font-bold text-[#2D6A4F]">ZM</span>
                  <p className="mt-2 text-sm font-medium text-[#2D6A4F]">Dr. Zainab Mohsin</p>
                </div>
              )}
            </div>
            <div className="absolute -left-6 top-8 flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2.5 shadow-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E1F5EE]">
                <Award size={15} className="text-[#2D6A4F]" />
              </div>
              <span className="text-xs font-semibold text-[#1A1A2E]">FCPS Gynecology</span>
            </div>
            <div className="absolute -right-6 bottom-12 flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2.5 shadow-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF3E8]">
                <Star size={15} className="fill-[#F4A261] text-[#F4A261]" />
              </div>
              <span className="text-xs font-semibold text-[#1A1A2E]">4.9 Rated</span>
            </div>
            <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-[#2D6A4F] px-3 py-2 shadow-lg">
              <Users size={14} className="text-white" />
              <span className="text-xs font-semibold text-white">500+ Mothers</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 md:grid-cols-4 md:gap-0 md:divide-x md:divide-gray-100">
          {[
            { value: '500+', label: 'Mothers Educated' },
            { value: '10+', label: 'Years Experience' },
            { value: '6', label: 'Online Classes' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="flex flex-col items-center px-4 text-center"
            >
              <span className={`text-4xl font-bold ${index === 3 ? 'text-[#F4A261]' : 'text-[#2D6A4F]'}`}>{stat.value}</span>
              <span className="mt-1 text-sm text-[#6B7280]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <GynaeBackground variant="default" />
        <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-[#52B788]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#52B788]">Her Story</span>
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A2E]">Why I Started Teaching Online</h2>
            <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-[#6B7280]">
              <p>After years of seeing patients struggle with misinformation about pregnancy and childbirth, I realized that education was the most powerful medicine I could offer. Many women in Pakistan have limited access to reliable, doctor-led guidance during one of the most important journeys of their lives.</p>
              <p>I started these online classes to bridge that gap — to bring hospital-quality knowledge directly to mothers in their homes, in a language they understand, at a price that doesn't feel like a burden. Every mother deserves to enter labour prepared and confident, not anxious and alone.</p>
              <p>My goal is simple: to make you feel supported, informed, and empowered — whether you're expecting your first child or your fourth.</p>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-0.5 w-12 bg-[#52B788]" />
              <p className="font-['Playfair_Display'] text-lg font-semibold italic text-[#2D6A4F]">Dr. Zainab Mohsin, MBBS, FCPS</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-[#52B788]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#52B788]">Qualifications</span>
            </div>
            <div className="flex flex-col">
              {[
                { icon: GraduationCap, year: '2008–2013', title: 'MBBS', subtitle: 'Rawalpindi Medical College' },
                { icon: Award, year: '2013–2017', title: 'FCPS — Gynecology & Obstetrics', subtitle: 'College of Physicians & Surgeons Pakistan' },
                { icon: Briefcase, year: '2017–2021', title: 'Senior Registrar', subtitle: 'PIMS Hospital, Islamabad' },
                { icon: Star, year: '2021–Present', title: 'Consultant Gynecologist', subtitle: 'Private Practice, Rawalpindi' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1F5EE]">
                        <Icon size={18} className="text-[#2D6A4F]" />
                      </div>
                      {index < 3 && <div className="mt-2 h-8 w-0.5 bg-gradient-to-b from-[#52B788] to-transparent" />}
                    </div>
                    <div className="pb-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#52B788]">{item.year}</p>
                      <p className="mt-1 text-base font-semibold text-[#1A1A2E]">{item.title}</p>
                      <p className="mt-1 text-sm text-[#6B7280]">{item.subtitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#E1F5EE] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="text-center">
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A2E]">What You'll Learn</h2>
            <p className="mx-auto mt-2 max-w-xl text-base text-[#6B7280]">Dr. Zainab covers the complete journey — from the first trimester to your baby's first year.</p>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Baby, title: 'Prenatal Care', desc: 'Week by week pregnancy guide, nutrition, dos and donts, and when to call your doctor', tag: 'Prenatal', tagClass: 'bg-[#E1F5EE] text-[#2D6A4F]', iconBg: 'bg-[#E1F5EE]' },
              { icon: Heart, title: 'Safe Delivery', desc: 'Normal vs C-section preparation, pain management, hospital bag, what to expect in labour', tag: 'Delivery', tagClass: 'bg-[#FEE2E2] text-red-600', iconBg: 'bg-[#FEE2E2]' },
              { icon: Star, title: 'Newborn Care', desc: 'Bathing, feeding, holding, cord care, diaper changes, and sleep schedules for newborns', tag: 'Baby Care', tagClass: 'bg-[#FFF3E8] text-[#F4A261]', iconBg: 'bg-[#FFF3E8]' },
              { icon: Droplets, title: 'Breastfeeding', desc: 'Proper latch technique, milk supply, pumping, common problems and how to solve them', tag: 'Postnatal', tagClass: 'bg-[#EFF6FF] text-blue-600', iconBg: 'bg-[#EFF6FF]' },
              { icon: Activity, title: 'Postpartum Recovery', desc: 'Physical healing, mental health, postpartum depression awareness, and nutrition', tag: 'Postnatal', tagClass: 'bg-[#F0FDF4] text-green-600', iconBg: 'bg-[#F0FDF4]' },
              { icon: TrendingUp, title: 'Baby Growth & Milestones', desc: '0–12 month development, vaccination schedule, warning signs, and what is normal', tag: 'Baby Care', tagClass: 'bg-[#FAF5FF] text-purple-600', iconBg: 'bg-[#FAF5FF]' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="rounded-2xl border border-[#52B788]/20 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}>
                    <Icon size={20} className="text-[#2D6A4F]" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#1A1A2E]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{item.desc}</p>
                  <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${item.tagClass}`}>{item.tag}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#2D6A4F] to-[#52B788] py-16">
        <GynaeBackground variant="default" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="select-none text-[120px] font-serif leading-none text-white/10">“</div>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="font-['Playfair_Display'] text-2xl font-medium leading-relaxed italic text-white md:text-3xl">
            Every mother deserves to be informed, empowered, and supported. That is not a privilege — it is a right.
          </motion.p>
          <p className="mt-4 text-sm text-white/70">— Dr. Zainab Mohsin, Consultant Gynecologist</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/classes" className="rounded-xl bg-white px-8 py-3.5 font-semibold text-[#2D6A4F] transition hover:bg-gray-50">Browse Classes →</Link>
            <Link to="/booking" className="rounded-xl border border-white/30 bg-white/15 px-8 py-3.5 font-semibold text-white transition hover:bg-white/25">Book a Consultation</Link>
          </div>
        </div>
      </section>
    </>
  )
}
