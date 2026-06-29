import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ShieldCheck, Check, CheckCircle2 } from 'lucide-react'
import { classes } from '../data/classes'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import { toWhatsAppNumber, PHONE_REGEX } from '../lib/phone'
import PaymentInstructions from '../components/PaymentInstructions'

const stepOneSchema = z.object({
  fullName: z.string().min(3, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter your phone number.').regex(PHONE_REGEX, 'Please enter a valid phone number (digits only).'),
  whatsappNumber: z.string().min(10, 'Please enter your WhatsApp number.').regex(PHONE_REGEX, 'Please enter a valid WhatsApp number (digits only).'),
  city: z.string().min(2, 'Please enter your city.'),
})

const stepTwoSchema = z.object({
  paymentMethod: z.enum(['JazzCash', 'EasyPaisa', 'Bank Transfer'], 'Please select a payment method.'),
  transactionId: z.string().min(3, 'Please enter your transaction ID.'),
  additionalNotes: z.string().optional(),
})

export default function BookClass() {
  const { id } = useParams()
  const navigate = useNavigate()
  const classData = useMemo(() => classes.find((item) => item.id === Number(id)), [id])
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [step, setStep] = useState(1)
  const [formReady, setFormReady] = useState(false)

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
    defaultValues: { paymentMethod: '' },
  })

  const paymentMethod = watch('paymentMethod')

  useEffect(() => {
    const timer = setTimeout(() => setFormReady(true), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!classData) return
    posthog.capture('class_detail_viewed', { classId: classData.id, classTitle: classData.title })
  }, [classData])

  if (!formReady) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-10 animate-pulse">
        <div className="h-8 w-2/3 rounded-lg bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-12 w-full rounded-xl bg-gray-100" />
          </div>
        ))}
        <div className="mt-2 h-12 w-full rounded-xl bg-gray-200" />
      </div>
    )
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

  if (!classData) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-text">Class not found</h1>
          <p className="mt-4 text-sm text-text-muted">Please return to the classes page and select a valid class.</p>
        </div>
      </main>
    )
  }

  const buildWhatsappLink = ({ fullName, paymentMethod, transactionId }) => {
    const phone = toWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER || '03314896544')
    const message = `Assalam o Alaikum Dr. Zainub! I have enrolled in ${classData.title} and sent payment via ${paymentMethod}. My Transaction ID is ${transactionId}. My name is ${fullName}.`
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const onSubmit = async (values) => {
    setSubmitError('')

    // Re-validate both steps so step-1 fields can't be tampered with
    // after advancing past step 1.
    const result = stepOneSchema.extend(stepTwoSchema.shape).safeParse(values)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        setError(field, { type: 'validation', message: messages?.[0] ?? 'Invalid value' })
      })
      return
    }

    const payload = {
      full_name: values.fullName,
      email: values.email,
      phone: values.phone,
      whatsapp_number: values.whatsappNumber,
      city: values.city,
      class_id: classData.id,
      class_title: classData.title,
      class_price: classData.price,
      payment_method: values.paymentMethod,
      transaction_id: values.transactionId,
      additional_notes: values.additionalNotes || '',
      status: 'pending',
    }

    const { error } = await supabase.from('class_bookings').insert(payload)
    if (error) {
      setSubmitError('Something went wrong. Please try again or contact us on WhatsApp.')
      console.error(error)
      return
    }

    posthog.capture('class_booking_submitted', {
      classId: classData.id,
      classTitle: classData.title,
      paymentMethod: values.paymentMethod,
    })

    setWhatsappUrl(buildWhatsappLink(values))
    setSubmitted(true)
    return true
  }

  const paymentInfoMap = {
    JazzCash: 'JazzCash: 0300-0000000 (Zainab Mohsin)',
    EasyPaisa: 'EasyPaisa: 0301-0000000 (Zainab Mohsin)',
    'Bank Transfer': 'HBL: PK00HABB0000001234567890 (Dr. Zainab Mohsin)',
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-3 rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-[#1A1A2E]">Enroll in {classData.title}</h1>
          <p className="text-sm leading-7 text-[#6B7280]">You are enrolling in: {classData.title} — PKR {classData.price}</p>
        </div>

        <PaymentInstructions />

        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#1A1A2E]">Booking Form</h2>
          <p className="mt-2 text-sm leading-7 text-[#6B7280]">
            Complete the booking form, send payment manually, and submit the transaction details below.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-3xl border border-[#52B788]/30 bg-[#E1F5EE] p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E1F5EE]">
                <CheckCircle2 size={36} className="text-[#2D6A4F]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A2E]">Booking received!</h3>
              <div className="mx-auto mt-3 max-w-sm space-y-2 text-sm leading-7 text-[#6B7280]">
                <p>Your booking has been saved. Dr. Zainab has been notified automatically.</p>
                <p className="font-medium text-[#2D6A4F]">She will verify your payment and send your class access link to your WhatsApp within a few hours.</p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => posthog.capture('whatsapp_confirm_clicked', { type: 'class' })}
                className="mt-6 inline-flex rounded-full bg-[#2D6A4F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43]"
              >
                Confirm on WhatsApp
              </a>
              <p className="mt-4 text-xs text-[#6B7280]">You will also receive a confirmation email shortly.</p>
              <button
                type="button"
                onClick={() => navigate('/classes')}
                className="mt-4 inline-flex rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#1A1A2E] transition hover:bg-gray-50"
              >
                Browse More Classes
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-6">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${step === 1 ? 'bg-[#2D6A4F] text-white' : step === 2 ? 'bg-[#52B788] text-white' : 'bg-gray-100 text-[#6B7280] border border-gray-200'}`}>
                    {step === 2 ? <Check size={14} /> : '1'}
                  </div>
                  <span className="mt-2 text-center text-xs text-[#6B7280]">Your details</span>
                </div>
                <div className="h-[1px] w-16 bg-gray-200" />
                <div className="flex flex-col items-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${step === 2 ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-[#6B7280] border border-gray-200'}`}>
                    {step === 2 ? '2' : '2'}
                  </div>
                  <span className="mt-2 text-center text-xs text-[#6B7280]">Payment</span>
                </div>
              </div>

              {step === 1 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#1A1A2E]">Full Name</label>
                      <input {...register('fullName')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                      {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#1A1A2E]">Email Address</label>
                      <input {...register('email')} type="email" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#1A1A2E]">Phone Number</label>
                      <input {...register('phone')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" placeholder="03XX-XXXXXXX" />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#1A1A2E]">WhatsApp Number</label>
                      <input {...register('whatsappNumber')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" placeholder="03XX-XXXXXXX" />
                      <p className="text-xs italic text-[#6B7280]">Class access link will be sent to this number</p>
                      {errors.whatsappNumber && <p className="text-xs text-red-500">{errors.whatsappNumber.message}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#1A1A2E]">City</label>
                    <input {...register('city')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" />
                    {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                  </div>

                  <button type="button" onClick={handleNext} className="w-full rounded-xl bg-[#2D6A4F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43]">
                    Next
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#1A1A2E]">Payment Method</label>
                    <select {...register('paymentMethod')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A2E] transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]">
                      <option value="">Select payment method</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                    {paymentMethod && paymentInfoMap[paymentMethod] && (
                      <p className="text-xs italic text-[#6B7280]">{paymentInfoMap[paymentMethod]}</p>
                    )}
                    {errors.paymentMethod && <p className="text-xs text-red-500">{errors.paymentMethod.message}</p>}
                  </div>

                  <div className="flex items-start gap-2 rounded-xl border border-[#52B788]/30 bg-[#E1F5EE] p-3 text-sm text-[#2D6A4F]">
                    <ShieldCheck size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Send payment first, then enter your Transaction ID below.</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#1A1A2E]">Transaction ID / TID</label>
                    <input {...register('transactionId')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" placeholder="Enter the transaction ID from your payment receipt" />
                    <p className="text-xs italic text-[#6B7280]">Enter the TID/reference number from your JazzCash/EasyPaisa receipt</p>
                    {errors.transactionId && <p className="text-xs text-red-500">{errors.transactionId.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#1A1A2E]">Additional Notes</label>
                    <textarea {...register('additionalNotes')} rows="4" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-gray-300 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#52B788]" placeholder="Any questions or special requirements?" />
                  </div>

                  {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-[#6B7280] underline">
                      Back
                    </button>
                    <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#2D6A4F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43] disabled:cursor-not-allowed disabled:opacity-70">
                      {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
