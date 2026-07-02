import { useEffect, useRef, useState } from 'react'
import { Loader2, CalendarX } from 'lucide-react'

export default function CalcomEmbed({
  calLink,
  namespace,
  onBookingSuccess,
  duration = 30,
  label = 'Select a time slot',
}) {
  const [status, setStatus] = useState('loading')
  const containerRef = useRef(null)

  useEffect(() => {
    if (!calLink) {
      setStatus('error')
      return
    }

    const existingScript = document.getElementById(`cal-script-${namespace}`)
    if (existingScript) existingScript.remove()

    if (window.Cal) {
      try {
        window.Cal('destroy', { namespace })
      } catch (e) {
        // ignore destroy errors
      }
    }

    const script = document.createElement('script')
    script.id = `cal-script-${namespace}`
    script.async = true
    script.src = 'https://app.cal.com/embed/embed.js'

    script.onload = () => {
      try {
        window.Cal('init', namespace, {
          origin: 'https://app.cal.com',
        })

        window.Cal.ns[namespace]('inline', {
          elementOrSelector: `#cal-embed-${namespace}`,
          config: {
            layout: 'month_view',
            theme: 'light',
          },
          calLink,
        })

        window.Cal.ns[namespace]('ui', {
          theme: 'light',
          styles: { branding: { brandColor: '#2D6A4F' } },
          hideEventTypeDetails: false,
          layout: 'month_view',
        })

        window.Cal.ns[namespace]('on', {
          action: 'bookingSuccessful',
          callback: (event) => {
            if (onBookingSuccess) {
              onBookingSuccess(event.detail?.data || {})
            }
          },
        })

        setStatus('ready')
      } catch (err) {
        console.error('Cal.com init error:', err)
        setStatus('error')
      }
    }

    script.onerror = () => {
      console.error('Cal.com script failed to load')
      setStatus('error')
    }

    document.body.appendChild(script)

    return () => {
      const s = document.getElementById(`cal-script-${namespace}`)
      if (s) s.remove()
      if (window.Cal?.ns?.[namespace]) {
        try {
          window.Cal('destroy', { namespace })
        } catch (e) {
          // ignore destroy errors
        }
      }
    }
  }, [calLink, namespace, onBookingSuccess])

  if (status === 'error' || !calLink) {
    return (
      <div className="bg-[#FFF8F0] border border-[#F4A261]/30 rounded-2xl p-6 text-center">
        <CalendarX size={28} className="text-[#F4A261] mx-auto mb-2" />
        <p className="text-sm font-medium text-[#1A1A2E]">Live calendar is not configured yet</p>
        <p className="text-xs text-[#6B7280] mt-1 max-w-xs mx-auto">
          Please select your preferred date and time in the form below.
          Dr. Zainab will confirm your slot on WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-[#FAFAF8] flex items-center justify-between">
        <span className="text-sm font-medium text-[#1A1A2E]">{label}</span>
        <span className="text-xs text-[#6B7280]">{duration} min session</span>
      </div>

      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Loader2 size={24} className="text-[#52B788] animate-spin" />
          <p className="text-xs text-[#6B7280]">Loading available times...</p>
        </div>
      )}

      <div
        id={`cal-embed-${namespace}`}
        ref={containerRef}
        className={status === 'ready' ? 'block' : 'hidden'}
        style={{ minHeight: '500px', width: '100%' }}
      />
    </div>
  )
}
