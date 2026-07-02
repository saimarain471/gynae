import { useEffect, useState } from 'react'
import { Plus, Trash2, Calendar, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { SmoothInput } from '../SmoothInput'
import { normalizeCalLink } from '../../hooks/useSiteSettings'

const defaultPaymentMethods = [
  { method: 'JazzCash', value: '0300-0000000', details: 'Zainab Mohsin', subtitle: '', active: true },
  { method: 'EasyPaisa', value: '0301-0000000', details: 'Zainab Mohsin', subtitle: '', active: true },
  { method: 'Bank Transfer', value: 'PK00HABB0000001234567890', details: 'Dr. Zainab Mohsin', subtitle: 'IBAN', active: true },
]

export default function AdminSettings({ refreshKey = 0 }) {
  const [siteSettingsId, setSiteSettingsId] = useState(null)
  const [consultationFee, setConsultationFee] = useState('2000')
  const [consultationCalLink, setConsultationCalLink] = useState('')
  const [paymentMethods, setPaymentMethods] = useState(defaultPaymentMethods)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingCalLink, setSavingCalLink] = useState(false)
  const [calLinkSuccess, setCalLinkSuccess] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSettings() {
      setLoading(true)
      setError('')
      try {
        const { data, error } = await supabase.from('site_settings').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle()
        if (!isMounted) return
        if (error) throw error

        if (data) {
          setSiteSettingsId(data.id)
          setConsultationFee(String(data.consultation_fee ?? 2000))
          setConsultationCalLink(typeof data.consultation_cal_link === 'string' ? data.consultation_cal_link.replace(/^"|"$/g, '') : data.consultation_cal_link || '')
          setPaymentMethods(Array.isArray(data.payment_methods) && data.payment_methods.length > 0 ? data.payment_methods : defaultPaymentMethods)
        } else {
          setSiteSettingsId(null)
          setConsultationFee('2000')
          setPaymentMethods(defaultPaymentMethods)
        }
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Unable to load settings.')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    loadSettings()
    return () => {
      isMounted = false
    }
  }, [refreshKey])

  const updateMethod = (index, field, value) => {
    setPaymentMethods((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)))
  }

  const toggleMethodActive = (index) => {
    setPaymentMethods((prev) => prev.map((item, idx) => (idx === index ? { ...item, active: !item.active } : item)))
  }

  const addMethod = () => {
    setPaymentMethods((prev) => [...prev, { method: '', value: '', details: '', subtitle: '', active: true }])
  }

  const removeMethod = (index) => {
    setPaymentMethods((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    const fee = Number(consultationFee || 0)
    if (!fee || fee <= 0) {
      setError('Consultation fee must be a valid positive number.')
      setSaving(false)
      return false
    }

    const payload = {
      consultation_fee: fee,
      consultation_cal_link: normalizeCalLink(consultationCalLink),
      payment_methods: paymentMethods,
      updated_at: new Date().toISOString(),
    }

    try {
      if (siteSettingsId) {
        const { error } = await supabase.from('site_settings').update(payload).eq('id', siteSettingsId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('site_settings').insert([payload])
        if (error) throw error
        if (data && data[0]?.id) {
          setSiteSettingsId(data[0].id)
        }
      }
      setSuccess('Settings saved successfully.')
      setTimeout(() => setSuccess(''), 3000)
      return true
    } catch (err) {
      setError(err.message || 'Unable to save settings.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCalLink = async () => {
    setSavingCalLink(true)
    setCalLinkSuccess(false)
    const saved = await handleSave()
    setSavingCalLink(false)
    if (saved) {
      setCalLinkSuccess(true)
      setTimeout(() => setCalLinkSuccess(false), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#1A1A2E]">Booking & Payment Settings</h2>
        <p className="mt-2 text-sm text-[#6B7280]">Configure consultation pricing and accepted payment accounts centrally.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#1A1A2E]">Consultation fee (PKR)</label>
            <SmoothInput
              type="number"
              min="1"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-[#1A1A2E] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
            />
          </div>
          <div className="rounded-3xl border border-[#E1F5EE] bg-[#F9FAFB] p-4">
            <p className="text-sm font-semibold text-[#1A1A2E]">Live preview</p>
            <p className="mt-2 text-sm text-[#6B7280]">This amount is shown across booking and marketing content.</p>
            <div className="mt-4 rounded-3xl bg-white p-4 text-center text-sm font-semibold text-[#2D6A4F] shadow-sm">
              PKR {Number(consultationFee || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Payment method list</h3>
            <p className="mt-1 text-sm text-[#6B7280]">Add, edit, or disable payment accounts used across booking pages.</p>
          </div>
          <button type="button" onClick={addMethod} className="inline-flex items-center gap-2 rounded-full bg-[#2D6A4F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#245c43]">
            <Plus size={16} /> Add method
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="rounded-3xl border border-gray-100 bg-[#FAFAF8] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
                  <label className="flex flex-col gap-2 text-sm font-medium text-[#1A1A2E]">
                    Method name
                    <SmoothInput
                      value={method.method}
                      onChange={(e) => updateMethod(index, 'method', e.target.value)}
                      placeholder="JazzCash"
                      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[#1A1A2E]">
                    Account number / ID
                    <SmoothInput
                      value={method.value}
                      onChange={(e) => updateMethod(index, 'value', e.target.value)}
                      placeholder="0300-0000000"
                      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[#1A1A2E]">
                    Details / name
                    <SmoothInput
                      value={method.details}
                      onChange={(e) => updateMethod(index, 'details', e.target.value)}
                      placeholder="Dr. Zainab Mohsin"
                      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[#1A1A2E]">
                    Subtitle
                    <SmoothInput
                      value={method.subtitle}
                      onChange={(e) => updateMethod(index, 'subtitle', e.target.value)}
                      placeholder="IBAN"
                      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleMethodActive(index)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${method.active ? 'bg-[#2D6A4F] text-white' : 'bg-gray-200 text-[#6B7280]'}`}
                  >
                    {method.active ? 'Active' : 'Disabled'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMethod(index)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center justify-center rounded-2xl bg-[#2D6A4F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      </div>
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
            <Calendar size={16} className="text-[#4F46E5]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#1A1A2E] text-base">Consultation — Cal.com Booking Link</h2>
            <p className="text-xs text-[#6B7280]">Paste the consultation event slug here so the live calendar shows on the booking page.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-[#1A1A2E]">Cal.com Link</label>
          <SmoothInput
            value={consultationCalLink}
            onChange={(e) => setConsultationCalLink(e.target.value)}
            placeholder="drzainabmohsin/consultation"
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
          />
          <p className="text-xs text-[#6B7280] mt-1">
            Format: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">your-username/event-slug</span> — do NOT include https:// or cal.com/
          </p>
          {consultationCalLink && (
            <a
              href={`https://cal.com/${consultationCalLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#4F46E5] underline"
            >
              Preview: cal.com/{consultationCalLink} →
            </a>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-indigo-100 bg-[#F0F4FF] p-3 text-xs text-[#4F46E5]">
          <p className="font-medium">How to get your Cal.com link:</p>
          <ol className="mt-2 flex list-decimal flex-col gap-1 pl-4 text-[#334155]">
            <li>Go to app.cal.com and log in</li>
            <li>Click Event Types and open your consultation event</li>
            <li>Copy the event slug, not the full URL</li>
            <li>It should look like: <span className="font-mono">drzainabmohsin/consultation</span></li>
            <li>Paste it above and click Save</li>
          </ol>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveCalLink}
            disabled={savingCalLink || !consultationCalLink.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2D6A4F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {savingCalLink ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={14} /> Save Cal.com Link
              </>
            )}
          </button>
          {calLinkSuccess && (
            <span className="text-sm text-[#16A34A] flex items-center gap-1">
              <CheckCircle2 size={14} /> Saved! Live on consultation page now.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

