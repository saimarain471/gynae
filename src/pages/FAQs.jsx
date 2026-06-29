import { useState, useEffect } from 'react'
import { Search, HelpCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import FAQAccordion from '../components/FAQAccordion'
import CategoryFilterBar from '../components/CategoryFilterBar'
import EmptyState from '../components/EmptyState'
import CTABanner from '../components/CTABanner'

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
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    if (!error && data) setFaqs(data)
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
        <CategoryFilterBar
          categories={CATEGORIES}
          active={activeCategory}
          onChange={(cat) => { setActiveCategory(cat); setOpenId(null) }}
        />
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
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={28} className="text-[#52B788]" />}
            title="No questions found"
            subtitle="Try different keywords or browse all categories"
            actionLabel="Clear filters"
            onAction={() => { setSearchQuery(''); setActiveCategory('All') }}
          />
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
      <CTABanner
        title="Still have questions?"
        subtitle="Ask Dr. Zainab directly in a private consultation."
        linkTo="/booking"
        linkLabel="Book Consultation"
      />
    </div>
  )
}
