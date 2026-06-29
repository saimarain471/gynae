import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingSchema } from './bookingSchema'

export default function BookingForm({ submitLabel, onSubmit, children }) {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(bookingSchema), defaultValues: { paymentMethod: '' } })

  const submit = async (values) => {
    setErrorMessage('')
    setLoading(true)

    try {
      await onSubmit(values)
      setSuccessMessage('Your booking has been received! Dr. Zainub will verify your payment and send your class access link to your WhatsApp within a few hours.')
      reset({ paymentMethod: '' })
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again or contact us on WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {successMessage && (
        <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{errorMessage}</div>
      )}

      {children({ register, errors })}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245c43] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  )
}
