import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import {
  Clock,
  Eye,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Heart,
  Star,
  BookOpen,
  Baby,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

const categoryStyles = {
  Prenatal: {
    gradient: 'bg-gradient-to-br from-[#E1F5EE] to-[#B7E4C7]',
    badge: 'bg-[#E1F5EE] text-[#2D6A4F]',
    icon: Heart,
  },
  Postnatal: {
    gradient: 'bg-gradient-to-br from-[#FFF3E8] to-[#FFD6AA]',
    badge: 'bg-[#FFF3E8] text-[#C05621]',
    icon: Baby,
  },
  'Baby Care': {
    gradient: 'bg-gradient-to-br from-[#EEF2FF] to-[#C7D2FE]',
    badge: 'bg-[#EEF2FF] text-[#4338CA]',
    icon: Star,
  },
  General: {
    gradient: 'bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB]',
    badge: 'bg-[#F3F4F6] text-[#374151]',
    icon: BookOpen,
  },
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [copied, setCopied] = useState(false)

  const fetchPost = useCallback(async () => {
    setLoading(true)

    const { data: postData, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error || !postData) {
      setPost(null)
      setLoading(false)
      return
    }

    setPost(postData)

    // Increment view count (fire and forget)
    supabase
      .from('blog_posts')
      .update({ views: (postData.views || 0) + 1 })
      .eq('id', postData.id)

    // Fetch related posts
    const { data: related } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, category, read_time')
      .eq('published', true)
      .neq('slug', slug)
      .limit(2)

    setRelatedPosts(related || [])
    setLoading(false)
  }, [slug])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchPost()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [fetchPost])

  useEffect(() => {
    if (post) {
      // Update document title and meta description for SEO
      document.title = `${post.title} — Dr. Zainab Mohsin`
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute('content', post.excerpt)

      // Track PostHog event
      posthog.capture('blog_post_viewed', {
        slug,
        title: post.title,
        category: post.category,
      })
    }
  }, [post, slug])

  const handleWhatsAppShare = () => {
    posthog.capture('blog_share_clicked', { method: 'whatsapp' })
    const text = encodeURIComponent(
      `Check this article by Dr. Zainab: ${window.location.href}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleCopyLink = async () => {
    posthog.capture('blog_share_clicked', { method: 'copy_link' })
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select the url
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#52B788] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#6B7280] text-sm">Loading article…</p>
        </div>
      </div>
    )
  }

  // ── Not found state ─────────────────────────────────────────────
  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[#E1F5EE] flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-[#2D6A4F]" />
          </div>
          <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A1A2E] mb-2">
            Article not found
          </h1>
          <p className="text-[#6B7280] text-sm mb-6">
            This article may have been removed or the link is incorrect.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#245c43] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Health Tips
          </Link>
        </div>
      </div>
    )
  }

  const style = categoryStyles[post.category] || categoryStyles.General
  const Icon = style.icon

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-1.5 text-xs text-[#6B7280]">
          <Link to="/" className="hover:text-[#2D6A4F] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/blog" className="hover:text-[#2D6A4F] transition-colors">Health Tips</Link>
          <ChevronRight size={12} />
          <span className="text-[#1A1A2E] font-medium truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10">
        {/* Cover image */}
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8"
          />
        ) : (
          <div
            className={`w-full h-56 rounded-2xl mb-8 ${style.gradient} flex items-center justify-center`}
          >
            <Icon size={48} color="#2D6A4F" strokeWidth={1.5} />
          </div>
        )}

        {/* Category pill */}
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
          {post.category}
        </span>

        {/* Title */}
        <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A2E] mt-3 mb-5 leading-tight">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B7280] mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              ZM
            </div>
            <span className="font-medium text-[#1A1A2E]">Dr. Zainab Mohsin</span>
          </div>
          <span className="text-gray-300">•</span>
          <span>{formatDate(post.created_at)}</span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {post.read_time} min read
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {(post.views || 0).toLocaleString()} views
          </span>
        </div>

        <div className="border-t border-gray-100 mb-8" />

        {/* Content */}
        <div className="prose prose-lg max-w-none
          prose-headings:font-['Playfair_Display'] prose-headings:text-[#1A1A2E]
          prose-p:text-[#374151] prose-p:leading-relaxed
          prose-strong:text-[#1A1A2E] prose-strong:font-semibold
          prose-li:text-[#374151]
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
          prose-ul:space-y-1 prose-ol:space-y-1
          prose-a:text-[#2D6A4F] prose-a:no-underline hover:prose-a:underline
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="border-t border-gray-100 my-10" />

        {/* Doctor card */}
        <div className="bg-[#E1F5EE] rounded-2xl p-5 flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#2D6A4F] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
            ZM
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2D6A4F]">Written by Dr. Zainab Mohsin</p>
            <p className="text-xs text-[#2D6A4F]/70 mb-1">MBBS, FCPS (Obstetrics &amp; Gynaecology)</p>
            <p className="text-sm text-[#374151] leading-relaxed">
              Dr. Zainab Mohsin is a consultant gynecologist and women&apos;s health educator helping mothers
              prepare for pregnancy, birth, and newborn care with clarity and confidence.
            </p>
          </div>
        </div>

        {/* Share section */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-3 flex items-center gap-2">
            <Share2 size={15} />
            Share this article:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 border border-[#52B788]/40 text-[#2D6A4F] rounded-xl px-4 py-2 text-sm hover:bg-[#E1F5EE] transition-colors"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" width="15" height="15" fill="#2D6A4F">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.843L0 24l6.335-1.518A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.359-.214-3.737.896.938-3.636-.235-.374A9.819 9.819 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z" />
              </svg>
              Share on WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 border border-[#52B788]/40 text-[#2D6A4F] rounded-xl px-4 py-2 text-sm hover:bg-[#E1F5EE] transition-colors"
            >
              {copied ? <Check size={15} className="text-[#52B788]" /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Related articles */}
        {relatedPosts.length > 0 && (
          <div className="mb-10">
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1A1A2E] mb-4">
              Read more articles
            </h2>
            <div className="flex flex-col gap-3">
              {relatedPosts.map((related) => {
                const relStyle = categoryStyles[related.category] || categoryStyles.General
                const RelIcon = relStyle.icon
                return (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="flex gap-4 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow p-3 group"
                  >
                    <div className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ${relStyle.gradient} flex items-center justify-center`}>
                      {related.cover_image_url ? (
                        <img src={related.cover_image_url} alt={related.title} className="w-full h-full object-cover" />
                      ) : (
                        <RelIcon size={24} color="#2D6A4F" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${relStyle.badge}`}>
                        {related.category}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-[#1A1A2E] line-clamp-2 group-hover:text-[#2D6A4F] transition-colors leading-snug">
                        {related.title}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1 line-clamp-1">{related.excerpt}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          to="/classes"
          className="flex items-center justify-between bg-[#2D6A4F] text-white rounded-2xl p-6 hover:bg-[#245c43] transition-colors group"
        >
          <div>
            <p className="font-['Playfair_Display'] text-lg font-bold leading-snug">
              Book a class or consultation with Dr. Zainab
            </p>
            <p className="text-[#B7E4C7] text-sm mt-1">
              Antenatal classes, postnatal support &amp; one-on-one consultations available.
            </p>
          </div>
          <ArrowRight size={20} className="flex-shrink-0 ml-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </article>
    </div>
  )
}
