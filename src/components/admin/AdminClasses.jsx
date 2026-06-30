import { useEffect, useState } from 'react'
import { Plus, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminClassEditor from './AdminClassEditor'

const bannerStyles = {
  Prenatal: 'from-[#2D6A4F] to-[#52B788]',
  Postnatal: 'from-[#F4A261] to-[#e8894a]',
  'Baby Care': 'from-[#7C3AED] to-[#9F67FA]',
}

export default function AdminClasses({ refreshKey = 0 }) {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState('create')
  const [activeClass, setActiveClass] = useState(null)
  const [error, setError] = useState('')

  async function fetchClasses() {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.from('classes').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setClasses(data || [])
    } catch (err) {
      setError(err.message || 'Unable to load classes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [refreshKey])

  const openCreate = () => {
    setActiveClass(null)
    setEditorMode('create')
    setEditorOpen(true)
  }

  const openEdit = (item) => {
    setActiveClass(item)
    setEditorMode('edit')
    setEditorOpen(true)
  }

  const handleSaved = () => {
    fetchClasses()
  }

  const toggleVisible = async (classItem) => {
    const { error } = await supabase.from('classes').update({ visible: !classItem.visible }).eq('id', classItem.id)
    if (!error) {
      fetchClasses()
    }
  }

  const removeClass = async (classItem) => {
    if (!window.confirm(`Delete “${classItem.title}”?`)) return
    const { error } = await supabase.from('classes').delete().eq('id', classItem.id)
    if (!error) {
      fetchClasses()
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A2E]">Manage Classes</h2>
          <p className="text-sm text-[#6B7280]">Create, update, hide, and remove classes without editing code.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-4 py-2.5 text-sm font-medium text-white">
          <Plus size={16} /> Add New Class
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {Array(4).fill(0).map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4">
              <div className="h-20 rounded-xl bg-gray-200" />
              <div className="mt-4 h-4 w-2/3 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-full rounded bg-gray-100" />
              <div className="mt-2 h-3 w-4/5 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {classes.map((item) => {
            const progress = Math.min(100, (((item.seats_taken || 0) / Math.max(1, item.seats_total || 1)) * 100))
            return (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <div className={`relative h-20 bg-gradient-to-r ${bannerStyles[item.category] || bannerStyles.Prenatal}`}>
                  <div className="absolute left-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                    {item.category || 'Prenatal'}
                  </div>
                  <div className="absolute right-3 top-3 flex gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.visible === false ? 'bg-gray-500 text-white' : 'bg-[#16A34A] text-white'}`}>
                      {item.visible === false ? 'Hidden' : 'Visible'}
                    </span>
                    {item.featured && <span className="rounded-full bg-[#F4A261] px-2.5 py-1 text-[10px] font-semibold text-white">★ Featured</span>}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-[#1A1A2E]">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{item.description}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-[#F9FAFB] p-2.5">
                      <p className="text-[#6B7280]">Price</p>
                      <p className="mt-0.5 font-semibold text-[#2D6A4F]">
                        {item.discount_price ? (
                          <span>
                            <span className="mr-2 text-gray-400 line-through">PKR {Number(item.price || 0).toLocaleString()}</span>
                            PKR {Number(item.discount_price).toLocaleString()}
                          </span>
                        ) : (
                          `PKR ${Number(item.price || 0).toLocaleString()}`
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F9FAFB] p-2.5">
                      <p className="text-[#6B7280]">Modules</p>
                      <p className="mt-0.5 font-semibold text-[#1A1A2E]">{item.modules || item.lessons || 1}</p>
                    </div>
                    <div className="rounded-xl bg-[#F9FAFB] p-2.5">
                      <p className="text-[#6B7280]">Duration</p>
                      <p className="mt-0.5 font-semibold text-[#1A1A2E]">{item.duration || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-[#F9FAFB] p-2.5">
                      <p className="text-[#6B7280]">Seats</p>
                      <p className="mt-0.5 font-semibold text-[#1A1A2E]">{item.seats_taken || 0}/{item.seats_total || 50}</p>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                        <div className="h-1.5 rounded-full bg-[#52B788]" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(item.schedule_slots || []).map((slot, idx) => (
                      <span key={`${slot.day}-${idx}`} className="rounded-full bg-[#E1F5EE] px-2.5 py-1 text-[11px] text-[#2D6A4F]">
                        {slot.day} · {slot.time}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                    <button type="button" onClick={() => openEdit(item)} className="flex-1 rounded-xl bg-[#E1F5EE] px-3 py-2 text-sm font-medium text-[#2D6A4F]">
                      Edit
                    </button>
                    <button type="button" onClick={() => toggleVisible(item)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-[#6B7280]">
                      {item.visible === false ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button type="button" onClick={() => removeClass(item)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editorOpen && (
        <AdminClassEditor
          classData={activeClass}
          mode={editorMode}
          onClose={() => setEditorOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
