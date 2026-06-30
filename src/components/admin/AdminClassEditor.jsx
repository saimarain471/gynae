import { useEffect, useMemo, useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { createClass, updateClass } from '../../lib/adminApi'

const defaultPaymentMethods = [
  { method: 'JazzCash', value: '0300-0000000', details: 'Zainab Mohsin', subtitle: '', active: true },
  { method: 'EasyPaisa', value: '0301-0000000', details: 'Zainab Mohsin', subtitle: '', active: true },
  { method: 'Bank Transfer', value: 'PK00HABB0000001234567890', details: 'Dr. Zainab Mohsin', subtitle: 'IBAN', active: true },
]

const defaultForm = {
  title: '',
  description: '',
  price: '',
  discount_price: '',
  modules: 1,
  duration: '',
  teacher: 'Dr. Zainab Mohsin',
  language: 'Urdu/English',
  thumbnail_url: '',
  category: 'Prenatal',
  seats_total: 50,
  start_date: '',
  end_date: '',
  certificate: false,
  visible: true,
  featured: false,
  cal_link: '',
  payment_methods: defaultPaymentMethods,
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F9FAFB] px-4 py-3">
      <span className="text-sm font-medium text-[#1A1A2E]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#2D6A4F]' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export default function AdminClassEditor({ classData, mode, onClose, onSaved }) {
  const [form, setForm] = useState(defaultForm)
  const [slots, setSlots] = useState(classData?.schedule_slots || [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (classData) {
      setForm({
        title: classData.title || '',
        description: classData.description || '',
        price: classData.price || '',
        discount_price: classData.discount_price || '',
        modules: classData.modules || classData.lessons || 1,
        duration: classData.duration || '',
        teacher: classData.teacher || 'Dr. Zainab Mohsin',
        language: classData.language || 'Urdu/English',
        thumbnail_url: classData.thumbnail_url || '',
        category: classData.category || 'Prenatal',
        seats_total: classData.seats_total || 50,
        start_date: classData.start_date || '',
        end_date: classData.end_date || '',
        certificate: Boolean(classData.certificate),
        visible: classData.visible !== false,
        featured: Boolean(classData.featured),
        cal_link: classData.cal_link || '',
        payment_methods: Array.isArray(classData.payment_methods) && classData.payment_methods.length > 0 ? classData.payment_methods : defaultPaymentMethods,
      })
      setSlots(classData.schedule_slots || [])
    } else {
      setForm(defaultForm)
      setSlots([])
    }
  }, [classData])

  const titleText = useMemo(() => (mode === 'create' ? 'Add New Class' : 'Edit Class'), [mode])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateSlot = (index, field, value) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const addSlot = () => {
    setSlots((prev) => [...prev, { day: 'Saturday', time: '6:00 PM' }])
  }

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const updatePaymentMethod = (index, field, value) => {
    setForm((prev) => {
      const next = [...prev.payment_methods]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, payment_methods: next }
    })
  }

  const togglePaymentMethodActive = (index) => {
    setForm((prev) => {
      const next = [...prev.payment_methods]
      next[index] = { ...next[index], active: !next[index].active }
      return { ...prev, payment_methods: next }
    })
  }

  const addPaymentMethod = () => {
    setForm((prev) => ({
      ...prev,
      payment_methods: [...prev.payment_methods, { method: '', value: '', details: '', subtitle: '', active: true }],
    }))
  }

  const removePaymentMethod = (index) => {
    setForm((prev) => ({
      ...prev,
      payment_methods: prev.payment_methods.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const createSlug = (title) => {
    const base = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '')
    return `${base || 'class'}-${Date.now()}`
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price) || 0,
        discount_price: form.discount_price ? Number(form.discount_price) : null,
        modules: Number(form.modules) || 1,
        duration: form.duration.trim(),
        teacher: form.teacher.trim() || 'Dr. Zainab Mohsin',
        language: form.language.trim() || 'Urdu/English',
        thumbnail_url: form.thumbnail_url.trim() || null,
        seats_total: Number(form.seats_total) || 50,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        certificate: Boolean(form.certificate),
        visible: Boolean(form.visible),
        featured: Boolean(form.featured),
        schedule_slots: slots,
        cal_link: form.cal_link.trim() || null,
        payment_methods: Array.isArray(form.payment_methods) ? form.payment_methods : defaultPaymentMethods,
      }

      if (mode === 'edit' && classData?.id) {
        await updateClass({ id: classData.id, ...payload })
      } else {
        await createClass(payload)
      }

      setSaved(true)
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message || 'Unable to save class.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full bg-white shadow-2xl sm:w-[480px]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1A1A2E]">{titleText}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-[#6B7280] transition hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-140px)] overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Title</label>
              <input value={form.title} onChange={(e) => updateField('title', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Description</label>
              <textarea rows="4" value={form.description} onChange={(e) => updateField('description', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Price (PKR)</label>
                <input type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Discount Price</label>
                <input type="number" value={form.discount_price} onChange={(e) => updateField('discount_price', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                <p className="text-[11px] text-[#6B7280]">Leave empty for no discount.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Modules</label>
                <input type="number" value={form.modules} onChange={(e) => updateField('modules', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Duration</label>
                <input value={form.duration} onChange={(e) => updateField('duration', e.target.value)} placeholder="e.g. 8 Weeks or 6 hours" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Teacher</label>
                <input value={form.teacher} onChange={(e) => updateField('teacher', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Language</label>
                <input value={form.language} onChange={(e) => updateField('language', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Thumbnail URL</label>
              <input value={form.thumbnail_url} onChange={(e) => updateField('thumbnail_url', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Category</label>
                <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]">
                  <option value="Prenatal">Prenatal</option>
                  <option value="Postnatal">Postnatal</option>
                  <option value="Baby Care">Baby Care</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Total seats</label>
                <input type="number" value={form.seats_total} onChange={(e) => updateField('seats_total', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">Start Date</label>
                <input type="date" value={form.start_date} onChange={(e) => updateField('start_date', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">End Date</label>
                <input type="date" value={form.end_date} onChange={(e) => updateField('end_date', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              </div>
            </div>

            <ToggleRow label="Certificate included" value={form.certificate} onChange={(val) => updateField('certificate', val)} />
            <ToggleRow label="Visible on website" value={form.visible} onChange={(val) => updateField('visible', val)} />
            <ToggleRow label="Featured" value={form.featured} onChange={(val) => updateField('featured', val)} />

            <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1A1A2E]">Class Schedule</h3>
                <span className="text-[11px] text-[#6B7280]">Independent slots</span>
              </div>
              <p className="mb-3 text-xs text-[#6B7280]">Each class has its own schedule and is separate from consultations.</p>
              <div className="flex flex-col gap-2">
                {slots.map((slot, index) => (
                  <div key={`${slot.day}-${index}`} className="flex items-center gap-2">
                    <select value={slot.day} onChange={(e) => updateSlot(index, 'day', e.target.value)} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <input value={slot.time || ''} onChange={(e) => updateSlot(index, 'time', e.target.value)} placeholder="6:00 PM" className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                    <button type="button" onClick={() => removeSlot(index)} className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addSlot} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#2D6A4F]">
                <Plus size={14} /> Add another slot
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Cal.com booking link (optional)</label>
              <input value={form.cal_link} onChange={(e) => updateField('cal_link', e.target.value)} placeholder="drzainab/pregnancy-week-by-week" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
              <p className="text-[11px] text-[#6B7280]">If set, this overrides the manual schedule above with live availability.</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1A1A2E]">Class Payment Methods</h3>
                <button type="button" onClick={addPaymentMethod} className="rounded-xl bg-[#2D6A4F] px-3 py-2 text-xs font-semibold text-white">
                  <Plus size={14} /> Add payment method
                </button>
              </div>
              <p className="mb-3 text-xs text-[#6B7280]">These payment methods will be shown for this class only.</p>
              <div className="space-y-3">
                {form.payment_methods.map((method, index) => (
                  <div key={`${method.method}-${index}`} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#1A1A2E]">Method</label>
                        <input value={method.method} onChange={(e) => updatePaymentMethod(index, 'method', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#1A1A2E]">Account/ID</label>
                        <input value={method.value} onChange={(e) => updatePaymentMethod(index, 'value', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#1A1A2E]">Details</label>
                        <input value={method.details} onChange={(e) => updatePaymentMethod(index, 'details', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#1A1A2E]">Subtitle</label>
                        <input value={method.subtitle} onChange={(e) => updatePaymentMethod(index, 'subtitle', e.target.value)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => togglePaymentMethodActive(index)} className={`rounded-xl px-3 py-2 text-xs font-semibold ${method.active ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
                        {method.active ? 'Active' : 'Inactive'}
                      </button>
                      <button type="button" onClick={() => removePaymentMethod(index)} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-[#6B7280]">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="flex-1 rounded-xl bg-[#2D6A4F] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? 'Saving...' : mode === 'create' ? 'Create Class' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-4 right-4 z-[60] rounded-xl border border-[#16A34A]/20 bg-[#DCFCE7] px-4 py-3 text-sm font-medium text-[#166534] shadow-lg">
          Saved!
        </div>
      )}
    </div>
  )
}
