import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import ClassCard from '../components/ClassCard'
import TestimonialCard from '../components/TestimonialCard'
import { classes } from '../data/classes'
import { posthog } from '../lib/posthog'

const stats = [
  { label: 'Mothers Trained', value: '500+' },
  { label: 'Years Experience', value: '10+' },
  { label: 'Average Rating', value: '4.9★' },
]

const testimonials = [
  { name: 'Ayesha Khan', title: 'New Mother', quote: 'The classes gave me confidence and helped me prepare for my first baby.' },
  { name: 'Sara Malik', title: 'Expecting Mother', quote: 'Dr. Zainab explained every step gently and clearly. Highly recommended.' },
  { name: 'Fatima Raza', title: 'Postpartum Mom', quote: 'The baby care tips were practical and comforting for a new mother.' },
]

export default function Home() {
  return (
    <main className="space-y-16">
      <HeroSection />

      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] bg-white px-6 py-10 shadow-sm md:grid-cols-3 md:px-10">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-3xl font-semibold text-text">{stat.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold text-text">Simple booking steps for every mom.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">
              Choose a class, complete the booking form, send payment via WhatsApp-approved channels, and receive your class access link on WhatsApp.
            </p>
          </div>
          <div className="grid gap-4">
            {['Choose a class', 'Fill the booking form', 'Send payment via JazzCash / EasyPaisa / Bank', 'Get class access on WhatsApp within a few hours'].map((step, index) => (
              <div key={step} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-primary">Step {index + 1}</p>
                <p className="mt-2 text-sm text-text-muted">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Featured Classes</p>
            <h2 className="mt-3 text-3xl font-semibold text-text">Carefully designed for expecting and new mothers.</h2>
          </div>
          <Link to="/classes" className="text-sm font-semibold text-primary hover:text-secondary">
            View all classes
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {classes.slice(0, 3).map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl rounded-[2rem] bg-primary/5 px-6 py-12 text-center shadow-sm lg:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Consultation</p>
        <h2 className="mt-4 text-3xl font-semibold text-text">Book a 1-on-1 with Dr. Zainab — PKR 2,000</h2>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          Secure a private video consultation for pregnancy support, baby care, and women&apos;s health guidance.
        </p>
        <Link to="/booking" className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e99141]">
          Book Consultation
        </Link>
      </section>
    </main>
  )
}
