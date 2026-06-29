/**
 * Reusable sticky category filter bar with pill-shaped buttons.
 * Used on Blog, Testimonials, and FAQs pages.
 *
 * @param {Object} props
 * @param {string[]} props.categories - List of category labels
 * @param {string} props.active - Currently active category
 * @param {(category: string) => void} props.onChange - Called when user selects a category
 */
export default function CategoryFilterBar({ categories, active, onChange }) {
  return (
    <div className="sticky top-16 z-30 bg-[#FAFAF8] border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                active === cat
                  ? 'bg-[#2D6A4F] text-white shadow-sm'
                  : 'bg-white text-[#6B7280] border border-gray-200 hover:border-[#52B788]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
