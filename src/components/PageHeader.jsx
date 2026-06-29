/**
 * Reusable page header section with green background.
 * Used on Blog, Testimonials, and FAQs pages.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.icon - Lucide icon element
 * @param {string} props.badge - Badge/label text (e.g. "Expert Insights")
 * @param {string} props.title - Main heading
 * @param {string} props.description - Description text
 * @param {import('react').ReactNode} [props.children] - Additional content below description
 */
export default function PageHeader({ icon, badge, title, description, children }) {
  return (
    <section className="bg-[#E1F5EE] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-widest text-[#52B788]">
            {badge}
          </span>
        </div>
        <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A2E] leading-tight">
          {title}
        </h1>
        <p className="mt-3 text-[#6B7280] text-base max-w-xl leading-relaxed">
          {description}
        </p>
        {children}
      </div>
    </section>
  )
}
