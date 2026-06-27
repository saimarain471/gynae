export default function TestimonialCard({ name, title, quote }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm leading-7 text-text-muted">“{quote}”</p>
      <div className="mt-6">
        <p className="text-sm font-semibold text-text">{name}</p>
        <p className="text-sm text-text-muted">{title}</p>
      </div>
    </article>
  )
}
