import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import BlogCard from '../components/BlogCard'
import BlogSkeleton from '../components/BlogSkeleton'
import { Sparkles, ArrowRight } from 'lucide-react'

const CATEGORIES = ['All', 'Prenatal', 'Postnatal', 'Baby Care', 'General']

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    document.title = 'Health Tips & Guides — Dr. Zainab Mohsin'
    posthog.capture('blog_page_viewed')
    fetchPosts()
  }, [])

  useEffect(() => {
    posthog.capture('blog_category_filtered', { category: activeCategory })
  }, [activeCategory])

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, author, read_time, created_at, cover_image_url')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPosts(data)
    }
    setLoading(false)
  }

  const filtered =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page header */}
      <section className="bg-[#E1F5EE] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#52B788]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#52B788]">
              Expert Insights
            </span>
          </div>
          <h1
            className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A2E] leading-tight"
          >
            Health Tips &amp; Guides
          </h1>
          <p className="mt-3 text-[#6B7280] text-base max-w-xl leading-relaxed">
            Expert advice on pregnancy, baby care, and women&apos;s health — by Dr. Zainab Mohsin
          </p>
        </div>
      </section>

      {/* Category filter bar */}
      <div className="sticky top-16 z-30 bg-[#FAFAF8] border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
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

      {/* Blog grid */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center mb-2">
              <Sparkles size={28} className="text-[#52B788]" />
            </div>
            <p className="text-[#1A1A2E] font-semibold text-lg">No posts in this category yet</p>
            <p className="text-[#6B7280] text-sm">Check back soon for new articles.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-2 text-[#2D6A4F] text-sm font-medium underline underline-offset-2"
            >
              View all posts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </main>

      {/* CTA banner */}
      <section className="bg-[#2D6A4F] py-12 mt-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-['Playfair_Display'] text-xl md:text-2xl font-bold leading-snug">
              Have a specific question?
            </p>
            <p className="text-[#B7E4C7] text-sm mt-1">
              Book a consultation with Dr. Zainab Mohsin for personalised advice.
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
