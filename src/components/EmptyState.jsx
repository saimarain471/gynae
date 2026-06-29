/**
 * Reusable empty state / no-results component.
 * Used across Blog, Testimonials, and FAQs pages.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.icon - Lucide icon element for the circle
 * @param {string} props.title - Primary message (e.g. "No posts in this category yet")
 * @param {string} [props.subtitle] - Secondary message
 * @param {string} [props.actionLabel] - Label for the reset button
 * @param {() => void} [props.onAction] - Called when the reset button is clicked
 */
export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center mb-2">
        {icon}
      </div>
      <p className="text-[#1A1A2E] font-semibold text-lg">{title}</p>
      {subtitle && <p className="text-[#6B7280] text-sm">{subtitle}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 text-[#2D6A4F] text-sm font-medium underline underline-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
