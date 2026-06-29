import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { posthog } from './lib/posthog'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Classes = lazy(() => import('./pages/Classes'))
const ClassDetail = lazy(() => import('./pages/ClassDetail'))
const BookClass = lazy(() => import('./pages/BookClass'))
const Booking = lazy(() => import('./pages/Booking'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const BlogAdmin = lazy(() => import('./pages/BlogAdmin'))
const FAQs = lazy(() => import('./pages/FAQs'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Admin = lazy(() => import('./pages/Admin'))

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
        <Suspense fallback={<div className="min-h-[60vh] bg-background" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/book-class/:id" element={<BookClass />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/blog/admin" element={<BlogAdmin />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
        <Footer />

        <WhatsAppButton />
      </div>
    </Router>
  )
}
