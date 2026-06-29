import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { buildWhatsAppUrl } from '../lib/whatsapp'

const QUICK_MESSAGES = [
  { label: 'Enroll in a class', text: 'Assalam o Alaikum Dr. Zainub! I want to enroll in one of your online classes. Please guide me.' },
  { label: 'Book a consultation', text: 'Assalam o Alaikum Dr. Zainub! I would like to book a 1-on-1 consultation. Please let me know availability.' },
  { label: 'Payment confirmation', text: 'Assalam o Alaikum Dr. Zainub! I have made the payment and would like to confirm my booking.' },
  { label: 'General question', text: 'Assalam o Alaikum Dr. Zainub! I have a question about your services.' },
]

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 2000)
    const pulseTimer = setTimeout(() => setPulse(false), 6000)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(pulseTimer)
    }
  }, [])

  const openWhatsApp = (message) => {
    window.open(buildWhatsAppUrl(message), '_blank')
    setIsOpen(false)
  }

  if (!isVisible) return null

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center gap-3 bg-[#2D6A4F] px-4 py-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                <span className="text-sm font-semibold text-white">ZM</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight text-white">Dr. Zainub Mohsin</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-300" />
                  <p className="text-xs text-green-100">Typically replies within a few hours</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-1 text-white/70 transition-colors hover:text-white"
                aria-label="Close WhatsApp popup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3">
              <p className="mb-2 px-1 text-xs font-medium text-gray-400">How can we help you?</p>
              <div className="flex flex-col gap-2">
                {QUICK_MESSAGES.map((msg) => (
                  <button
                    key={msg.label}
                    onClick={() => openWhatsApp(msg.text)}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-left text-sm leading-snug text-gray-700 transition-all duration-150 hover:border-[#52B788] hover:bg-[#E1F5EE] hover:text-[#2D6A4F]"
                  >
                    {msg.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-gray-300">Powered by WhatsApp</p>
            </div>
          </div>
        )}

        <div className="relative">
          {pulse && !isOpen && (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
              <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20 [animation-delay:0.3s]" />
            </>
          )}

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${isOpen ? 'scale-95 rotate-0 bg-gray-600' : 'bg-[#25D366] hover:scale-110 hover:bg-[#20c05a]'}`}
            aria-label={isOpen ? 'Close WhatsApp menu' : 'Chat on WhatsApp'}
          >
            {isOpen ? (
              <X size={22} className="text-white" />
            ) : (
              <svg viewBox="0 0 32 32" width="26" height="26" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M16.004 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.34.632 4.629 1.83 6.63L2.667 29.333l6.87-1.802A13.284 13.284 0 0 0 16.004 29.333c7.363 0 13.329-5.97 13.329-13.333S23.367 2.667 16.004 2.667zm0 24.267a11.002 11.002 0 0 1-5.628-1.547l-.403-.24-4.075 1.07 1.088-3.966-.264-.41A10.968 10.968 0 0 1 5.001 16c0-6.065 4.935-11 11.003-11 6.065 0 10.997 4.935 10.997 11s-4.932 10.934-10.997 10.934zm6.04-8.217c-.33-.165-1.95-.963-2.253-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.044 1.293-.193.22-.385.247-.714.082-.33-.165-1.393-.513-2.654-1.636-.98-.874-1.643-1.952-1.835-2.282-.193-.33-.02-.508.145-.672.149-.148.33-.385.495-.577.165-.193.22-.33.33-.55.11-.22.055-.412-.027-.577-.083-.165-.743-1.793-1.018-2.454-.268-.644-.54-.557-.743-.567l-.633-.011c-.22 0-.577.082-.88.412-.302.33-1.155 1.128-1.155 2.75s1.183 3.19 1.348 3.41c.165.22 2.327 3.554 5.64 4.985.789.34 1.404.543 1.884.695.79.252 1.51.216 2.079.131.634-.094 1.95-.797 2.226-1.567.275-.77.275-1.43.193-1.567-.083-.137-.303-.22-.633-.385z" />
              </svg>
            )}
          </button>

          {!isOpen && (
            <div className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 lg:block">
              Chat with us
              <span className="absolute right-0 top-1/2 h-2 w-2 rotate-45 bg-gray-900 translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
