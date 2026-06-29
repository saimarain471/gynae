/**
 * Reusable full-page loading spinner.
 * Used across BlogPost, and other loading states.
 *
 * @param {Object} props
 * @param {string} [props.message] - Text below the spinner
 */
export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#52B788] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#6B7280] text-sm">{message}</p>
      </div>
    </div>
  )
}
