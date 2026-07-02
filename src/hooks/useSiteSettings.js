import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const defaultPaymentMethods = [
  {
    method: 'JazzCash',
    value: '0300-0000000',
    details: 'Zainab Mohsin',
    subtitle: '',
    active: true,
  },
  {
    method: 'EasyPaisa',
    value: '0301-0000000',
    details: 'Zainab Mohsin',
    subtitle: '',
    active: true,
  },
  {
    method: 'Bank Transfer',
    value: 'PK00HABB0000001234567890',
    details: 'Dr. Zainab Mohsin',
    subtitle: 'IBAN',
    active: true,
  },
]

const defaultSettings = {
  consultation_fee: 2000,
  payment_methods: defaultPaymentMethods,
  about_bio_text: "Dr. Zainub Mohsin is a consultant gynecologist and women's health educator helping mothers prepare for pregnancy, birth, and newborn care with clarity and confidence.",
}

export function getActivePaymentMethods(settings = defaultSettings) {
  return (settings?.payment_methods || defaultPaymentMethods).filter((method) => method.active)
}

let cachedSettings = null;
let fetchPromise = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState(cachedSettings || defaultSettings)
  const [loading, setLoading] = useState(!cachedSettings)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSettings() {
      if (cachedSettings) {
        setSettings(cachedSettings)
        setLoading(false)
        return
      }

      if (!fetchPromise) {
        fetchPromise = supabase
          .from('site_settings')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      }

      setLoading(true)
      const { data, error: fetchError } = await fetchPromise

      if (!isMounted) return

      if (fetchError) {
        setError(fetchError.message)
        setSettings(defaultSettings)
        fetchPromise = null // Reset promise on error so it can be retried
      } else if (data) {
        const newSettings = {
          consultation_fee: data.consultation_fee ?? defaultSettings.consultation_fee,
          payment_methods: Array.isArray(data.payment_methods) ? data.payment_methods : defaultSettings.payment_methods,
          about_bio_text: data.about_bio_text ?? defaultSettings.about_bio_text,
        }
        cachedSettings = newSettings
        setSettings(newSettings)
      } else {
        cachedSettings = defaultSettings
        setSettings(defaultSettings)
      }

      setLoading(false)
    }

    loadSettings()
    return () => {
      isMounted = false
    }
  }, [])

  return { settings, loading, error }
}
