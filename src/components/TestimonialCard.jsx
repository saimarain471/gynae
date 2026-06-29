import StarRating from './StarRating'

function getInitials(name = '') {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function TestimonialCard({
  patient_name,
  city,
  rating,
  review_text,
  service_type,
  created_at,
  featured,
  // Legacy props from static Home.jsx data (name, title, quote)
  name,
  title,
  quote,
}) {
  // Support both real Supabase data and old static props
  const displayName = patient_name || name || 'Anonymous'
  const displayReview = review_text || quote || ''
  const displayRating = rating || 5
  const displayCity = city || title || ''
  const displayService = service_type || ''

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-PK', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <article
      className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all duration-200 flex flex-col gap-3 ${
        featured ? 'border-l-4 border-l-[#52B788] border-gray-100' : 'border-gray-100'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2D6A4F] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
            {getInitials(displayName)}
          </div>
          <div>
            <p className="font-semibold text-[#1A1A2E] text-sm leading-tight">{displayName}</p>
            {displayCity && (
              <p className="text-xs text-[#6B7280]">{displayCity}</p>
            )}
          </div>
        </div>
        {displayService && (
          <span className="flex-shrink-0 bg-[#E1F5EE] text-[#2D6A4F] text-xs px-2 py-0.5 rounded-full font-medium">
            {displayService}
          </span>
        )}
      </div>

      {/* Star rating */}
      <StarRating rating={displayRating} size={14} />

      {/* Review text */}
      <p className="text-sm text-[#374151] leading-relaxed line-clamp-4 flex-1">
        &ldquo;{displayReview}&rdquo;
      </p>

      {/* Date */}
      {created_at && (
        <p className="text-xs text-[#6B7280] mt-1">{formatDate(created_at)}</p>
      )}
    </article>
  )
}
