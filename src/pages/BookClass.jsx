import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { classes } from '../data/classes'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import PaymentInstructions from '../components/PaymentInstructions'

const schema = z.object({
  fullName: z.string().min(3, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter your phone number.'),
  whatsappNumber: z.string().min(10, 'Please enter your WhatsApp number.'),
  city: z.string().min(2, 'Please enter your city.'),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { paymentMethod: '' } })

  useEffect(() => {
    if (!classData) return
    posthog.capture('class_detail_viewed', { classId: classData.id, classTitle: classData.title })
  }, [classData])

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
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000'
    const message = `Assalam o Alaikum Dr. Zainab! I have enrolled in ${classData.title} and sent payment via ${paymentMethod}. My Transaction ID is ${transactionId}. My name is ${fullName}.`
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const onSubmit = async (values) => {
    setSubmitError('')
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

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-3 rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-text">Enroll in {classData.title}</h1>
          <p className="text-sm leading-7 text-text-muted">You are enrolling in: {classData.title} — PKR {classData.price}</p>
        </div>

        <PaymentInstructions />

        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-text">Booking Form</h2>
          <p className="mt-2 text-sm leading-7 text-text-muted">
            Complete the booking form, send payment manually, and submit the transaction details below.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                ✓
              </div>
              <h3 className="text-xl font-semibold text-text">Your booking has been received!</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">
                Dr. Zainab will verify your payment and send your class access link to your WhatsApp within a few hours.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => posthog.capture('whatsapp_confirm_clicked', { type: 'class' })}
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43]"
              >
                Confirm on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => navigate('/classes')}
                className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-text transition hover:bg-slate-50"
              >
                Browse More Classes
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">Full Name</label>
                  <input {...register('fullName')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" />
                  {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">Email Address</label>
                  <input {...register('email')} type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">Phone Number</label>
                  <input {...register('phone')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="03XX-XXXXXXX" />
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">WhatsApp Number</label>
                  <input {...register('whatsappNumber')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="03XX-XXXXXXX" />
                  {errors.whatsappNumber && <p className="mt-2 text-sm text-red-600">{errors.whatsappNumber.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">City</label>
                  <input {...register('city')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" />
                  {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">Payment Method</label>
                  <select {...register('paymentMethod')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary">
                    <option value="">Select payment method</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  {errors.paymentMethod && <p className="mt-2 text-sm text-red-600">{errors.paymentMethod.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text">Transaction ID / TID</label>
                <input {...register('transactionId')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="Enter the transaction ID from your payment receipt" />
                {errors.transactionId && <p className="mt-2 text-sm text-red-600">{errors.transactionId.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text">Additional Notes</label>
                <textarea {...register('additionalNotes')} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="Any questions or special requirements?" />
              </div>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43] disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
