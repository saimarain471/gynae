import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 16, interactive = false, onRate = null }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={interactive && onRate ? () => onRate(star) : undefined}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
          tabIndex={interactive ? 0 : -1}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
        >
          <Star
            size={size}
            fill={star <= rating ? '#F4A261' : 'none'}
            color={star <= rating ? '#F4A261' : '#D1D5DB'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}
