import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import BlogCard from '../components/BlogCard'
import BlogSkeleton from '../components/BlogSkeleton'
import PageHeader from '../components/PageHeader'
import CategoryFilterBar from '../components/CategoryFilterBar'
import EmptyState from '../components/EmptyState'
import CTABanner from '../components/CTABanner'
import { Sparkles } from 'lucide-react'

const CATEGORIES = ['All', 'Prenatal', 'Postnatal', 'Baby Care', 'General']

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
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
      {/* SEO */}
      <title>Health Tips &amp; Guides — Dr. Zainab Mohsin</title>

      {/* Page header */}
      <PageHeader
        icon={<Sparkles size={16} className="text-[#52B788]" />}
        badge="Expert Insights"
        title="Health Tips & Guides"
        description="Expert advice on pregnancy, baby care, and women's health — by Dr. Zainab Mohsin"
      />

      {/* Category filter bar */}
      <CategoryFilterBar categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

      {/* Blog grid */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={28} className="text-[#52B788]" />}
            title="No posts in this category yet"
            subtitle="Check back soon for new articles."
            actionLabel="View all posts"
            onAction={() => setActiveCategory('All')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        )}
      </main>

      {/* CTA banner */}
      <CTABanner
        title="Have a specific question?"
        subtitle="Book a consultation with Dr. Zainab Mohsin for personalised advice."
        linkTo="/booking"
        linkLabel="Book Consultation"
      />
    </div>
  )
}
