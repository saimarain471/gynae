import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 16, interactive = false, onRate = null }) {
  if (!interactive) {
    return (
      <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="cursor-default">
            <Star
              size={size}
              fill={star <= rating ? '#F4A261' : 'none'}
              color={star <= rating ? '#F4A261' : '#D1D5DB'}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={onRate ? () => onRate(star) : undefined}
          className="cursor-pointer transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            fill={star <= rating ? '#F4A261' : 'none'}
            color={star <= rating ? '#F4A261' : '#D1D5DB'}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  )
}
