import { Link } from 'react-router-dom'
import { Mail, PhoneCall, MapPin } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

function FooterBio() {
  const { settings, loading } = useSiteSettings()

  return (
    <div className="min-h-[72px]">
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      ) : (
        <p className="max-w-sm text-sm leading-6 text-text-muted">
          {settings.about_bio_text}
        </p>
      )}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text">About</h3>
          <FooterBio />
          <div className="flex flex-wrap gap-3 text-sm text-primary">
            <span className="rounded-full bg-secondary/10 px-3 py-1">JazzCash</span>
            <span className="rounded-full bg-secondary/10 px-3 py-1">EasyPaisa</span>
            <span className="rounded-full bg-secondary/10 px-3 py-1">Bank Transfer</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-text-muted">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/about" className="hover:text-primary">About</Link>
            <Link to="/classes" className="hover:text-primary">Classes</Link>
            <Link to="/blog" className="hover:text-primary">Health Tips</Link>
            <Link to="/faqs" className="hover:text-primary">FAQs</Link>
            <Link to="/testimonials" className="hover:text-primary">Patient Reviews</Link>
            <Link to="/booking" className="hover:text-primary">Book Consultation</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text">Contact</h3>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <Mail className="h-4 w-4 text-secondary" />
            <span>zjrehman2050@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <PhoneCall className="h-4 w-4 text-secondary" />
            <span>03314896544</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <MapPin className="h-4 w-4 text-secondary" />
            <span>Rawalpindi, Pakistan</span>
          </div>
          <p className="text-xs text-text-muted">
            © 2025 Dr. Zainub Mohsin. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            This site is for educational purposes only. Always consult a doctor for medical advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
