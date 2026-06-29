import { useState, useEffect, useMemo } from 'react'
import {
  Lock, LogOut, Eye, EyeOff,
  Users, Clock, CheckCircle2, CalendarDays,
  Search, RefreshCw, Leaf,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import AdminStatCard from '../components/AdminStatCard'
import AdminBookingRow from '../components/AdminBookingRow'

// ─────────────────────────────────────────────────────────────
// ⚠️ IMPORTANT: Change this password before going live!
// Use a strong password and consider moving it to an
// environment variable: import.meta.env.VITE_ADMIN_PASSWORD
// ─────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || ''

// ── Skeleton row ──────────────────────────────────────────────
function TableSkeletonRow() {
  return (
    <tr className="border-b border-gray-50 animate-pulse">
      {Array(9).fill(0).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  )
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ search }) {
  return (
    <tr>
      <td colSpan={9} className="py-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Search size={20} className="text-gray-400" />
          </div>
          <p className="text-[#6B7280] font-medium">No bookings found</p>
          <p className="text-sm text-gray-400">
            {search ? `No results for "${search}"` : 'No bookings yet'}
          </p>
        </div>
      </td>
    </tr>
  )
}

// ── Mobile booking card ───────────────────────────────────────
function MobileBookingCard({ booking, onStatusChange }) {
  const isClass = booking.booking_type === 'class'
  const status = booking.status || 'pending'

  const statusStyles = {
    pending:  'bg-[#FEF3C7] text-[#D97706]',
    verified: 'bg-[#DCFCE7] text-[#16A34A]',
    rejected: 'bg-[#FEE2E2] text-[#DC2626]',
  }

  const handleWhatsApp = () => {
    const num = booking.whatsapp_number?.replace(/\D/g, '')
    let text
    if (isClass) {
      text = `Assalam o Alaikum ${booking.full_name}! Your payment for "${booking.class_title}" has been verified. Here is your class access link: [PASTE LINK HERE]. JazakAllah Khair! — Dr. Zainab Mohsin`
    } else {
      text = `Assalam o Alaikum ${booking.full_name}! Your consultation has been confirmed for ${booking.preferred_date} (${booking.preferred_time}). Here is your meeting link: [PASTE LINK HERE]. JazakAllah Khair! — Dr. Zainab Mohsin`
    }
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-4 border-l-4 ${
      status === 'pending' ? 'border-l-[#D97706]'
      : status === 'verified' ? 'border-l-[#16A34A]'
      : 'border-l-[#DC2626]'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-[#1A1A2E] text-sm">{booking.full_name}</p>
          <p className="text-xs text-[#6B7280]">{booking.city} · {booking.phone}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-[#6B7280]">{isClass ? booking.class_title : 'Consultation'}</p>
          <p className="font-semibold text-[#2D6A4F] text-sm">PKR {isClass ? (booking.class_price || '—') : '2,000'}</p>
          <p className="text-xs text-[#6B7280] mt-0.5">{booking.payment_method} · {booking.transaction_id}</p>
        </div>
        <div className="flex items-center gap-1">
          {(status === 'pending' || status === 'rejected') && (
            <button onClick={() => onStatusChange(booking.id, booking.booking_type, 'verified')}
              className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
              <CheckCircle2 size={15} className="text-[#16A34A]" />
            </button>
          )}
          <button onClick={handleWhatsApp}
            className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.843L0 24l6.335-1.518A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.359-.214-3.737.896.938-3.636-.235-.374A9.819 9.819 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════
function LoginScreen({ onSuccess }) {
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (ADMIN_PASSWORD && pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authed', 'true')
      onSuccess()
    } else {
      setPwError(true)
      setPwInput('')
      setTimeout(() => setPwError(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-md p-8">
        {/* Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#2D6A4F] flex items-center justify-center mb-3">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-[#1A1A2E]">Admin Access</h1>
          <p className="text-sm text-[#6B7280] mt-1 text-center">
            Dr. Zainab Mohsin — Booking Management
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <input
              id="admin-pw"
              type={showPw ? 'text' : 'password'}
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#52B788] transition-all ${
                pwError ? 'animate-bounce border-red-400 focus:ring-red-300' : 'border-gray-200'
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2D6A4F]"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {pwError && (
            <p className="text-red-500 text-sm -mt-2 text-center">
              Incorrect password. Try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#2D6A4F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#245c43] transition-colors"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === 'true')

  // Data
  const [classBookings, setClassBookings] = useState([])
  const [consultationBookings, setConsultationBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, today: 0 })

  // Filters
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (authed) fetchAllBookings()
  }, [authed])

  async function fetchAllBookings() {
    setLoading(true)
    setError(null)
    try {
      const [classRes, consultRes] = await Promise.all([
        supabase.from('class_bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('consultation_bookings').select('*').order('created_at', { ascending: false }),
      ])

      if (classRes.error) throw classRes.error
      if (consultRes.error) throw consultRes.error

      const taggedClasses = (classRes.data || []).map(b => ({ ...b, booking_type: 'class' }))
      const taggedConsults = (consultRes.data || []).map(b => ({ ...b, booking_type: 'consultation' }))

      setClassBookings(taggedClasses)
      setConsultationBookings(taggedConsults)

      // Compute stats
      const all = [...taggedClasses, ...taggedConsults]
      const today = new Date().toISOString().split('T')[0]
      setStats({
        total:    all.length,
        pending:  all.filter(b => b.status === 'pending').length,
        verified: all.filter(b => b.status === 'verified').length,
        today:    all.filter(b => b.created_at?.startsWith(today)).length,
      })

      setLastUpdated(
        new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Status update with optimistic UI
  const handleStatusChange = async (bookingId, bookingType, newStatus) => {
    const table = bookingType === 'class' ? 'class_bookings' : 'consultation_bookings'
    const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', bookingId)

    if (error) {
      alert('Error updating status: ' + error.message)
      return
    }

    const updater = prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    if (bookingType === 'class') setClassBookings(updater)
    else setConsultationBookings(updater)

    // Update stats
    setStats(prev => {
      const updated = { ...prev }
      if (newStatus === 'verified') { updated.verified = (updated.verified || 0) + 1; updated.pending = Math.max(0, (updated.pending || 0) - 1) }
      if (newStatus === 'rejected') { updated.pending = Math.max(0, (updated.pending || 0) - 1) }
      if (newStatus === 'pending')  { updated.pending = (updated.pending || 0) + 1 }
      return updated
    })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
  }

  // Filtered + sorted bookings
  const displayedBookings = useMemo(() => {
    let list =
      activeTab === 'all'            ? [...classBookings, ...consultationBookings]
      : activeTab === 'classes'      ? classBookings
      : consultationBookings

    list = [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(b =>
        b.full_name?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        b.transaction_id?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.whatsapp_number?.includes(q)
      )
    }

    return list
  }, [classBookings, consultationBookings, activeTab, statusFilter, search])

  // Tab counts
  const allCount    = classBookings.length + consultationBookings.length
  const classCount  = classBookings.length
  const consultCount = consultationBookings.length

  // ── Not authed → login screen ───────────────────────────────
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />

  // ── Dashboard ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2D6A4F] flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <span className="font-semibold text-[#1A1A2E] text-sm">Dr. Zainab — Admin</span>
            {lastUpdated && (
              <span className="hidden sm:inline text-xs text-[#6B7280] ml-2">
                Last updated: {lastUpdated}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllBookings}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#2D6A4F] transition-colors"
              title="Refresh bookings"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-red-500 transition-colors"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            ⚠️ Error loading bookings: {error} —{' '}
            <button onClick={fetchAllBookings} className="underline font-medium">Try again</button>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard icon={Users}        label="Total Bookings"  value={stats.total}    color="bg-[#2D6A4F]" loading={loading} />
          <AdminStatCard icon={Clock}        label="Pending Verify"  value={stats.pending}  color="bg-[#D97706]" loading={loading} />
          <AdminStatCard icon={CheckCircle2} label="Verified"        value={stats.verified} color="bg-[#16A34A]" loading={loading} />
          <AdminStatCard icon={CalendarDays} label="Today"           value={stats.today}    color="bg-[#7C3AED]" loading={loading} />
        </div>

        {/* TAB BAR + FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between flex-wrap">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all',           label: `All (${allCount})` },
              { id: 'classes',       label: `Classes (${classCount})` },
              { id: 'consultations', label: `Consultations (${consultCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#2D6A4F] text-white'
                    : 'bg-white text-[#6B7280] border border-gray-200 hover:border-[#52B788]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + status filter */}
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                id="admin-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, phone, transaction ID…"
                className="w-full sm:w-72 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#52B788] bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#6B7280] outline-none focus:ring-2 focus:ring-[#52B788] bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* RESULTS COUNT */}
        {!loading && (
          <p className="text-xs text-[#6B7280]">
            Showing <span className="font-semibold text-[#1A1A2E]">{displayedBookings.length}</span> booking{displayedBookings.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
          </p>
        )}

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-100">
                  {['Date', 'Type', 'Patient', 'Contact', 'Service', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(5).fill(0).map((_, i) => <TableSkeletonRow key={i} />)
                  : displayedBookings.length === 0
                  ? <EmptyState search={search} />
                  : displayedBookings.map(booking => (
                      <AdminBookingRow
                        key={`${booking.booking_type}-${booking.id}`}
                        booking={booking}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MOBILE CARD LIST ── */}
        <div className="md:hidden flex flex-col gap-3">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))
          ) : displayedBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
              <Search size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-[#6B7280] text-sm">No bookings found</p>
            </div>
          ) : (
            displayedBookings.map(booking => (
              <MobileBookingCard
                key={`${booking.booking_type}-${booking.id}`}
                booking={booking}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>

      </div>
    </div>
  )
}
