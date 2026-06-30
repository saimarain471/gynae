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
}

export function getActivePaymentMethods(settings = defaultSettings) {
  return (settings?.payment_methods || defaultPaymentMethods).filter((method) => method.active)
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSettings() {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (!isMounted) return

      if (fetchError) {
        setError(fetchError.message)
        setSettings(defaultSettings)
      } else if (data) {
        setSettings({
          consultation_fee: data.consultation_fee ?? defaultSettings.consultation_fee,
          payment_methods: Array.isArray(data.payment_methods) ? data.payment_methods : defaultSettings.payment_methods,
        })
      } else {
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
