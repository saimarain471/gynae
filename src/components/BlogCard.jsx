import { Link } from 'react-router-dom'
import { Clock, Heart, Star, BookOpen, Baby } from 'lucide-react'

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

export default function BlogCard({ id, title, slug, excerpt, category, author, read_time, created_at, cover_image_url }) {
  const style = categoryStyles[category] || categoryStyles.General
  const Icon = style.icon

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Link
      to={`/blog/${slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200"
    >
      {/* Cover image / gradient area */}
      <div className="h-44 overflow-hidden rounded-t-xl">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full ${style.gradient} flex items-center justify-center`}>
            <Icon size={32} color="#2D6A4F" />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2">
        {/* Category badge */}
        <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}>
          {category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-[#1A1A2E] text-base leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[#6B7280] mt-1 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <span className="text-xs text-[#6B7280]">{author}</span>
          <div className="flex items-center gap-1 text-[#6B7280]">
            <Clock size={12} />
            <span className="text-xs">{read_time} min read</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
