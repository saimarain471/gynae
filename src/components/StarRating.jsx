import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 16, interactive = false, onRate = null }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role={interactive ? undefined : 'img'}
      aria-label={interactive ? undefined : `Rated ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const icon = (
          <Star
            size={size}
            fill={star <= rating ? '#F4A261' : 'none'}
            color={star <= rating ? '#F4A261' : '#D1D5DB'}
            strokeWidth={1.5}
          />
        )

        // Non-interactive: render a decorative span so screen readers
        // announce the single aria-label above, not five buttons.
        if (!interactive) {
          return (
            <span key={star} aria-hidden="true">
              {icon}
            </span>
          )
        }

        return (
          <button
            key={star}
            type="button"
            onClick={onRate ? () => onRate(star) : undefined}
            className="cursor-pointer transition-transform hover:scale-110"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}
