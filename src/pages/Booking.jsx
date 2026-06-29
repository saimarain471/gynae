// Booking.jsx — redesigned consultation booking page
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import {
  Video, Clock, MessageCircle, FileText, Heart,
  ShieldCheck, CreditCard, Copy, Check, GraduationCap,
  Award, Users, User, Mail, Phone, MapPin, Calendar,
  Hash, ChevronRight, CheckCircle2, Lock, Loader2,
  Star, Sun, Moon, Cloud, Home,
} from 'lucide-react'

const stepOneSchema = z.object({
  fullName: z.string().min(3, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter your phone number.'),
  whatsappNumber: z.string().min(10, 'Please enter your WhatsApp number.'),
  city: z.string().min(2, 'Please enter your city.'),
})

const stepTwoSchema = z.object({
  preferredDate: z.string().min(1, 'Please select a preferred date.'),
  preferredTimeSlot: z.string().min(1, 'Please select a time slot.'),
  concern: z.string().min(20, 'Please describe your concern in at least 20 characters.'),
  paymentMethod: z.string().min(1, 'Please select a payment method.'),
  transactionId: z.string().min(3, 'Please enter your transaction ID.'),
  additionalNotes: z.string().optional(),
})

export default function Booking() {
  const [step, setStep] = useState(1)
  const [submitError, setSubmitError] = useState('')
  const [status, setStatus] = useState('idle')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [imgError, setImgError] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [submittedData, setSubmittedData] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      whatsappNumber: '',
      city: '',
      preferredDate: '',
      preferredTimeSlot: '',
      concern: '',
      paymentMethod: '',
      transactionId: '',
      additionalNotes: '',
    },
  })

  const paymentMethod = watch('paymentMethod')
  const minDate = new Date().toISOString().split('T')[0]

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      window.prompt('Copy this value:', text)
    }
  }

  const handleNext = () => {
    const values = getValues()
    const result = stepOneSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        setError(field, { type: 'validation', message: messages?.[0] ?? 'Invalid value' })
      })
      return
    }

    clearErrors()
    setStep(2)
  }

  const buildWhatsappLink = (data) => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '03314896544'
    const message = `Assalam o Alaikum Dr. Zainab! I have booked a consultation and sent payment via ${data.paymentMethod}. My Transaction ID is ${data.transactionId}. Preferred: ${data.preferredDate} (${data.preferredTimeSlot}). My name is ${data.fullName}.`
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const onSubmit = async (values) => {
    setSubmitError('')
    setStatus('submitting')

    const result = stepTwoSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        setError(field, { type: 'validation', message: messages?.[0] ?? 'Invalid value' })
      })
      setStatus('idle')
      return
    }

    const payload = {
      full_name: values.fullName,
      email: values.email,
      phone: values.phone,
      whatsapp_number: values.whatsappNumber,
      city: values.city,
      preferred_date: values.preferredDate,
      preferred_time: values.preferredTimeSlot,
      concern: values.concern,
      payment_method: values.paymentMethod,
      transaction_id: values.transactionId,
      additional_notes: values.additionalNotes || '',
      status: 'pending',
    }

    const { error } = await supabase.from('consultation_bookings').insert(payload)
    if (error) {
      setSubmitError('Something went wrong. Please try again or contact us on WhatsApp.')
      console.error(error)
      setStatus('error')
      return
    }

    posthog.capture('consultation_booking_submitted', {
      paymentMethod: values.paymentMethod,
      timeSlot: values.preferredTimeSlot,
    })

    setSubmittedData(values)
    setWhatsappUrl(buildWhatsappLink(values))
    setStatus('success')
  }

  return (
    <>
      {/* HERO BANNER */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#2D6A4F] via-[#3a7d5e] to-[#52B788] py-14 md:py-20">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white opacity-5" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-white opacity-5" aria-hidden="true" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-[#F4A261] opacity-10" aria-hidden="true" />

        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white/80 transition">
              <Home size={14} className="inline mr-1" />
              Home
            </Link>
            <span>→</span>
            <span>Book Consultation</span>
          </div>

          {/* Main heading */}
          <h1 className="mt-3 font-['Playfair_Display'] text-3xl font-bold leading-tight text-white md:text-5xl">
            Book a 1-on-1 Consultation<br />
            with Dr. Zainab Mohsin
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-3 max-w-xl text-base text-white/80 md:text-lg">
            Get expert guidance on pregnancy, delivery, and baby care — from the comfort of your home.
          </p>

          {/* Highlight pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Video size={14} />
              Video call via Google Meet
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Clock size={14} />
              30 minutes session
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <ShieldCheck size={14} />
              PKR 2,000 only
            </div>
          </div>

          {/* Doctor mini card */}
          <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
              {!imgError ? (
                <img
                  src="/dr-zainab.jpg"
                  alt="Dr. Zainab"
                  className="h-12 w-12 rounded-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-lg font-bold text-white">ZM</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Dr. Zainab Mohsin</p>
              <p className="text-xs text-white/70">MBBS, FCPS — Gynecology & Obstetrics</p>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-white/70">
                <Star size={12} className="fill-amber-300 text-amber-300" />
                <span>4.9 · 500+ consultations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* LEFT COLUMN */}
          <div>
            {/* What to expect */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E1F5EE]">
                  <MessageCircle size={16} className="text-[#2D6A4F]" />
                </div>
                <h2 className="text-base font-semibold text-[#1A1A2E]">What to expect</h2>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#E1F5EE]">
                    <Video size={15} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Video call on Google Meet</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      Dr. Zainab will send you the meeting link on WhatsApp after booking confirmation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#E1F5EE]">
                    <Clock size={15} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">30 minute session</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">Focused, dedicated time to discuss your concerns in detail</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#E1F5EE]">
                    <MessageCircle size={15} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Ask anything</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      Pregnancy symptoms, delivery fears, newborn care, postpartum recovery — anything
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#E1F5EE]">
                    <FileText size={15} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Get personalized advice</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">Based on your specific situation, not generic information</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#E1F5EE]">
                    <Heart size={15} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Follow-up on WhatsApp</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">Brief follow-up support after your consultation at no extra charge</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Available time slots */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="text-base font-semibold text-[#1A1A2E]">Available time slots</h2>
              <p className="mt-1 text-xs text-[#6B7280]">Select your preferred slot in the booking form →</p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {/* Morning */}
                <div className="rounded-xl border border-[#F4A261]/30 bg-[#FFF8F0] p-3 text-center">
                  <Sun size={20} className="mx-auto text-[#F4A261]" />
                  <p className="mt-1 text-xs font-semibold text-[#1A1A2E]">Morning</p>
                  <p className="text-xs text-[#6B7280]">9 AM – 12 PM</p>
                </div>

                {/* Afternoon */}
                <div className="rounded-xl border border-[#52B788]/30 bg-[#E1F5EE] p-3 text-center">
                  <Cloud size={20} className="mx-auto text-[#52B788]" />
                  <p className="mt-1 text-xs font-semibold text-[#1A1A2E]">Afternoon</p>
                  <p className="text-xs text-[#6B7280]">12 PM – 3 PM</p>
                </div>

                {/* Evening */}
                <div className="rounded-xl border border-indigo-200 bg-[#EEF2FF] p-3 text-center">
                  <Moon size={20} className="mx-auto text-indigo-400" />
                  <p className="mt-1 text-xs font-semibold text-[#1A1A2E]">Evening</p>
                  <p className="text-xs text-[#6B7280]">4 PM – 7 PM</p>
                </div>
              </div>
            </div>

            {/* Doctor trust card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#52B788] p-6 text-white">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                  {!imgError ? (
                    <img
                      src="/dr-zainab.jpg"
                      alt="Dr. Zainab"
                      className="h-12 w-12 rounded-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-lg font-bold text-white">ZM</span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold">Dr. Zainab Mohsin</p>
                  <p className="text-sm text-white/80">Consultant Gynecologist</p>
                </div>
              </div>

              <div className="my-4 border-t border-white/20" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <GraduationCap size={16} />
                  MBBS — Medical Degree
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Award size={16} />
                  FCPS — Gynecology & Obstetrics
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Clock size={16} />
                  10+ years of clinical experience
                </div>
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <Users size={16} />
                  500+ mothers consulted online
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white/10 p-3">
                <p className="text-sm italic text-white/90">
                  "Every woman deserves a doctor who listens. I am here for you."
                </p>
                <p className="mt-1 text-xs text-white/60">— Dr. Zainab Mohsin</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Payment Instructions */}
            <div className="mb-6 rounded-2xl border border-[#F4A261]/30 bg-[#FFFBF5] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-[#FFF3E8] p-2">
                    <CreditCard size={18} className="text-[#F4A261]" />
                  </div>
                  <span className="text-sm font-semibold text-[#1A1A2E]">Send consultation fee first</span>
                </div>
                <span className="text-lg font-bold text-[#2D6A4F]">PKR 2,000</span>
              </div>

              {/* Payment methods */}
              <div className="flex flex-col gap-2">
                {/* JazzCash */}
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">JazzCash</p>
                    <p className="font-mono text-xs text-[#6B7280]">0300-0000000</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('0300-0000000', 'jazzcash')}
                    className="text-[#6B7280] hover:text-[#2D6A4F] transition"
                  >
                    {copiedId === 'jazzcash' ? (
                      <Check size={13} className="text-green-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>

                {/* EasyPaisa */}
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">EasyPaisa</p>
                    <p className="font-mono text-xs text-[#6B7280]">0301-0000000</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('0301-0000000', 'easypaisa')}
                    className="text-[#6B7280] hover:text-[#2D6A4F] transition"
                  >
                    {copiedId === 'easypaisa' ? (
                      <Check size={13} className="text-green-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>

                {/* Bank Transfer */}
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">HBL Bank</p>
                    <p className="text-xs text-[#6B7280]">Dr. Zainab Mohsin</p>
                    <p className="font-mono text-xs text-[#6B7280]">PK00HABB0000001234567890</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('PK00HABB0000001234567890', 'bank')}
                    className="text-[#6B7280] hover:text-[#2D6A4F] transition flex-shrink-0"
                  >
                    {copiedId === 'bank' ? (
                      <Check size={13} className="text-green-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
              </div>

              {/* Info box */}
              <div className="mt-3 rounded-xl bg-[#E1F5EE] p-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={14} className="mt-0.5 flex-shrink-0 text-[#2D6A4F]" />
                  <p className="text-xs text-[#2D6A4F]">
                    After sending payment, enter your Transaction ID in the form below. Dr. Zainab will verify and confirm your slot on WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              {status === 'success' && submittedData ? (
                // SUCCESS STATE
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E1F5EE]">
                    <CheckCircle2 size={40} className="text-[#2D6A4F]" />
                  </div>

                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1A1A2E]">Booking Confirmed!</h3>
                  <p className="mt-2 text-sm text-[#6B7280]">JazakAllah! Your consultation request has been received.</p>

                  {/* Next steps */}
                  <div className="mt-4 rounded-xl bg-[#E1F5EE] p-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
                        1
                      </div>
                      <p className="text-sm text-[#2D6A4F]">Dr. Zainab has been notified of your booking</p>
                    </div>
                    <div className="mt-2 flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
                        2
                      </div>
                      <p className="text-sm text-[#2D6A4F]">Your payment will be verified within a few hours</p>
                    </div>
                    <div className="mt-2 flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
                        3
                      </div>
                      <p className="text-sm text-[#2D6A4F]">Meeting link will be sent to your WhatsApp</p>
                    </div>
                    <div className="mt-2 flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
                        4
                      </div>
                      <p className="text-sm text-[#2D6A4F]">Join the call at your confirmed time</p>
                    </div>
                  </div>

                  {/* WhatsApp button */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => posthog.capture('whatsapp_confirm_clicked', { type: 'consultation' })}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-semibold text-white transition hover:bg-[#20c05a]"
                  >
                    <MessageCircle size={16} />
                    Confirm on WhatsApp
                  </a>

                  {/* Browse classes link */}
                  <Link
                    to="/classes"
                    className="mt-3 inline-block text-sm text-[#2D6A4F] underline transition hover:text-[#245c43]"
                  >
                    Browse Classes
                  </Link>
                </div>
              ) : (
                // FORM
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6">
                    <h2 className="text-base font-semibold text-[#1A1A2E]">Your booking details</h2>
                    <p className="mt-1 text-xs text-[#6B7280]">Fill in your details and payment info below</p>
                  </div>

                  {/* Step indicator */}
                  <div className="mb-6 flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm transition ${
                          step === 1
                            ? 'bg-[#2D6A4F] text-white'
                            : step === 2
                              ? 'bg-[#52B788] text-white'
                              : 'border border-gray-200 bg-gray-100 text-[#6B7280]'
                        }`}
                      >
                        {step > 1 ? <Check size={14} /> : '1'}
                      </div>
                      <span className="mt-1 text-center text-xs text-[#6B7280]">Your details</span>
                    </div>

                    <div className={`h-0.5 flex-1 transition ${step === 2 ? 'bg-[#52B788]' : 'bg-gray-200'}`} />

                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm transition ${
                          step === 2
                            ? 'bg-[#2D6A4F] text-white'
                            : 'border border-gray-200 bg-gray-100 text-[#6B7280]'
                        }`}
                      >
                        2
                      </div>
                      <span className="mt-1 text-center text-xs text-[#6B7280]">Payment</span>
                    </div>
                  </div>

                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="flex flex-col gap-4">
                      {/* Full Name */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          {...register('fullName')}
                          placeholder="Ayesha Fatima"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="ayesha@gmail.com"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          {...register('phone')}
                          placeholder="03XX-XXXXXXX"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                        <p className="text-xs italic text-[#6B7280]">Pakistani number format</p>
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                      </div>

                      {/* WhatsApp */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          WhatsApp Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          {...register('whatsappNumber')}
                          placeholder="03XX-XXXXXXX"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                        <p className="text-xs italic text-[#6B7280]">Meeting link will be sent here</p>
                        {errors.whatsappNumber && <p className="text-xs text-red-500">{errors.whatsappNumber.message}</p>}
                      </div>

                      {/* City */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          City <span className="text-red-400">*</span>
                        </label>
                        <input
                          {...register('city')}
                          placeholder="Rawalpindi"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                        {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                      </div>

                      {/* Next button */}
                      <button
                        type="button"
                        onClick={handleNext}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D6A4F] py-3.5 font-semibold text-white transition hover:bg-[#245c43]"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="flex flex-col gap-4">
                      {/* Back link */}
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mb-2 text-left text-sm font-medium text-[#6B7280] underline transition hover:text-[#1A1A2E]"
                      >
                        ← Back
                      </button>

                      {/* Preferred Date */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          Preferred Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          {...register('preferredDate')}
                          type="date"
                          min={minDate}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                        {errors.preferredDate && <p className="text-xs text-red-500">{errors.preferredDate.message}</p>}
                      </div>

                      {/* Time Slot */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          Preferred Time Slot <span className="text-red-400">*</span>
                        </label>
                        <select
                          {...register('preferredTimeSlot')}
                          className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        >
                          <option value="">Select a time slot</option>
                          <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
                          <option value="Afternoon (12 PM – 3 PM)">Afternoon (12 PM – 3 PM)</option>
                          <option value="Evening (4 PM – 7 PM)">Evening (4 PM – 7 PM)</option>
                        </select>
                        {errors.preferredTimeSlot && <p className="text-xs text-red-500">{errors.preferredTimeSlot.message}</p>}
                      </div>

                      {/* Your Concern */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          What would you like to discuss? <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          {...register('concern')}
                          rows={3}
                          placeholder="Briefly describe your concern — e.g. pregnancy symptoms, delivery fears, baby care questions..."
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                        <p className="text-xs text-[#6B7280]">Minimum 20 characters — helps Dr. Zainab prepare for your session</p>
                        {errors.concern && <p className="text-xs text-red-500">{errors.concern.message}</p>}
                      </div>

                      {/* Payment Method */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          Payment Method <span className="text-red-400">*</span>
                        </label>
                        <select
                          {...register('paymentMethod')}
                          className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        >
                          <option value="">Select payment method</option>
                          <option value="JazzCash">JazzCash</option>
                          <option value="EasyPaisa">EasyPaisa</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                        {paymentMethod && (
                          <div className="rounded-lg bg-[#E1F5EE] px-3 py-2 text-xs text-[#2D6A4F]">
                            {paymentMethod === 'JazzCash'
                              ? 'JazzCash: 0300-0000000 (Zainab Mohsin)'
                              : paymentMethod === 'EasyPaisa'
                                ? 'EasyPaisa: 0301-0000000 (Zainab Mohsin)'
                                : 'HBL IBAN: PK00HABB0000001234567890 (Dr. Zainab Mohsin)'}
                          </div>
                        )}
                        {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>}
                      </div>

                      {/* Transaction ID */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">
                          Transaction ID / Reference Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          {...register('transactionId')}
                          placeholder="e.g. TXN8823991"
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                        <p className="text-xs italic text-[#6B7280]">From your JazzCash/EasyPaisa receipt or bank SMS</p>
                        {errors.transactionId && <p className="text-xs text-red-500">{errors.transactionId.message}</p>}
                      </div>

                      {/* Additional Notes */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#1A1A2E]">Additional notes (optional)</label>
                        <textarea
                          {...register('additionalNotes')}
                          rows={2}
                          placeholder="Any other information you'd like to share..."
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]"
                        />
                      </div>

                      {/* Error message */}
                      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D6A4F] py-4 text-base font-semibold text-white transition hover:bg-[#245c43] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Confirm Booking — PKR 2,000
                          </>
                        )}
                      </button>

                      {/* Security note */}
                      <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[#6B7280]">
                        <Lock size={12} />
                        Your information is safe and secure
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* TRUST STRIP */}
      <div className="border-t border-gray-100 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#52B788]" />
              <span className="text-sm text-[#6B7280]">Secure & private</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#52B788]" />
              <span className="text-sm text-[#6B7280]">Verified within hours</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-[#52B788]" />
              <span className="text-sm text-[#6B7280]">WhatsApp support</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="fill-[#F4A261] text-[#F4A261]" />
              <span className="text-sm text-[#6B7280]">4.9★ rated doctor</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#52B788]" />
              <span className="text-sm text-[#6B7280]">500+ consultations done</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
