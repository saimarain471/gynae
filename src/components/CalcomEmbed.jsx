import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { Loader2, AlertCircle, CalendarX } from 'lucide-react'

export default function CalcomEmbed({
  calLink,
  namespace,
  onBookingSuccess,
  duration = 30,
  label = 'Select a time slot',
}) {
  const [loaded, setLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!calLink) {
      setHasError(true)
      return
    }

    let isMounted = true

    ;(async function initCal() {
      try {
        const cal = await getCalApi({ namespace })

        cal('ui', {
          theme: 'light',
          styles: {
            branding: { brandColor: '#2D6A4F' },
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        })

        cal('on', {
          action: 'bookingSuccessful',
          callback: (event) => {
            if (onBookingSuccess) {
              onBookingSuccess(event.detail.data)
            }
          },
        })

        if (isMounted) setLoaded(true)
      } catch (err) {
        console.error('Cal.com embed failed to load:', err)
        if (isMounted) setHasError(true)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [calLink, namespace, onBookingSuccess])

  if (hasError || !calLink) {
    return (
      <div className="rounded-2xl border border-[#F4A261]/30 bg-[#FFF8F0] p-6 text-center">
        <CalendarX size={28} className="mx-auto mb-2 text-[#F4A261]" />
        <p className="text-sm font-medium text-[#1A1A2E]">Calendar temporarily unavailable</p>
        <p className="mt-1 text-xs text-[#6B7280]">
          Please use the form below and Dr. Zainab will confirm your preferred time via WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 bg-[#FAFAF8] px-5 py-3">
        <span className="text-sm font-medium text-[#1A1A2E]">{label}</span>
        <span className="text-xs text-[#6B7280]">{duration} min session</span>
      </div>

      {!loaded && (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <Loader2 size={24} className="animate-spin text-[#52B788]" />
          <p className="text-xs text-[#6B7280]">Loading available times...</p>
        </div>
      )}

      <div className={loaded ? 'block' : 'hidden'}>
        <Cal
          namespace={namespace}
          calLink={calLink}
          style={{ width: '100%', height: '100%', minHeight: '500px', overflow: 'auto' }}
          config={{
            theme: 'light',
            layout: 'month_view',
          }}
        />
      </div>
    </div>
  )
}
