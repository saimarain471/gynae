import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, PlayCircle, ShieldCheck, Smartphone,
  ChevronRight, Baby, Heart, Star, MessageCircle,
} from 'lucide-react'
import ClassCard from '../components/ClassCard'
import { classes as fallbackClasses } from '../data/classes'
import { posthog } from '../lib/posthog'
import GynaeBackground from '../components/GynaeBackground'
import { supabase } from '../lib/supabase'

const filters = ['All', 'Prenatal', 'Postnatal', 'Baby Care']

export default function Classes() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [liveClasses, setLiveClasses] = useState([])

  useEffect(() => {
    let isMounted = true

    async function fetchClasses() {
      try {
        const { data, error } = await supabase.from('classes').select('*').eq('visible', true).order('created_at', { ascending: false })
        if (!isMounted) return
        if (!error && data) {
          const mapped = data.map((item) => ({
            ...item,
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            duration: item.duration,
            lessons: item.modules || item.lessons || 1,
            price: item.price,
            priceLabel: `PKR ${Number(item.price || 0).toLocaleString()}`,
            image: item.thumbnail_url || null,
          }))
          setLiveClasses(mapped)
        } else {
          setLiveClasses([])
        }
      } catch (error) {
        if (!isMounted) return
        setLiveClasses([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchClasses()
    const timer = setTimeout(() => {
      if (isMounted) setLoading(false)
    }, 800)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  const classes = useMemo(() => {
    if (liveClasses.length > 0) return liveClasses
    return fallbackClasses
  }, [liveClasses])

  const filteredClasses = useMemo(() => {
    if (activeFilter === 'All') return classes
    return classes.filter((item) => item.category === activeFilter)
  }, [activeFilter, classes])

  const handleFilter = (value) => {
    setActiveFilter(value)
    posthog.capture('class_filter_used', { filter: value })
  }

  const counts = useMemo(() => ({
    All: classes.length,
    Prenatal: classes.filter((item) => item.category === 'Prenatal').length,
    Postnatal: classes.filter((item) => item.category === 'Postnatal').length,
    'Baby Care': classes.filter((item) => item.category === 'Baby Care').length,
  }), [classes])

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAFAF8] via-[#E1F5EE] to-[#FAFAF8] py-16 md:py-20">
        <GynaeBackground variant="classes" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#2D6A4F] px-4 py-2 text-xs font-semibold text-white">
              <BookOpen size={13} />
              Online Classes by Dr. Zainab Mohsin
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl font-bold leading-tight text-[#1A1A2E] md:text-5xl">
              Learn. Prepare. Thrive.
            </h1>
            <p className="mt-2 text-xl font-medium text-[#2D6A4F] md:text-2xl">Pregnancy & Baby Care Classes</p>
            <p className="mx-auto mt-3 max-w-2xl text-base text-[#6B7280]">
              Expert-led online classes covering every stage — from first trimester to your baby's first year. Available across Pakistan.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                { icon: PlayCircle, label: 'Watch at your own pace' },
                { icon: ShieldCheck, label: 'Doctor-verified content' },
                { icon: Smartphone, label: 'Works on mobile' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="inline-flex items-center gap-2 rounded-full border border-[#52B788]/30 bg-white px-4 py-2 text-sm font-medium text-[#2D6A4F] shadow-sm">
                    <Icon size={14} />
                    {item.label}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-10 border-b border-gray-100 bg-white py-0">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 scrollbar-hide sm:px-6 lg:px-8">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilter(filter)}
              className={`whitespace-nowrap rounded-xl px-5 py-2 text-sm font-medium transition-colors ${activeFilter === filter ? 'border-b-2 border-[#2D6A4F] bg-[#2D6A4F] text-white' : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E1F5EE] hover:text-[#2D6A4F]'}`}
            >
              {filter} ({counts[filter]})
            </button>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <GynaeBackground variant="classes" />
        <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array(6).fill(0).map((_, i) => <ClassCard key={i} loading={true} />)
            : filteredClasses.map((classData, index) => (
                <motion.div
                  key={classData.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <ClassCard classData={classData} />
                </motion.div>
              ))}
        </div>

        {!loading && filteredClasses.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <BookOpen size={32} className="mx-auto text-[#2D6A4F]" />
            <p className="mt-3 text-lg font-semibold text-[#1A1A2E]">No classes in this category yet</p>
            <p className="mt-1 text-sm text-[#6B7280]">Try another filter to explore more classes.</p>
          </div>
        )}
      </section>

      <section className="bg-[#E1F5EE] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="text-center">
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A2E]">Why mothers choose Dr. Zainab's classes</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: 'Doctor-verified', desc: 'Every word is backed by 10+ years of clinical experience' },
              { icon: PlayCircle, title: 'Learn at your pace', desc: 'Watch, pause, rewatch — on your phone, anytime' },
              { icon: MessageCircle, title: 'WhatsApp support', desc: 'Questions after class? Dr. Zainab is just a message away' },
              { icon: Heart, title: 'Made for Pakistani moms', desc: 'In simple language, addressing real concerns you face' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.08 }} className="rounded-2xl border border-[#52B788]/20 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E1F5EE]">
                    <Icon size={20} className="text-[#2D6A4F]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1A1A2E]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#6B7280]">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-[#1A1A2E]">Simple, transparent pricing. No hidden fees.</h2>
          <p className="mt-2 text-base text-[#6B7280]">Pay once per class. Lifetime access. Cancel nothing.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['JazzCash', 'EasyPaisa', 'HBL Bank Transfer'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-[#F9FAFB] px-5 py-3 text-sm font-medium text-[#6B7280]">
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#6B7280]">Payment verified manually by Dr. Zainab's team via WhatsApp</p>
          <p className="text-sm text-[#6B7280]">Access link sent to your WhatsApp within a few hours</p>
          <Link to="/booking" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F4A261] px-8 py-3.5 font-semibold text-white transition hover:bg-[#e8894a]">
            Have questions? Book a free 5-min call first
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
