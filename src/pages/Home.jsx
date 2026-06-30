import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import HeroSection from '../components/HeroSection'
import ClassCard from '../components/ClassCard'
import TestimonialCard from '../components/TestimonialCard'
import FAQAccordion from '../components/FAQAccordion'
import { classes as fallbackClasses } from '../data/classes'
import { supabase } from '../lib/supabase'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { Star, HelpCircle, ArrowRight } from 'lucide-react'

const stats = [
  { label: 'Mothers Trained', value: '500+' },
  { label: 'Years Experience', value: '10+' },
  { label: 'Average Rating', value: '4.9★' },
]

export default function Home() {
  const { settings } = useSiteSettings()
  const [featuredTestimonials, setFeaturedTestimonials] = useState([])
  const [topFaqs, setTopFaqs] = useState([])
  const [featuredClasses, setFeaturedClasses] = useState([])
  const [openFaqId, setOpenFaqId] = useState(null)
  const consultationFee = settings?.consultation_fee ?? 2000

  async function fetchFeaturedTestimonials() {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (data && data.length > 0) {
      setFeaturedTestimonials(data)
    } else {
      // Fallback: grab latest approved (not necessarily featured)
      const { data: fallback } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(3)
      setFeaturedTestimonials(fallback || [])
    }
  }

  async function fetchTopFaqs() {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .limit(5)
    setTopFaqs(data || [])
  }

  async function fetchFeaturedClasses() {
    const { data } = await supabase.from('classes').select('*').eq('visible', true).order('created_at', { ascending: false }).limit(3)
    if (data && data.length > 0) {
      setFeaturedClasses(data.map((item) => ({
        ...item,
        lessons: item.modules || item.lessons || 1,
        price: item.price,
        priceLabel: `PKR ${Number(item.price || 0).toLocaleString()}`,
      })))
    } else {
      setFeaturedClasses(fallbackClasses.slice(0, 3))
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchFeaturedTestimonials()
      fetchTopFaqs()
      fetchFeaturedClasses()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="space-y-16">
      <SEO
        title="Home"
        description="Online pregnancy classes, newborn care, and breastfeeding guidance by Dr. Zainab Mohsin. Book courses and consultations across Pakistan."
        url="https://gynae.vercel.app/"
      />
      <HeroSection />

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] bg-white px-6 py-10 shadow-sm md:grid-cols-3 md:px-10">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-3xl font-semibold text-text">{stat.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold text-text">Simple booking steps for every mom.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">
              Choose a class, complete the booking form, send payment via WhatsApp-approved channels, and receive your class access link on WhatsApp.
            </p>
          </div>
          <div className="grid gap-4">
            {['Choose a class', 'Fill the booking form', 'Send payment via JazzCash / EasyPaisa / Bank', 'Get class access on WhatsApp within a few hours'].map((step, index) => (
              <div key={step} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-primary">Step {index + 1}</p>
                <p className="mt-2 text-sm text-text-muted">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Classes */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Featured Classes</p>
            <h2 className="mt-3 text-3xl font-semibold text-text">Carefully designed for expecting and new mothers.</h2>
          </div>
          <Link to="/classes" className="text-sm font-semibold text-primary hover:text-secondary">
            View all classes
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featuredClasses.slice(0, 3).map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))}
        </div>
      </section>

      {/* Testimonials — from Supabase if available, else nothing */}
      {featuredTestimonials.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-[#E1F5EE] text-[#2D6A4F] text-xs font-semibold px-3 py-1 rounded-full">
                <Star size={12} fill="#2D6A4F" />
                Patient Stories
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#1A1A2E]">
                Trusted by Mothers Across Pakistan
              </h2>
              <Link to="/testimonials" className="flex items-center gap-1 text-sm font-semibold text-[#2D6A4F] hover:text-[#245c43] flex-shrink-0">
                Read all reviews <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {featuredTestimonials.map((t) => (
                <TestimonialCard key={t.id} {...t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ preview — from Supabase */}
      {topFaqs.length > 0 && (
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-[#E1F5EE] text-[#2D6A4F] text-xs font-semibold px-3 py-1 rounded-full">
                <HelpCircle size={12} />
                Common Questions
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#1A1A2E]">
                Common Questions
              </h2>
              <Link to="/faqs" className="flex items-center gap-1 text-sm font-semibold text-[#2D6A4F] hover:text-[#245c43] flex-shrink-0">
                See all questions <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-[#6B7280] text-sm mb-6">Quick answers to what most mothers ask first.</p>
            <div className="bg-[#FAFAF8] rounded-2xl border border-gray-100 px-5">
              {topFaqs.map((faq) => (
                <FAQAccordion
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaqId === faq.id}
                  onToggle={() => setOpenFaqId((prev) => (prev === faq.id ? null : faq.id))}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl rounded-[2rem] bg-primary/5 px-6 py-12 text-center shadow-sm lg:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Consultation</p>
        <h2 className="mt-4 text-3xl font-semibold text-text">Book a 1-on-1 with Dr. Zainub — PKR {consultationFee.toLocaleString()}</h2>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          Secure a private video consultation for pregnancy support, baby care, and women&apos;s health guidance.
        </p>
        <Link to="/booking" className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e99141]">
          Book Consultation
        </Link>
      </section>
    </main>
  )
}
