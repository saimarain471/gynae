import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, HeartPulse } from 'lucide-react'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Classes', to: '/classes' },
  { label: 'Book Consultation', to: '/booking' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-soft bg-white/95 backdrop-blur-lg' : 'bg-white/90'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-primary">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/10 text-secondary ring-1 ring-secondary/20">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span>Dr. Zainab Mohsin</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm font-medium text-text-muted transition hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/booking" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e6914c]">
            Book Now
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-text-muted md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-text-muted hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
