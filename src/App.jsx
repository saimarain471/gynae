import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Classes from './pages/Classes'
import ClassDetail from './pages/ClassDetail'
import BookClass from './pages/BookClass'
import Booking from './pages/Booking'
import ThankYou from './pages/ThankYou'
import { posthog } from './lib/posthog'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    posthog.capture('$pageview', { page: pathname })
  }, [pathname])

  return null
}

export default function App() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '923704731692'

  return (
    <Router>
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:id" element={<ClassDetail />} />
          <Route path="/book-class/:id" element={<BookClass />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />

        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105 hover:bg-secondary"
          aria-label="Contact on WhatsApp"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      </div>
    </Router>
  )
}
