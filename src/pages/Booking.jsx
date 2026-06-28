import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { posthog } from '../lib/posthog'
import PaymentInstructions from '../components/PaymentInstructions'

const schema = z.object({
  fullName: z.string().min(3, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter your phone number.'),
  whatsappNumber: z.string().min(10, 'Please enter your WhatsApp number.'),
  city: z.string().min(2, 'Please enter your city.'),
  preferredDate: z.string().min(10, 'Please enter a preferred date.'),
  preferredTimeSlot: z.enum(['Morning (9 AM – 12 PM)', 'Afternoon (12 PM – 3 PM)', 'Evening (4 PM – 7 PM)'], 'Please select a time slot.'),
  concern: z.string().min(20, 'Please describe your concern in at least 20 characters.'),
  paymentMethod: z.enum(['JazzCash', 'EasyPaisa', 'Bank Transfer'], 'Please select a payment method.'),
  transactionId: z.string().min(3, 'Please enter your transaction ID.'),
  additionalNotes: z.string().optional(),
})

export default function Booking() {
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { paymentMethod: '', preferredTimeSlot: '' } })

  const buildWhatsappLink = ({ fullName, paymentMethod, transactionId, preferredDate, preferredTimeSlot }) => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '03314896544'
    const message = `Assalam o Alaikum Dr. Zainub! I have booked a consultation and sent payment via ${paymentMethod}. My Transaction ID is ${transactionId}. Preferred time: ${preferredDate} ${preferredTimeSlot}. My name is ${fullName}.`
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const onSubmit = async (values) => {
    setSubmitError('')
    setStatus('submitting')

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

    setWhatsappUrl(buildWhatsappLink(values))
    setStatus('success')
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="space-y-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-text">Consultation Booking</h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            Consultation fee: PKR 2,000 — 30 minute video call with Dr. Zainub Mohsin.
          </p>
        </section>

        <PaymentInstructions />

        <section className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-text">What to Expect</h2>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-text-muted">
              <li>• Video call via Google Meet.</li>
              <li>• 30 minutes of personalized medical guidance.</li>
              <li>• Pregnancy, postpartum, and baby care support.</li>
              <li>• Practical steps for next actions and follow-up.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            {status === 'success' ? (
              <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 size={36} className="text-[#2D6A4F]" />
                </div>
                <h2 className="text-xl font-semibold text-text">Booking received!</h2>
                <div className="mx-auto mt-3 max-w-sm space-y-2 text-sm leading-7 text-text-muted">
                  <p>Your booking has been saved. Dr. Zainab has been notified automatically.</p>
                  <p className="font-medium text-[#2D6A4F]">Dr. Zainab will confirm your appointment time and send the meeting link to your WhatsApp.</p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => posthog.capture('whatsapp_confirm_clicked', { type: 'consultation' })}
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43]"
                >
                  Confirm on WhatsApp
                </a>
                <p className="mt-4 text-xs text-[#6B7280]">You will also receive a confirmation email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text">Full Name</span>
                    <input {...register('fullName')} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" />
                    {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-text">Email Address</span>
                    <input {...register('email')} type="email" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text">Phone Number</span>
                    <input {...register('phone')} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="03XX-XXXXXXX" />
                    {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-text">WhatsApp Number</span>
                    <input {...register('whatsappNumber')} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="03XX-XXXXXXX" />
                    {errors.whatsappNumber && <p className="mt-2 text-sm text-red-600">{errors.whatsappNumber.message}</p>}
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-text">City</span>
                  <input {...register('city')} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" />
                  {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
                </label>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text">Preferred Date</span>
                    <input {...register('preferredDate')} type="date" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" />
                    {errors.preferredDate && <p className="mt-2 text-sm text-red-600">{errors.preferredDate.message}</p>}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-text">Preferred Time Slot</span>
                    <select {...register('preferredTimeSlot')} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary">
                      <option value="">Choose a time slot</option>
                      <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
                      <option value="Afternoon (12 PM – 3 PM)">Afternoon (12 PM – 3 PM)</option>
                      <option value="Evening (4 PM – 7 PM)">Evening (4 PM – 7 PM)</option>
                    </select>
                    {errors.preferredTimeSlot && <p className="mt-2 text-sm text-red-600">{errors.preferredTimeSlot.message}</p>}
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-text">Your Concern</span>
                  <textarea {...register('concern')} rows="4" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="Briefly describe what you'd like to discuss" />
                  {errors.concern && <p className="mt-2 text-sm text-red-600">{errors.concern.message}</p>}
                </label>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-text">Payment Method</span>
                    <select {...register('paymentMethod')} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary">
                      <option value="">Select payment method</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                    {errors.paymentMethod && <p className="mt-2 text-sm text-red-600">{errors.paymentMethod.message}</p>}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-text">Transaction ID</span>
                    <input {...register('transactionId')} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="Enter the transaction ID from your payment receipt" />
                    {errors.transactionId && <p className="mt-2 text-sm text-red-600">{errors.transactionId.message}</p>}
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-text">Additional Notes</span>
                  <textarea {...register('additionalNotes')} rows="4" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-text outline-none transition focus:border-primary" placeholder="Any questions or special requirements?" />
                </label>

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43] disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
