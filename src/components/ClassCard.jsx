import { Link } from 'react-router-dom'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import { posthog } from '../lib/posthog'

export default function ClassCard({ loading = false, classData }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white animate-pulse">
        <div className="h-1.5 w-full bg-gray-200" />
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
  const categoryColor = {
    Prenatal: '#2D6A4F',
    Postnatal: '#52B788',
    'Baby Care': '#F4A261',
  }

  const handleClick = () => {
    posthog.capture('class_card_clicked', { classId: id, classTitle: title })
  }

  const currentColor = categoryColor[category] || '#2D6A4F'

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="h-1 w-full rounded-t-xl" style={{ backgroundColor: currentColor }} />
      <div className="p-6">
        <div className="mb-4">
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${currentColor}1A`, color: currentColor }}
          >
            {category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-[#1A1A2E]">{title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6B7280]">{description}</p>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{lessons} lessons</span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xl font-bold text-[#2D6A4F]">{priceLabel}</div>
            <Link
              to={`/book-class/${id}`}
              onClick={handleClick}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245c43]"
            >
              Enroll now <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
