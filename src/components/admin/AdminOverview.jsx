import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, BookOpen, Calendar, Clock,
  CheckCircle2, Wallet, Users, Star, ArrowRight,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminStatCard from '../AdminStatCard'

const defaultStats = {
  todayConsultations: 0,
  upcomingClasses: 0,
  pendingPayments: 0,
  completedClasses: 0,
  revenue: 0,
  students: 0,
  avgRating: 0,
  totalRatings: 0,
}

const paymentMethods = [
  { label: 'EasyPaisa', className: 'border-blue-200 bg-blue-50 text-blue-600' },
  { label: 'JazzCash', className: 'border-green-200 bg-green-50 text-green-700' },
  { label: 'Bank Transfer', className: 'border-orange-200 bg-orange-50 text-orange-600' },
  { label: 'NayaPay', className: 'border-purple-200 bg-purple-50 text-purple-600' },
  { label: 'SadaPay', className: 'border-pink-200 bg-pink-50 text-pink-600' },
]

export default function AdminOverview({ refreshKey = 0 }) {
  const [stats, setStats] = useState(defaultStats)
  const [consultations, setConsultations] = useState([])
  const [classBookings, setClassBookings] = useState([])
  const [weeklyRevenue, setWeeklyRevenue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchStats() {
      setLoading(true)
      setError('')

      try {
        const today = new Date().toISOString().split('T')[0]

        const [consultRes, classBookRes, classesRes, ratingsRes] = await Promise.all([
          supabase.from('consultation_bookings').select('*'),
          supabase.from('class_bookings').select('*'),
          supabase.from('classes').select('*'),
          supabase.from('ratings').select('rating'),
        ])

        if (consultRes.error) throw consultRes.error
        if (classBookRes.error) throw classBookRes.error
        if (classesRes.error) throw classesRes.error
        if (ratingsRes.error) throw ratingsRes.error

        const consultationsData = consultRes.data || []
        const classBookingsData = classBookRes.data || []
        const classesData = classesRes.data || []
        const ratingsData = ratingsRes.data || []

        const todayConsultations = consultationsData.filter((c) => c.preferred_date === today).length
        const upcomingClasses = classesData.filter((c) => c.visible).length
        const pendingPayments = [...consultationsData, ...classBookingsData].filter((b) => b.status === 'pending').length
        const completedClasses = classBookingsData.filter((b) => b.status === 'verified').length

        const classRevenue = classBookingsData
          .filter((b) => b.status === 'verified')
          .reduce((sum, b) => sum + (Number(b.class_price) || 0), 0)

        const consultRevenue = consultationsData
          .filter((c) => c.status === 'verified')
          .reduce((sum, c) => sum + (Number(c.amount_charged) || 2000), 0)

        const revenue = classRevenue + consultRevenue
        const uniqueStudents = new Set([...consultationsData, ...classBookingsData].map((b) => b.email).filter(Boolean)).size

        const avgRating = ratingsData.length
          ? (ratingsData.reduce((sum, r) => sum + Number(r.rating || 0), 0) / ratingsData.length).toFixed(1)
          : 0

        const last7Days = Array.from({ length: 7 }, (_, idx) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - idx))
          return d.toISOString().split('T')[0]
        })

        const revenueSeries = last7Days.map((date) => {
          const dayBookings = [...classBookingsData, ...consultationsData].filter((b) => b.created_at?.startsWith(date) && b.status === 'verified')
          const total = dayBookings.reduce((sum, b) => sum + (Number(b.class_price) || Number(b.amount_charged) || 0), 0)
          return { date, total }
        })

        if (!isMounted) return

        setConsultations(consultationsData)
        setClassBookings(classBookingsData)
        setWeeklyRevenue(revenueSeries)
        setStats({
          todayConsultations,
          upcomingClasses,
          pendingPayments,
          completedClasses,
          revenue,
          students: uniqueStudents,
          avgRating,
          totalRatings: ratingsData.length,
        })
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Unable to load dashboard data right now.')
        setStats(defaultStats)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchStats()
    return () => {
      isMounted = false
    }
  }, [refreshKey])

  const today = useMemo(() => new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'short' }), [])

  const todaysConsults = useMemo(() =>
    consultations.filter((c) => c.preferred_date === new Date().toISOString().split('T')[0]),
  [consultations])

  const pendingItems = useMemo(() => {
    return [...consultations, ...classBookings]
      .filter((b) => b.status === 'pending')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  }, [consultations, classBookings])

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <AdminStatCard icon={Calendar} label="Today's Consultations" value={stats.todayConsultations} color="bg-[#2563EB]" loading={loading} />
        <AdminStatCard icon={BookOpen} label="Upcoming Classes" value={stats.upcomingClasses} color="bg-[#2D6A4F]" loading={loading} />
        <AdminStatCard icon={Clock} label="Pending Payments" value={stats.pendingPayments} color="bg-[#D97706]" loading={loading} />
        <AdminStatCard icon={CheckCircle2} label="Completed Classes" value={stats.completedClasses} color="bg-[#16A34A]" loading={loading} />
        <AdminStatCard icon={Wallet} label="Revenue" value={`PKR ${stats.revenue.toLocaleString()}`} color="bg-[#7C3AED]" loading={loading} />
        <AdminStatCard icon={Users} label="Students" value={stats.students} color="bg-[#F4A261]" loading={loading} />
        <AdminStatCard icon={Star} label="Ratings" value={`${stats.avgRating} ★`} subtitle={`${stats.totalRatings} reviews`} color="bg-[#EAB308]" loading={loading} />
        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noreferrer"
          className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-colors hover:border-[#52B788]"
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#2563EB]">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#6B7280]">Google Calendar</p>
            <p className="text-sm font-semibold text-[#2D6A4F]">Open calendar →</p>
          </div>
        </a>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Today's Consultations</h3>
            <span className="rounded-full bg-[#E1F5EE] px-2.5 py-1 text-xs font-medium text-[#2D6A4F]">{today}</span>
          </div>

          {todaysConsults.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-[#6B7280]">
              No consultations scheduled for today.
            </div>
          ) : (
            <div className="space-y-0">
              {todaysConsults.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">{item.full_name || 'Patient'}</p>
                    <p className="text-xs text-[#6B7280]">{item.preferred_time || 'Time to be confirmed'}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${item.status === 'verified' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
                    {item.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Pending Payments</h3>
            <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-medium text-[#D97706]">{pendingItems.length}</span>
          </div>

          {pendingItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-[#6B7280]">
              No pending payments right now.
            </div>
          ) : (
            <div className="space-y-0">
              {pendingItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">{item.full_name || item.patient_name || 'Patient'}</p>
                    <p className="text-xs text-[#6B7280]">{item.class_title || 'Consultation'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#2D6A4F]">PKR {Number(item.class_price || 2000).toLocaleString()}</p>
                    <p className="text-[11px] text-[#6B7280]">Verify →</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pendingItems.length > 5 && (
            <a href="#classes" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2D6A4F]">
              View all in Classes tab <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1A1A2E]">Revenue — Last 7 Days</h3>
          <span className="text-sm text-[#6B7280]">Verified bookings only</span>
        </div>

        <div className="mt-4 flex h-32 items-end gap-2">
          {weeklyRevenue.map((day) => {
            const maxValue = Math.max(...weeklyRevenue.map((entry) => entry.total), 1)
            const heightPct = (day.total / maxValue) * 100
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative h-full w-full rounded-t-lg bg-[#E1F5EE]">
                  <div className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-[#2D6A4F] transition-all" style={{ height: `${heightPct}%` }} />
                </div>
                <span className="text-[9px] text-[#6B7280]">
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
        <h3 className="text-sm font-semibold text-[#1A1A2E]">Accepted Payment Methods</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {paymentMethods.map((method) => (
            <span key={method.label} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${method.className}`}>
              {method.label}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#6B7280]">
          These are configured in the public payment instructions and can be updated by your developer when needed.
        </p>
      </div>
    </div>
  )
}
