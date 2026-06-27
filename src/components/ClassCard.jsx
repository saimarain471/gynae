import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { posthog } from '../lib/posthog'

export default function ClassCard({ classData }) {
  const { id, title, category, description, duration, lessons, priceLabel } = classData

  const handleClick = () => {
    posthog.capture('class_card_clicked', { classId: id, classTitle: title })
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {category}
        </span>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{priceLabel}</span>
      </div>
      <h3 className="text-xl font-semibold text-text">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-text-muted">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm text-text-muted">
        <span>{duration}</span>
        <span>·</span>
        <span>{lessons} lessons</span>
      </div>
      <Link
        to={`/book-class/${id}`}
        onClick={handleClick}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
      >
        Enroll Now <ChevronRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
