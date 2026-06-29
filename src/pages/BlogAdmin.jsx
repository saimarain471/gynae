import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabase'
import StarRating from '../components/StarRating'
import {
  Lock, LogOut, PenSquare, Eye, EyeOff, Trash2,
  ToggleLeft, ToggleRight, CheckCircle, XCircle,
  ChevronDown, Loader2, HelpCircle, Star, Clock,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// IMPORTANT: Change this password before going live!
// This is a temporary hardcoded password for admin access.
// For production, use Supabase Auth or environment variable.
// ─────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'zainab2025'

const BLOG_CATEGORIES = ['Prenatal', 'Postnatal', 'Baby Care', 'General']
const FAQ_CATEGORIES = ['Appointments', 'Pregnancy', 'Baby Care', 'Postnatal', 'General']

const EMPTY_BLOG_FORM = {
  title: '', slug: '', category: 'Prenatal',
  excerpt: '', readTime: 5, coverImageUrl: '', content: '',
}
const EMPTY_FAQ_FORM = {
  question: '', answer: '', category: 'Appointments', sortOrder: 0,
}

// ── Toast ──────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${type === 'success' ? 'bg-[#2D6A4F] text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
      {message}
    </div>
  )
}

// ── Login Card ─────────────────────────────────────────────────
function LoginCard({ onSuccess }) {
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) onSuccess()
    else { setError(true); setPw('') }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-soft p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#E1F5EE] flex items-center justify-center mb-3">
            <Lock size={24} className="text-[#2D6A4F]" />
          </div>
          <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A1A2E]">Admin Access</h1>
          <p className="text-[#6B7280] text-sm mt-1">Enter the admin password to continue</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <input
              id="admin-password"
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false) }}
              placeholder="Password"
              autoComplete="current-password"
              className={`w-full border rounded-xl px-4 py-3 text-sm text-[#1A1A2E] pr-11 outline-none transition-colors ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#52B788]'}`}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2D6A4F]" tabIndex={-1}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs -mt-2">Incorrect password. Please try again.</p>}
          <button type="submit" className="bg-[#2D6A4F] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#245c43] transition-colors">
            Enter Admin Panel
          </button>
        </form>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// BLOG POSTS TAB
