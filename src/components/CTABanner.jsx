import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * Reusable dark-green CTA banner section.
 * Used on Blog and FAQs pages.
 *
 * @param {Object} props
 * @param {string} props.title - Main CTA heading
 * @param {string} props.subtitle - Supporting text
 * @param {string} props.linkTo - Route to navigate to
 * @param {string} props.linkLabel - Button label
 */
export default function CTABanner({ title, subtitle, linkTo, linkLabel }) {
  return (
    <section className="bg-[#2D6A4F] py-12 mt-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-white font-['Playfair_Display'] text-xl md:text-2xl font-bold leading-snug">
            {title}
          </p>
          <p className="text-[#B7E4C7] text-sm mt-1">
            {subtitle}
          </p>
        </div>
        <Link
          to={linkTo}
          className="flex-shrink-0 flex items-center gap-2 bg-white text-[#2D6A4F] font-semibold px-6 py-3 rounded-xl hover:bg-[#E1F5EE] transition-colors text-sm"
        >
          {linkLabel}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
