import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  Clock, BookOpen, Users, Globe, Award, Calendar,
  CheckCircle2, ChevronDown, CheckSquare
} from "lucide-react"
import { supabase } from "../lib/supabase"
import { posthog } from "../lib/posthog"
import ClassCard from "../components/ClassCard"

export default function ClassDetail() {
  const { slug } = useParams()
  const [classData, setClassData] = useState(null)
  const [relatedClasses, setRelatedClasses] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchClassData() {
      setLoading(true)
      try {
        // Fallback for when ID is still passed instead of slug, check if slug is numeric
        const isNumeric = /^\d+$/.test(slug)
        const query = supabase.from('classes').select('*').eq('visible', true)
        
        if (isNumeric) {
          query.eq('id', slug)
        } else {
          query.eq('slug', slug)
        }
        
        const { data: cData, error: cErr } = await query.single()

        if (cErr) throw cErr
        
        if (isMounted && cData) {
          setClassData(cData)

          // Fetch related
          const { data: rData } = await supabase
            .from('classes')
            .select('id, title, slug, category, price, discount_price, thumbnail_url, duration, modules')
            .eq('visible', true)
            .neq('id', cData.id)
            .limit(3)
          
          if (rData) setRelatedClasses(rData)
        }
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchClassData()

    return () => { isMounted = false }
  }, [slug])

  // SEO Update
  useEffect(() => {
    if (classData) {
      // Update title
      document.title = classData.meta_title || `${classData.title} — Dr. Zainab Mohsin`

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content',
        classData.meta_description ||
        `${classData.description} Available online across Pakistan.`
      )

      // Update OG tags
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', classData.meta_title || classData.title)

      const ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) ogDesc.setAttribute('content', classData.meta_description || classData.description)

      // Update OG image if thumbnail exists
      if (classData.thumbnail_url) {
        let ogImage = document.querySelector('meta[property="og:image"]')
        if (!ogImage) {
          ogImage = document.createElement('meta')
          ogImage.setAttribute('property', 'og:image')
          document.head.appendChild(ogImage)
        }
        ogImage.setAttribute('content', classData.thumbnail_url)
      }

      // Add JSON-LD Course schema for this class
      const existingSchema = document.getElementById('class-schema')
      if (existingSchema) existingSchema.remove()

      const schema = document.createElement('script')
      schema.id = 'class-schema'
      schema.type = 'application/ld+json'
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": classData.title,
        "description": classData.meta_description || classData.description,
        "provider": {
          "@type": "Person",
          "name": classData.teacher || "Dr. Zainab Mohsin",
          "jobTitle": "Consultant Gynecologist",
          "hasCredential": ["MBBS", "FCPS Gynecology & Obstetrics"]
        },
        "offers": {
          "@type": "Offer",
          "price": classData.discount_price || classData.price,
          "priceCurrency": "PKR",
          "availability": "https://schema.org/InStock"
        },
        "numberOfCredits": classData.modules,
        "timeRequired": classData.duration,
        "inLanguage": classData.language || "Urdu, English",
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "location": "Pakistan (Online)"
        }
      })
      document.head.appendChild(schema)
    }

    // Cleanup schema on unmount
    return () => {
      const schema = document.getElementById('class-schema')
      if (schema) schema.remove()
    }
  }, [classData])

  useEffect(() => {
    if (classData) {
      posthog.capture('class_detail_viewed', {
        classId: classData.id,
        classTitle: classData.title,
        category: classData.category,
        price: classData.discount_price || classData.price,
      })
    }
  }, [classData])

  if (loading) return <div className="py-24 text-center">Loading...</div>
  if (error || !classData) return <div className="py-24 text-center">Class not found</div>

  return (
    <main>
      {/* SECTION 1 — Breadcrumb */}
      <nav aria-label="breadcrumb" className="max-w-6xl mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-xs text-[#6B7280]">
          <li><Link to="/" className="hover:text-[#2D6A4F]">Home</Link></li>
          <li>→</li>
          <li><Link to="/classes" className="hover:text-[#2D6A4F]">Classes</Link></li>
          <li>→</li>
          <li className="text-[#1A1A2E] font-medium">{classData.title}</li>
        </ol>
      </nav>

      {/* SECTION 2 — Hero */}
      <section className="bg-gradient-to-br from-[#FAFAF8] to-[#E1F5EE] py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-6xl mx-auto px-4">
          <div>
            <span className="bg-[#E1F5EE] text-[#2D6A4F] text-xs font-semibold px-3 py-1 rounded-full">
              {classData.category}
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-[#1A1A2E] font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
              {classData.title}
            </h1>
            <p className="text-[#6B7280] text-base leading-relaxed mt-3">
              {classData.description}
            </p>
            
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <Clock size={16} className="text-[#52B788]" />
                <span className="text-sm font-medium">{classData.duration}</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <BookOpen size={16} className="text-[#52B788]" />
                <span className="text-sm font-medium">{classData.modules} modules</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <Users size={16} className="text-[#52B788]" />
                <span className="text-sm font-medium">{classData.seats_taken || 0}/{classData.seats_total || 50} enrolled</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <Globe size={16} className="text-[#52B788]" />
                <span className="text-sm font-medium">{classData.language || 'Urdu & English'}</span>
              </div>
            </div>

            {classData.what_you_learn && classData.what_you_learn.length > 0 && (
              <div className="mt-5 space-y-2">
                {classData.what_you_learn.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                    <CheckCircle2 size={16} className="text-[#52B788] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-[#E1F5EE] relative">
              {classData.thumbnail_url ? (
                <img
                  src={classData.thumbnail_url}
                  alt={`${classData.title} — Dr. Zainab Mohsin online class`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center
                  ${classData.category === 'Prenatal' ? 'bg-gradient-to-br from-[#2D6A4F] to-[#52B788]'
                  : classData.category === 'Postnatal' ? 'bg-gradient-to-br from-[#F4A261] to-[#e8894a]'
                  : 'bg-gradient-to-br from-[#7C3AED] to-[#9F67FA]'}`}>
                  <span className="text-6xl">
                    {classData.category === 'Prenatal' ? '🤰'
                    : classData.category === 'Postnatal' ? '💝' : '⭐'}
                  </span>
                  <p className="text-white font-semibold text-center px-4 mt-3 text-sm">
                    {classData.title}
                  </p>
                </div>
              )}

              {classData.featured && (
                <div className="absolute top-3 left-3 bg-[#F4A261] text-white text-xs font-semibold
                                px-3 py-1 rounded-full">
                  ★ Featured
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4 lg:sticky lg:top-24">
              {classData.discount_price ? (
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl font-bold text-[#2D6A4F]">
                    PKR {classData.discount_price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    PKR {classData.price.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {Math.round((1 - classData.discount_price/classData.price)*100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-[#2D6A4F] mb-1 block">
                  PKR {classData.price?.toLocaleString()}
                </span>
              )}
              <p className="text-xs text-[#6B7280] mb-4">One-time payment · Lifetime access</p>

              <Link
                to={`/book-class/${classData.slug || classData.id}`}
                className="block w-full bg-[#2D6A4F] hover:bg-[#245c43] text-white font-semibold
                           text-center py-3.5 rounded-xl transition-colors"
              >
                Enroll Now
              </Link>

              {classData.seats_total > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                    <span>{classData.seats_taken || 0} enrolled</span>
                    <span>{classData.seats_total - (classData.seats_taken || 0)} seats left</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-[#52B788] h-1.5 rounded-full"
                      style={{ width: `${Math.min(((classData.seats_taken || 0)/classData.seats_total)*100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 text-sm text-[#6B7280]">
                <div className="flex items-center gap-2"><Clock size={14} /> {classData.duration}</div>
                <div className="flex items-center gap-2"><BookOpen size={14} /> {classData.modules} modules</div>
                <div className="flex items-center gap-2"><Globe size={14} /> {classData.language || 'Urdu & English'}</div>
                {classData.certificate && (
                  <div className="flex items-center gap-2"><Award size={14} className="text-[#F4A261]" /> Certificate included</div>
                )}
              </div>

              {classData.schedule_slots?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-[#1A1A2E] mb-2">Class schedule</p>
                  <div className="flex flex-col gap-1.5">
                    {classData.schedule_slots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <Calendar size={12} />
                        {slot.day} · {slot.time}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — What You'll Learn */}
      {classData.what_you_learn?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-[#E1F5EE] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6 font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
              What You'll Learn in This Class
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classData.what_you_learn.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#2D6A4F] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#374151] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4 — Curriculum */}
      {classData.curriculum?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold font-serif text-[#1A1A2E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Class Curriculum
          </h2>
          <p className="text-[#6B7280] mb-6">{classData.modules} modules · {classData.duration} total</p>
          <div className="flex flex-col">
            {classData.curriculum.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100">
                <div className="bg-[#E1F5EE] text-[#2D6A4F] w-10 h-10 rounded-xl font-semibold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#52B788] font-medium">{item.week}</p>
                  <p className="text-sm font-medium text-[#1A1A2E]">{item.title}</p>
                </div>
                <div className="text-xs text-[#6B7280] bg-gray-50 px-2 py-1 rounded-lg">
                  {item.duration}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5 — Who Is This For + Requirements */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {classData.who_is_this_for && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 text-[#2D6A4F] mb-3">
              <Users size={20} />
              <h3 className="font-semibold text-[#1A1A2E]">Who is this for?</h3>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed">{classData.who_is_this_for}</p>
          </div>
        )}
        {classData.requirements && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 text-[#2D6A4F] mb-3">
              <CheckSquare size={20} />
              <h3 className="font-semibold text-[#1A1A2E]">What you need</h3>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed">{classData.requirements}</p>
          </div>
        )}
      </section>

      {/* SECTION 6 — Instructor */}
      <section className="bg-gradient-to-br from-[#2D6A4F] to-[#52B788] py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center border-4 border-white/30 text-4xl overflow-hidden relative">
             <img src="/dr-zainab.jpg" alt="Dr. Zainab Mohsin" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
             <div className="absolute inset-0 flex items-center justify-center text-3xl" style={{ zIndex: -1 }}>👩‍⚕️</div>
          </div>
          <div className="text-white">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">Your Instructor</p>
            <h2 className="text-2xl font-bold font-serif mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              {classData.teacher || 'Dr. Zainab Mohsin'}
            </h2>
            <p className="text-white/80 text-sm mb-3">MBBS, FCPS — Gynecology & Obstetrics</p>
            <p className="text-white/75 text-sm leading-relaxed max-w-2xl mb-4">
              With over 10 years of clinical experience in gynecology and obstetrics, Dr. Zainab Mohsin
              has helped hundreds of mothers across Pakistan navigate pregnancy and motherhood with
              confidence. Her teaching style focuses on simple, practical guidance in both Urdu and English.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-black/10 px-3 py-1 rounded-full text-xs font-medium">500+ students</span>
              <span className="bg-black/10 px-3 py-1 rounded-full text-xs font-medium">10+ years exp</span>
              <span className="bg-black/10 px-3 py-1 rounded-full text-xs font-medium">4.9★ rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FAQs */}
      {classData.faqs?.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold font-serif text-[#1A1A2E] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col">
            {classData.faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-100">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full py-4 text-left"
                >
                  <span className="text-sm font-medium text-[#1A1A2E] pr-4">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#6B7280] transition-transform ${openFaq === i ? 'rotate-180' : ''} flex-shrink-0`}
                  />
                </button>
                {openFaq === i && (
                  <p className="text-sm text-[#6B7280] pb-4 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 8 — Final CTA banner */}
      <section className="bg-[#FAFAF8] border-t border-gray-100 py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif text-[#1A1A2E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to start learning?
          </h2>
          <p className="text-[#6B7280] mb-8">
            Join {classData.seats_taken || 0}+ mothers who are already enrolled
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/book-class/${classData.slug || classData.id}`}
              className="w-full sm:w-auto bg-[#2D6A4F] hover:bg-[#245c43] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Enroll Now — PKR {classData.discount_price || classData.price}
            </Link>
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20b858] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2"
            >
              Have questions? Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 9 — Related Classes */}
      {relatedClasses.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-14 pt-8">
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">You may also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedClasses.map(cls => (
              <ClassCard key={cls.id} classItem={cls} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
