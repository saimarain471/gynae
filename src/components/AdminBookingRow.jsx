import { useState } from 'react'
import {
  CheckCircle2, XCircle, MessageCircle,
  ChevronDown, ChevronUp,
} from 'lucide-react'
import { toWhatsAppNumber } from '../lib/phone'

const statusStyles = {
  pending:  'bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20',
  verified: 'bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20',
  rejected: 'bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20',
}

const rowBorder = {
  pending:  'border-l-4 border-l-[#D97706]',
  verified: 'border-l-4 border-l-[#16A34A]',
  rejected: 'border-l-4 border-l-[#DC2626]',
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
}

export default function AdminBookingRow({ booking, onStatusChange }) {
  const [expanded, setExpanded] = useState(false)

  const isClass = booking.booking_type === 'class'
  const status = booking.status || 'pending'

  const handleWhatsApp = () => {
    const num = toWhatsAppNumber(booking.whatsapp_number)
    let text
    if (isClass) {
      text = `Assalam o Alaikum ${booking.full_name}! Your payment for "${booking.class_title}" has been verified. Here is your class access link: [PASTE LINK HERE]. JazakAllah Khair! — Dr. Zainab Mohsin`
    } else {
      text = `Assalam o Alaikum ${booking.full_name}! Your consultation has been confirmed for ${booking.preferred_date} (${booking.preferred_time}). Here is your meeting link: [PASTE LINK HERE]. JazakAllah Khair! — Dr. Zainab Mohsin`
    }
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleReject = () => {
    if (window.confirm('Reject this booking? This will notify the status as rejected.')) {
      onStatusChange(booking.id, booking.booking_type, 'rejected')
    }
  }

  return (
    <>
      <tr className={`border-b border-gray-50 hover:bg-[#F0FDF4] transition-colors ${rowBorder[status] || ''}`}>
        {/* Date */}
        <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">
          {formatDateTime(booking.created_at)}
        </td>

        {/* Type */}
        <td className="px-4 py-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isClass ? 'bg-[#E1F5EE] text-[#2D6A4F]' : 'bg-[#EEF2FF] text-[#4338CA]'}`}>
            {isClass ? 'Class' : 'Consult'}
          </span>
        </td>

        {/* Patient */}
        <td className="px-4 py-3">
          <p className="text-sm font-semibold text-[#1A1A2E] whitespace-nowrap">{booking.full_name}</p>
          <p className="text-xs text-[#6B7280]">{booking.city}</p>
        </td>

        {/* Contact */}
        <td className="px-4 py-3">
          <p className="text-xs text-[#374151]">{booking.phone}</p>
          <p className="text-xs text-[#6B7280]">WA: {booking.whatsapp_number}</p>
        </td>

        {/* Service */}
        <td className="px-4 py-3 max-w-[160px]">
          <p className="text-xs font-medium text-[#1A1A2E] truncate">
            {isClass ? booking.class_title : 'Consultation'}
          </p>
          {!isClass && booking.preferred_date && (
            <p className="text-xs text-[#6B7280]">{booking.preferred_date} · {booking.preferred_time}</p>
          )}
        </td>

        {/* Amount */}
        <td className="px-4 py-3 whitespace-nowrap">
          <p className="text-sm font-semibold text-[#2D6A4F]">
            PKR {isClass ? (booking.class_price || '—') : '2,000'}
          </p>
        </td>

        {/* Payment */}
        <td className="px-4 py-3">
          <p className="text-xs text-[#374151]">{booking.payment_method}</p>
          <p className="text-xs font-mono text-[#6B7280] truncate max-w-[100px]">{booking.transaction_id}</p>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[status] || statusStyles.pending}`}>
            {status}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {/* Verify */}
            {(status === 'pending' || status === 'rejected') && (
              <button
                onClick={() => onStatusChange(booking.id, booking.booking_type, 'verified')}
                title="Mark as verified"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <CheckCircle2 size={16} className="text-[#16A34A]" />
              </button>
            )}

            {/* Reject */}
            {(status === 'pending' || status === 'verified') && (
              <button
                onClick={handleReject}
                title="Mark as rejected"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <XCircle size={16} className="text-[#DC2626]" />
              </button>
            )}

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              title="Send WhatsApp message"
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <MessageCircle size={16} className="text-[#25D366]" />
            </button>

            {/* Expand */}
            <button
              onClick={() => setExpanded(v => !v)}
              title="Toggle details"
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              {expanded
                ? <ChevronUp size={16} className="text-[#6B7280]" />
                : <ChevronDown size={16} className="text-[#6B7280]" />
              }
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="border-b border-gray-50">
          <td colSpan={9} className="px-4 pb-4">
            <div className="bg-[#F9FAFB] rounded-xl p-4 text-sm text-[#6B7280] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-[#1A1A2E] mb-0.5">Email</p>
                <p>{booking.email || '—'}</p>
              </div>
              {!isClass && booking.concern && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-[#1A1A2E] mb-0.5">Concern</p>
                  <p className="leading-relaxed">{booking.concern}</p>
                </div>
              )}
              {booking.additional_notes && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-[#1A1A2E] mb-0.5">Additional Notes</p>
                  <p className="leading-relaxed">{booking.additional_notes}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-[#1A1A2E] mb-0.5">Booking ID</p>
                <p className="font-mono text-xs">{booking.id}</p>
              </div>
              {isClass && (
                <div>
                  <p className="text-xs font-semibold text-[#1A1A2E] mb-0.5">Class ID</p>
                  <p className="font-mono text-xs">{booking.class_id}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
