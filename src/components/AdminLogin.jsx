import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

/**
 * Reusable admin login screen used by both Admin and BlogAdmin pages.
 * @param {Object} props
 * @param {string} props.password - The expected password
 * @param {() => void} props.onSuccess - Called after successful login
 * @param {string} [props.title] - Title text
 * @param {string} [props.subtitle] - Subtitle text
 */
export default function AdminLogin({ password, onSuccess, title = 'Admin Access', subtitle = 'Enter the admin password to continue' }) {
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (pwInput === password) {
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
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#2D6A4F] flex items-center justify-center mb-3">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-[#1A1A2E]">{title}</h1>
          <p className="text-sm text-[#6B7280] mt-1 text-center">{subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#52B788] transition-all ${
                pwError ? 'border-red-400 focus:ring-red-300' : 'border-gray-200'
              }`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
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
