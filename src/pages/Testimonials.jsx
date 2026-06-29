import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import TestimonialCard from '../components/TestimonialCard'
import StarRating from '../components/StarRating'
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react'

const SERVICE_TYPES = [
  'Consultation',
  'Antenatal Care',
  'Prenatal Classes',
  'Postnatal Care',
  'Baby Care Classes',
]
const FILTERS = ['All', ...SERVICE_TYPES]

function TestimonialSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-gray-200 rounded w-28" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="w-3.5 h-3.5 rounded bg-gray-200" />)}
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  // Submission form state
  const [formName, setFormName] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formService, setFormService] = useState('Consultation')
  const [formRating, setFormRating] = useState(0)
  const [formReview, setFormReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function fetchTestimonials() {
    setLoading(true)
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    if (!error && data) setTestimonials(data)
    setLoading(false)
  }

  useEffect(() => {
    posthog.capture('testimonials_page_viewed')
    const timer = window.setTimeout(() => {
      fetchTestimonials()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    posthog.capture('testimonial_filter_changed', { filter: activeFilter })
  }, [activeFilter])

  const filtered =
    activeFilter === 'All'
      ? testimonials
      : testimonials.filter((t) => t.service_type === activeFilter)

  // Stats
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
      : '—'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!formName.trim() || !formCity.trim() || !formReview.trim()) {
      setSubmitError('Please fill in all required fields.')
      return
    }
    if (formRating === 0) {
      setSubmitError('Please select a star rating.')
      return
    }
    if (formReview.trim().length < 30) {
      setSubmitError('Your review must be at least 30 characters.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.from('testimonials').insert({
      patient_name: formName.trim(),
      city: formCity.trim(),
      rating: formRating,
      review_text: formReview.trim(),
      service_type: formService,
      approved: false,
    })

    if (error) {
      setSubmitError(error.message || 'Something went wrong. Please try again.')
    } else {
      posthog.capture('testimonial_submitted', { rating: formRating, service_type: formService })
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const resetForm = () => {
    setFormName(''); setFormCity(''); setFormService('Consultation')
    setFormRating(0); setFormReview(''); setSubmitted(false); setSubmitError('')
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page header */}
      <section className="bg-[#E1F5EE] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-[#52B788]" fill="#52B788" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#52B788]">
              Patient Stories
            </span>
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            What Our Patients Say
          </h1>
          <p className="mt-3 text-[#6B7280] text-base max-w-xl leading-relaxed">
            Real experiences from real mothers — every review is verified by our team.
          </p>

          {/* Stats row */}
          {!loading && testimonials.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-6">
              <div>
                <p className="text-2xl font-bold text-[#2D6A4F]">{avgRating} ★</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Average rating</p>
              </div>
              <div className="w-px bg-[#B7E4C7]" />
              <div>
                <p className="text-2xl font-bold text-[#2D6A4F]">{testimonials.length}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Verified reviews</p>
              </div>
              <div className="w-px bg-[#B7E4C7]" />
              <div>
                <p className="text-2xl font-bold text-[#2D6A4F]">100%</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Verified patients</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-[#FAFAF8] border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  activeFilter === f
                    ? 'bg-[#2D6A4F] text-white shadow-sm'
                    : 'bg-white text-[#6B7280] border border-gray-200 hover:border-[#52B788]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials grid */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <TestimonialSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center">
              <Star size={28} className="text-[#52B788]" />
            </div>
            <p className="text-[#1A1A2E] font-semibold text-lg">No reviews in this category yet</p>
            <button onClick={() => setActiveFilter('All')} className="text-[#2D6A4F] text-sm font-medium underline underline-offset-2">
              View all reviews
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </div>
        )}
      </main>

      {/* Submit review form */}
      <section className="bg-white py-14 border-t border-gray-100">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquarePlus size={18} className="text-[#52B788]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#52B788]">Share Your Story</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-1">
            Share Your Experience
          </h2>
          <p className="text-[#6B7280] text-sm mb-7">
            Your review helps other mothers find the right care. All reviews are verified before publishing.
          </p>

          {submitted ? (
            <div className="bg-[#E1F5EE] rounded-2xl p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#2D6A4F] flex items-center justify-center">
                <CheckCircle size={32} className="text-white" />
              </div>
              <div>
                <p className="font-['Playfair_Display'] text-xl font-bold text-[#1A1A2E]">Thank you for your review!</p>
                <p className="text-sm text-[#374151] mt-2 leading-relaxed">
                  Your experience will appear here once verified by Dr. Zainab&apos;s team — usually within 24 hours.
                </p>
              </div>
              <button
                onClick={resetForm}
                className="text-[#2D6A4F] text-sm font-semibold underline underline-offset-2 mt-1"
              >
                Submit another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#FAFAF8] rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ayesha Malik"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] bg-white outline-none focus:border-[#52B788] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Rawalpindi"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] bg-white outline-none focus:border-[#52B788] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Service Received</label>
                <select
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] bg-white outline-none focus:border-[#52B788] transition-colors appearance-none"
                >
                  {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A2E] mb-2">
                  Your Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <StarRating rating={formRating} size={24} interactive onRate={setFormRating} />
                  {formRating === 0 && (
                    <span className="text-xs text-[#6B7280]">Tap to rate</span>
                  )}
                  {formRating > 0 && (
                    <span className="text-xs text-[#2D6A4F] font-medium">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][formRating]}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5 flex items-center justify-between">
                  <span>Your Review <span className="text-red-400">*</span></span>
                  <span className={`font-normal ${formReview.length < 30 && formReview.length > 0 ? 'text-red-400' : 'text-[#6B7280]'}`}>
                    {formReview.length} characters
                  </span>
                </label>
                <textarea
                  rows={5}
                  value={formReview}
                  onChange={(e) => setFormReview(e.target.value)}
                  placeholder="Share your experience with Dr. Zainab — how did it help you? (minimum 30 characters)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A2E] bg-white outline-none focus:border-[#52B788] transition-colors resize-none"
                />
              </div>

              {submitError && (
                <p className="text-red-500 text-xs">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#2D6A4F] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#245c43] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
