import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Leaf } from 'lucide-react'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Classes', to: '/classes' },
  { label: 'Health Tips', to: '/blog' },
  { label: 'Book Consultation', to: '/booking' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActiveLink = (to) => pathname === to || (to !== '/' && pathname.startsWith(to))

  return (
    <header className="sticky top-0 z-50">
      <div className={`transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-sm backdrop-blur-sm' : 'bg-[#FAFAF8]'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D6A4F]">
              <Leaf size={16} color="white" />
            </div>
            <span className="text-base font-semibold text-[#1A1A2E]">Dr. Zainab Mohsin</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={`relative text-sm transition-colors ${isActiveLink(item.to) ? 'font-semibold text-[#2D6A4F] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-[#2D6A4F]' : 'text-[#6B7280] hover:text-[#2D6A4F]'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center lg:flex">
            <Link to="/booking" className="rounded-xl bg-[#2D6A4F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#245c43]">
              Book Now
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#6B7280] lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D6A4F]">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-[#1A1A2E]">Dr. Zainab Mohsin</span>
          </div>
          <button onClick={() => setMenuOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100" aria-label="Close menu">
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${pathname === item.to ? 'bg-[#E1F5EE] font-semibold text-[#2D6A4F]' : 'text-[#1A1A2E] hover:bg-gray-50'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 px-4 py-5">
          <Link
            to="/booking"
            onClick={() => setMenuOpen(false)}
            className="block w-full rounded-xl bg-[#2D6A4F] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#245c43]"
          >
            Book Consultation — PKR 2,000
          </Link>
        </div>
      </div>
    </header>
  )
}
