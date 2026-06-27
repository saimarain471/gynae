import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
      </div>
    </Router>
  )
}
