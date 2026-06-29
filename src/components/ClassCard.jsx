import { Link } from 'react-router-dom'
import { Clock, BookOpen, ChevronRight, Baby, Heart, Star } from 'lucide-react'
import { posthog } from '../lib/posthog'

export default function ClassCard({ loading = false, classData }) {
  if (loading) {
    return (
      <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="h-36 bg-gray-200" />
        <div className="flex flex-col gap-3 p-5">
          <div className="h-5 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-3/4 rounded-lg bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-5/6 rounded bg-gray-100" />
          <div className="flex gap-4">
            <div className="h-4 w-16 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>
          <div className="border-t border-gray-100" />
          <div className="flex items-center justify-between">
            <div className="h-7 w-24 rounded-lg bg-gray-200" />
            <div className="h-9 w-28 rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  const { id, title, category, description, duration, lessons, priceLabel } = classData

  const categoryStyles = {
    Prenatal: {
      gradient: 'from-[#2D6A4F] to-[#52B788]',
      icon: Baby,
      pill: 'bg-white/20 text-white',
      accent: '#2D6A4F',
    },
    Postnatal: {
      gradient: 'from-[#F4A261] to-[#e8894a]',
      icon: Heart,
      pill: 'bg-white/20 text-white',
      accent: '#F4A261',
    },
    'Baby Care': {
      gradient: 'from-[#7C3AED] to-[#9F67FA]',
      icon: Star,
      pill: 'bg-white/20 text-white',
      accent: '#7C3AED',
    },
  }

  const theme = categoryStyles[category] || categoryStyles.Prenatal
  const Icon = theme.icon

  const handleClick = () => {
    posthog.capture('class_card_clicked', { classId: id, classTitle: title })
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.23),transparent_55%)]" />
        <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${theme.pill}`}>
          {category}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-black/20 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
          {lessons} lessons
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Icon size={32} className="text-white" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold leading-snug text-[#1A1A2E] transition-colors group-hover:text-[#2D6A4F]">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">{description}</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#52B788]" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[#52B788]" />
            <span>{lessons} lessons</span>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-bold text-[#2D6A4F]">{priceLabel}</div>
              <div className="mt-0.5 text-xs text-[#6B7280]">One-time payment</div>
            </div>
            <Link
              to={`/book-class/${id}`}
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245c43]"
            >
              Enroll Now <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
