import { ChevronDown } from 'lucide-react'
import { posthog } from '../lib/posthog'

function highlight(text, query) {
  if (!query || !query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const lowerQuery = query.toLowerCase()
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === lowerQuery
      ? <mark key={i} className="bg-[#B7E4C7] rounded px-0.5 not-italic">{part}</mark>
      : part
  )
}

export default function FAQAccordion({ question, answer, isOpen, onToggle, searchQuery = '' }) {
  const handleToggle = () => {
    if (!isOpen) {
      // Always track the raw question string, never the highlighted JSX.
      posthog.capture('faq_opened', { question })
    }
    onToggle()
  }

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-[#1A1A2E] text-base leading-snug">{highlight(question, searchQuery)}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[#2D6A4F] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Animated answer panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#FAFAF8] rounded-xl px-4 py-3 mb-3">
          <p className="text-sm text-[#374151] leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}