// ═══════════════════════════════════════════════════════════════
function BlogTab({ showToast }) {
  const [form, setForm] = useState(EMPTY_BLOG_FORM)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    if (slugManuallyEdited) return
    const generated = form.title.toLowerCase()
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
    setForm(prev => ({ ...prev, slug: generated }))
  }, [form.title, slugManuallyEdited])

  useEffect(() => { fetchAllPosts() }, [])

  const fetchAllPosts = async () => {
    setLoadingPosts(true)
    const { data, error } = await supabase.from('blog_posts')
      .select('id, title, slug, published, created_at, views, category')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Failed to fetch blog posts:', error)
      showToast('Failed to load posts: ' + error.message, 'error')
    }
    setPosts(data || [])
    setLoadingPosts(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (published) => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim() || !form.excerpt.trim()) {
      showToast('Please fill in all required fields.', 'error'); return
    }
    setSubmitting(true)
    const { error } = await supabase.from('blog_posts').insert({
      title: form.title.trim(), slug: form.slug.trim(), category: form.category,
      excerpt: form.excerpt.trim(), read_time: Number(form.readTime) || 5,
      cover_image_url: form.coverImageUrl.trim() || null,
      content: form.content.trim(), published,
    })
    if (error) showToast(error.message || 'Something went wrong.', 'error')
    else {
      showToast(published ? '🎉 Post published!' : 'Draft saved!', 'success')
      setForm(EMPTY_BLOG_FORM); setSlugManuallyEdited(false)
      fetchAllPosts()
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    setSubmitting(false)
  }

  const handleTogglePublish = async (post) => {
    const { error } = await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id)
    if (!error) { showToast(post.published ? 'Post unpublished.' : 'Post published!', 'success'); fetchAllPosts() }
    else showToast('Failed to update post.', 'error')
  }

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', post.id)
    if (!error) { showToast('Post deleted.', 'success'); fetchAllPosts() }
    else showToast('Failed to delete post.', 'error')
  }

  const excerptCount = form.excerpt.length

  return (
    <>
      {/* Form + preview */}
      <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1A1A2E] mb-5">Write New Post</h2>
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Title <span className="text-red-400">*</span></label>
              <input id="post-title" name="title" type="text" value={form.title} onChange={handleChange}
                placeholder="e.g. What to Expect in Your First Trimester"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors" />
            </div>
            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Slug <span className="text-red-400">*</span></label>
              <input id="post-slug" name="slug" type="text" value={form.slug}
                onChange={(e) => { setSlugManuallyEdited(true); handleChange(e) }}
                placeholder="auto-generated-from-title"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors font-mono" />
              {form.slug && <p className="text-xs text-[#6B7280] mt-1">URL will be: <span className="text-[#2D6A4F] font-mono">/blog/{form.slug}</span></p>}
            </div>
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Category</label>
              <div className="relative">
                <select id="post-category" name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors appearance-none bg-white pr-8">
                  {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
              </div>
            </div>
            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5 flex items-center justify-between">
                <span>Excerpt <span className="text-red-400">*</span></span>
                <span className={`font-normal ${excerptCount > 200 ? 'text-red-400' : 'text-[#6B7280]'}`}>{excerptCount}/200</span>
              </label>
              <textarea id="post-excerpt" name="excerpt" value={form.excerpt} onChange={handleChange}
                rows={3} maxLength={200} placeholder="A short summary shown on the blog listing page…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors resize-none" />
            </div>
            {/* Read time */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Read time (minutes)</label>
              <input id="post-read-time" name="readTime" type="number" min={1} max={60} value={form.readTime} onChange={handleChange}
                className="w-28 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors" />
            </div>
            {/* Cover URL */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Cover Image URL <span className="text-[#6B7280] font-normal">(optional)</span></label>
              <input id="post-cover-url" name="coverImageUrl" type="url" value={form.coverImageUrl} onChange={handleChange}
                placeholder="https://…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors" />
            </div>
            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Content <span className="text-red-400">*</span></label>
              <p className="text-xs text-[#6B7280] mb-2">
                Supports markdown: <code className="bg-gray-100 px-1 rounded">## Heading</code>, <code className="bg-gray-100 px-1 rounded">**bold**</code>, <code className="bg-gray-100 px-1 rounded">- list item</code>
              </p>
              <textarea id="post-content" name="content" value={form.content} onChange={handleChange}
                rows={20} placeholder="Start writing your article in markdown format…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors resize-y font-mono leading-relaxed" />
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <button id="save-draft-btn" type="button" disabled={submitting} onClick={() => handleSubmit(false)}
                className="flex items-center gap-2 border border-[#52B788] text-[#2D6A4F] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#E1F5EE] transition-colors disabled:opacity-50">
                {submitting ? <Loader2 size={15} className="animate-spin" /> : null} Save as Draft
              </button>
              <button id="publish-btn" type="button" disabled={submitting} onClick={() => handleSubmit(true)}
                className="flex items-center gap-2 bg-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#245c43] transition-colors disabled:opacity-50">
                {submitting ? <Loader2 size={15} className="animate-spin" /> : null} Publish Now
              </button>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="sticky top-32 self-start bg-white border border-gray-100 rounded-2xl p-5 max-h-[80vh] overflow-y-auto">
          <p className="text-xs text-[#6B7280] mb-3 uppercase tracking-widest font-medium">Live Preview</p>
          <h1 className="font-['Playfair_Display'] text-xl font-bold text-[#1A1A2E] mb-2 leading-snug">
            {form.title || 'Post title will appear here…'}
          </h1>
          {form.excerpt && <p className="text-sm text-[#6B7280] mb-4 italic">{form.excerpt}</p>}
          <div className="prose prose-sm max-w-none prose-headings:font-['Playfair_Display'] prose-headings:text-[#1A1A2E] prose-p:text-[#374151] prose-strong:text-[#1A1A2E] prose-li:text-[#374151]">
            <ReactMarkdown>{form.content || '_Start writing to see preview…_'}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1A1A2E] mb-5">All Posts</h2>
        {loadingPosts ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-[#52B788]" /></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-[#6B7280] py-10 text-sm">No posts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-[#6B7280] font-semibold uppercase tracking-wide">
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Views</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-[#1A1A2E] max-w-xs truncate">{post.title}</p>
                      <p className="text-xs text-[#6B7280] font-mono">/blog/{post.slug}</p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#6B7280]">{post.category}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${post.published ? 'bg-[#E1F5EE] text-[#2D6A4F]' : 'bg-gray-100 text-[#6B7280]'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-[#6B7280]">{(post.views || 0).toLocaleString()}</td>
                    <td className="py-3 pr-4 text-xs text-[#6B7280] whitespace-nowrap">
                      {new Date(post.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleTogglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'} className="text-[#2D6A4F] hover:text-[#245c43]">
                          {post.published ? <ToggleRight size={20} className="text-[#52B788]" /> : <ToggleLeft size={20} className="text-gray-400" />}
                        </button>
                        <button onClick={() => handleDelete(post)} title="Delete" className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// FAQS TAB
// ═══════════════════════════════════════════════════════════════
function FAQsTab({ showToast }) {
  const [form, setForm] = useState(EMPTY_FAQ_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchFaqs() }, [])

  const fetchFaqs = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true })
    if (error) {
      console.error('Failed to fetch FAQs:', error)
      showToast('Failed to load FAQs: ' + error.message, 'error')
    }
    setFaqs(data || [])
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (published) => {
    if (!form.question.trim() || !form.answer.trim()) {
      showToast('Please fill in question and answer.', 'error'); return
    }
    setSubmitting(true)
    const { error } = await supabase.from('faqs').insert({
      question: form.question.trim(), answer: form.answer.trim(),
      category: form.category, sort_order: Number(form.sortOrder) || 0, published,
    })
    if (error) showToast(error.message || 'Something went wrong.', 'error')
    else { showToast(published ? 'FAQ published!' : 'FAQ saved as draft!', 'success'); setForm(EMPTY_FAQ_FORM); fetchFaqs() }
    setSubmitting(false)
  }

  const handleTogglePublish = async (faq) => {
    const { error } = await supabase.from('faqs').update({ published: !faq.published }).eq('id', faq.id)
    if (!error) { showToast(faq.published ? 'FAQ unpublished.' : 'FAQ published!', 'success'); fetchFaqs() }
    else showToast('Failed to update FAQ.', 'error')
  }

  const handleDelete = async (faq) => {
    if (!window.confirm(`Delete this FAQ? This cannot be undone.`)) return
    const { error } = await supabase.from('faqs').delete().eq('id', faq.id)
    if (!error) { showToast('FAQ deleted.', 'success'); fetchFaqs() }
    else showToast('Failed to delete FAQ.', 'error')
  }

  return (
    <>
      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1A1A2E] mb-5">Add New FAQ</h2>
        <div className="flex flex-col gap-4 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Question <span className="text-red-400">*</span></label>
            <input name="question" type="text" value={form.question} onChange={handleChange}
              placeholder="e.g. How do I book a consultation?"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Answer <span className="text-red-400">*</span></label>
            <textarea name="answer" value={form.answer} onChange={handleChange} rows={6}
              placeholder="Write a clear, helpful answer…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Category</label>
              <div className="relative">
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors appearance-none bg-white pr-8">
                  {FAQ_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A2E] mb-1.5">Sort Order <span className="text-[#6B7280] font-normal">(lower = first)</span></label>
              <input name="sortOrder" type="number" min={0} value={form.sortOrder} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#52B788] transition-colors" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="button" disabled={submitting} onClick={() => handleSubmit(false)}
              className="flex items-center gap-2 border border-[#52B788] text-[#2D6A4F] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#E1F5EE] transition-colors disabled:opacity-50">
              {submitting ? <Loader2 size={15} className="animate-spin" /> : null} Save as Draft
            </button>
            <button type="button" disabled={submitting} onClick={() => handleSubmit(true)}
              className="flex items-center gap-2 bg-[#2D6A4F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#245c43] transition-colors disabled:opacity-50">
              {submitting ? <Loader2 size={15} className="animate-spin" /> : null} Publish FAQ
            </button>
          </div>
        </div>
      </div>

      {/* FAQs table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1A1A2E] mb-5">All FAQs</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-[#52B788]" /></div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-[#6B7280] py-10 text-sm">No FAQs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-[#6B7280] font-semibold uppercase tracking-wide">
                  <th className="pb-3 pr-4">Question</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map(faq => (
                  <tr key={faq.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pr-4 max-w-xs">
                      <p className="text-[#1A1A2E] font-medium truncate">{faq.question}</p>
                      <p className="text-xs text-[#6B7280] truncate mt-0.5">{faq.answer.slice(0, 80)}…</p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#6B7280]">{faq.category}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${faq.published ? 'bg-[#E1F5EE] text-[#2D6A4F]' : 'bg-gray-100 text-[#6B7280]'}`}>
                        {faq.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-[#6B7280] text-xs">{faq.sort_order}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleTogglePublish(faq)} title={faq.published ? 'Unpublish' : 'Publish'} className="text-[#2D6A4F]">
                          {faq.published ? <ToggleRight size={20} className="text-[#52B788]" /> : <ToggleLeft size={20} className="text-gray-400" />}
                        </button>
                        <button onClick={() => handleDelete(faq)} title="Delete" className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// REVIEWS TAB
// ═══════════════════════════════════════════════════════════════
function ReviewsTab({ showToast }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchReviews() }, [])

  const fetchReviews = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('Failed to fetch reviews:', error)
      showToast('Failed to load reviews: ' + error.message, 'error')
    }
    setReviews(data || [])
    setLoading(false)
  }

  const pendingCount = reviews.filter(r => !r.approved).length
  const approvedCount = reviews.filter(r => r.approved).length
  const featuredCount = reviews.filter(r => r.featured).length

  const handleToggleApprove = async (r) => {
    const { error } = await supabase.from('testimonials').update({ approved: !r.approved }).eq('id', r.id)
    if (!error) { showToast(r.approved ? 'Review unapproved.' : 'Review approved!', 'success'); fetchReviews() }
    else showToast('Failed to update review.', 'error')
  }

  const handleToggleFeature = async (r) => {
    const { error } = await supabase.from('testimonials').update({ featured: !r.featured }).eq('id', r.id)
    if (!error) { showToast(r.featured ? 'Removed from featured.' : 'Added to featured!', 'success'); fetchReviews() }
    else showToast('Failed to update review.', 'error')
  }

  const handleDelete = async (r) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return
    const { error } = await supabase.from('testimonials').delete().eq('id', r.id)
    if (!error) { showToast('Review deleted.', 'success'); fetchReviews() }
    else showToast('Failed to delete review.', 'error')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1A1A2E]">Patient Reviews</h2>
        <div className="flex flex-wrap gap-4 text-xs text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
            {pendingCount} pending approval
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#52B788] inline-block" />
            {approvedCount} approved
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={10} fill="#F4A261" color="#F4A261" />
            {featuredCount} featured
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-[#52B788]" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-[#6B7280] py-10 text-sm">No reviews yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-[#6B7280] font-semibold uppercase tracking-wide">
                <th className="pb-3 pr-4">Patient</th>
                <th className="pb-3 pr-4">Rating</th>
                <th className="pb-3 pr-4">Service</th>
                <th className="pb-3 pr-4">Review</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Featured</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} className={`border-b border-gray-50 transition-colors ${!r.approved ? 'bg-yellow-50/60' : 'hover:bg-gray-50/50'}`}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-[#1A1A2E]">{r.patient_name}</p>
                    <p className="text-xs text-[#6B7280]">{r.city}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#F4A261" color="#F4A261" />
                      <span className="text-xs font-semibold text-[#1A1A2E]">{r.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-[#6B7280] whitespace-nowrap">{r.service_type}</td>
                  <td className="py-3 pr-4 max-w-xs">
                    <p className="text-xs text-[#374151] truncate">{r.review_text.slice(0, 80)}…</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${r.approved ? 'bg-[#E1F5EE] text-[#2D6A4F]' : 'bg-yellow-50 text-yellow-700'}`}>
                      {r.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <button onClick={() => handleToggleFeature(r)} title={r.featured ? 'Remove from featured' : 'Mark as featured'}
                      className={`transition-colors ${r.featured ? 'text-[#F4A261]' : 'text-gray-300 hover:text-[#F4A261]'}`}>
                      <Star size={16} fill={r.featured ? '#F4A261' : 'none'} />
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleApprove(r)} title={r.approved ? 'Unapprove' : 'Approve'}
                        className={`transition-colors ${r.approved ? 'text-[#52B788]' : 'text-gray-400 hover:text-[#52B788]'}`}>
                        {r.approved ? <CheckCircle size={18} /> : <Clock size={18} />}
                      </button>
                      <button onClick={() => handleDelete(r)} title="Delete" className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════
export default function BlogAdmin() {
  const [authed, setAuthed] = useState(false)
  const [activeTab, setActiveTab] = useState('blog')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  if (!authed) return <LoginCard onSuccess={() => setAuthed(true)} />

  const tabs = [
    { id: 'blog', label: 'Blog Posts', icon: PenSquare },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="font-semibold text-[#1A1A2E] text-sm">Content Admin Panel</span>
          <button onClick={() => setAuthed(false)}
            className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-red-500 transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab switcher */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#2D6A4F] text-white shadow-sm'
                    : 'border border-gray-200 text-[#6B7280] hover:border-[#52B788] bg-white'
                }`}>
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'blog' && <BlogTab showToast={showToast} />}
        {activeTab === 'faqs' && <FAQsTab showToast={showToast} />}
        {activeTab === 'reviews' && <ReviewsTab showToast={showToast} />}
      </div>
    </div>
  )
}
