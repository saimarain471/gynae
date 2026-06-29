import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, HelpCircle, ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import FAQAccordion from '../components/FAQAccordion'

const CATEGORIES = ['All', 'Appointments', 'Pregnancy', 'Baby Care', 'Postnatal', 'General']

function highlight(text, query) {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-[#B7E4C7] rounded px-0.5 not-italic">{part}</mark>
      : part
  )
}

export default function FAQs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  // Debounced PostHog search tracking
  useEffect(() => {
    if (!searchQuery) return
    const timer = setTimeout(() => {
      posthog.capture('faq_searched', { query: searchQuery })
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    posthog.capture('faqs_page_viewed')
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('faqs')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    if (fetchError) {
      console.error('Failed to fetch FAQs:', fetchError)
      setError('Unable to load FAQs. Please try again later.')
    } else {
      setFaqs(data || [])
    }
    setLoading(false)
  }

  // Filter logic
  const filtered = faqs.filter((f) => {
    const matchesSearch =
      !searchQuery.trim() ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      searchQuery.trim() || activeCategory === 'All' || f.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Group by category (when not searching, respect category filter)
  const grouped = {}
  filtered.forEach((f) => {
    const cat = searchQuery.trim() ? f.category : (activeCategory === 'All' ? f.category : activeCategory)
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(f)
  })

  const handleToggle = (id) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page header */}
      <section className="bg-[#E1F5EE] py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle size={16} className="text-[#52B788]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#52B788]">
              Help Centre
            </span>
          </div>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-[#6B7280] text-base max-w-xl mx-auto leading-relaxed">
            Answers to common questions about pregnancy, baby care, and women&apos;s health
          </p>

          {/* Search bar */}
          <div className="relative mt-7 max-w-md mx-auto">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              id="faq-search"
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpenId(null) }}
              placeholder="Search questions…"
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-[#1A1A2E] bg-white outline-none focus:border-[#52B788] transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A2E] text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category filter */}
      {!searchQuery && (
        <div className="sticky top-16 z-30 bg-[#FAFAF8] border-b border-gray-100 shadow-sm">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenId(null) }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#2D6A4F] text-white shadow-sm'
                      : 'bg-white text-[#6B7280] border border-gray-200 hover:border-[#52B788]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full mt-3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <p className="text-red-600 font-semibold text-lg">{error}</p>
            <button
              onClick={fetchFaqs}
              className="mt-2 text-[#2D6A4F] text-sm font-medium underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center mb-2">
              <Search size={28} className="text-[#52B788]" />
            </div>
            <p className="text-[#1A1A2E] font-semibold text-lg">No questions found</p>
            <p className="text-[#6B7280] text-sm">Try different keywords or browse all categories</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
              className="mt-2 text-[#2D6A4F] text-sm font-medium underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {searchQuery && (
              <p className="text-sm text-[#6B7280]">
                Found <span className="font-semibold text-[#1A1A2E]">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-base font-semibold text-[#2D6A4F] mb-2 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#52B788]" />
                  {category}
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 px-5 divide-y-0">
                  {items.map((faq) => (
                    <FAQAccordion
                      key={faq.id}
                      question={searchQuery ? <span>{highlight(faq.question, searchQuery)}</span> : faq.question}
                      answer={faq.answer}
                      isOpen={openId === faq.id}
                      onToggle={() => handleToggle(faq.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CTA */}
      <section className="bg-[#2D6A4F] py-12 mt-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-['Playfair_Display'] text-xl md:text-2xl font-bold">
              Still have questions?
            </p>
            <p className="text-[#B7E4C7] text-sm mt-1">
              Ask Dr. Zainab directly in a private consultation.
            </p>
          </div>
          <Link
            to="/booking"
            className="flex-shrink-0 flex items-center gap-2 bg-white text-[#2D6A4F] font-semibold px-6 py-3 rounded-xl hover:bg-[#E1F5EE] transition-colors text-sm"
          >
            Book Consultation
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
