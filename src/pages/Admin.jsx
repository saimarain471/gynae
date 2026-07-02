import { useState, useEffect } from 'react'
import {
  LayoutDashboard, BookOpen, Lock, RefreshCw, LogOut, Eye, EyeOff,
  Leaf,
} from 'lucide-react'
import { SmoothInput } from '../components/SmoothInput'
import { supabase } from '../lib/supabase'
import AdminOverview from '../components/admin/AdminOverview'
import AdminClasses from '../components/admin/AdminClasses'
import AdminSettings from '../components/admin/AdminSettings'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'DrZainab@2025'

function LoginScreen({ onSuccess }) {
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authed', 'true')
      sessionStorage.setItem('admin_password', pwInput)
      onSuccess()
    } else {
      setPwError(true)
      setPwInput('')
      setTimeout(() => setPwError(false), 2500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#2D6A4F]">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-[#1A1A2E]">Admin Access</h1>
          <p className="mt-1 text-center text-sm text-[#6B7280]">Dr. Zainab Mohsin — Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <SmoothInput
              id="admin-pw"
              type={showPw ? 'text' : 'password'}
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-[#1A1A2E] outline-none transition-all focus:ring-2 focus:ring-[#52B788] ${pwError ? 'animate-bounce border-red-400 focus:ring-red-300' : 'border-gray-200'}`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#2D6A4F]"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {pwError && <p className="text-center text-sm text-red-500">Incorrect password. Try again.</p>}

          <button type="submit" className="w-full rounded-xl bg-[#2D6A4F] py-3 text-sm font-semibold text-white transition hover:bg-[#245c43]">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === 'true')
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authed) return

    const checkTables = async () => {
      setLoading(true)
      setError('')
      try {
        const { error: classesError } = await supabase.from('classes').select('id').limit(1)
        if (classesError) throw classesError
      } catch (err) {
        setError(err.message || 'Unable to reach Supabase right now.')
      } finally {
        setLoading(false)
      }
    }

    checkTables()
  }, [authed, refreshKey])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed')
    sessionStorage.removeItem('admin_password')
    setAuthed(false)
  }

  const handleRefresh = () => {
    setRefreshKey((value) => value + 1)
  }

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2D6A4F]">
              <Leaf size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A2E]">Dr. Zainab — Admin Dashboard</p>
              <p className="text-xs text-[#6B7280]">Overview, classes, and payments</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={handleRefresh} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-[#6B7280] transition hover:text-[#2D6A4F]">
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-[#6B7280] transition hover:text-red-500">
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'classes', label: 'Classes', icon: BookOpen },
            { id: 'settings', label: 'Settings', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition ${activeTab === tab.id ? 'bg-[#2D6A4F] text-white' : 'text-[#6B7280] hover:bg-gray-50'}`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {error}
          </div>
        )}

        {activeTab === 'overview' ? (
          <AdminOverview refreshKey={refreshKey} />
        ) : activeTab === 'classes' ? (
          <AdminClasses refreshKey={refreshKey} />
        ) : (
          <AdminSettings refreshKey={refreshKey} />
        )}
      </div>
    </div>
  )
}
