import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { classes as fallbackClasses } from '../data/classes'
import { posthog } from '../lib/posthog'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

export default function ClassDetail() {
  const { id } = useParams()
  const [classData, setClassData] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchClass() {
      try {
        const { data, error } = await supabase.from('classes').select('*').eq('id', id).maybeSingle()
        if (!isMounted) return
        if (!error && data) {
          setClassData({
            ...data,
            lessons: data.modules || data.lessons || 1,
            price: data.price,
            priceLabel: `PKR ${Number(data.price || 0).toLocaleString()}`,
          })
        } else {
          const fallback = fallbackClasses.find((item) => item.id === Number(id))
          setClassData(fallback || null)
        }
      } catch (error) {
        if (!isMounted) return
        const fallback = fallbackClasses.find((item) => item.id === Number(id))
        setClassData(fallback || null)
      }
    }

    fetchClass()
    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    if (classData) {
      posthog.capture('class_detail_viewed', { classId: classData.id, classTitle: classData.title })
    }
  }, [classData])

  if (!classData) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-text">Class not found</h1>
          <p className="mt-4 text-sm text-text-muted">Please return to the classes page and select a valid class.</p>
          <Link to="/classes" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
            Browse Classes
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <SEO
        title={classData.title}
        description={classData.description}
        url={`https://gynae.vercel.app/classes/${classData.id}`}
        image={classData.thumbnail_url}
      />
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">{classData.category}</p>
            <h1 className="mt-4 text-3xl font-semibold text-text">{classData.title}</h1>
            <p className="mt-4 text-sm leading-7 text-text-muted">{classData.description}</p>
          </div>
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-text">What you&apos;ll learn</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-text-muted">
                <li>• Clear guidance for every stage of pregnancy or newborn care.</li>
                <li>• Practical checklists and do&apos;s/don&apos;ts for safer care.</li>
                <li>• How to recognize warning signs and seek support quickly.</li>
                <li>• Effective breastfeeding, recovery, and bonding strategies.</li>
                <li>• Simple daily routines for family health and confidence.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text">Curriculum overview</h2>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                A step-by-step class plan with lessons that cover preparation, care, feeding, recovery, and follow-up support for new mothers.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text">Instructor</h2>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                Dr. Zainub Mohsin is a gynecologist with 10+ years of experience in women&apos;s health education and prenatal care.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-secondary">Price</p>
              <p className="mt-2 text-3xl font-semibold text-text">PKR {classData.price}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-sm text-text-muted">
              <p>{classData.duration}</p>
              <p className="mt-2">{classData.lessons} lessons</p>
            </div>
          </div>
          <Link
            to={`/book-class/${classData.id}`}
            onClick={() => posthog.capture('enroll_now_clicked', { classId: classData.id, classTitle: classData.title })}
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e99141]"
          >
            Enroll Now
          </Link>
        </aside>
      </div>
    </main>
  )
}
