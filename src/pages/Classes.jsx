import { useEffect, useMemo, useState } from 'react'
import ClassCard from '../components/ClassCard'
import { classes } from '../data/classes'
import { posthog } from '../lib/posthog'

const filters = ['All', 'Prenatal', 'Postnatal', 'Baby Care']

export default function Classes() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredClasses = useMemo(() => {
    if (activeFilter === 'All') return classes
    return classes.filter((item) => item.category === activeFilter)
  }, [activeFilter])

  const handleFilter = (value) => {
    setActiveFilter(value)
    posthog.capture('class_filter_used', { filter: value })
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Online Classes</p>
          <h1 className="mt-3 text-3xl font-semibold text-text">Online Classes for Expecting & New Mothers</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">
            Choose the class that suits your pregnancy stage or newborn care needs, then book with a simple manual payment and WhatsApp confirmation.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeFilter === filter ? 'bg-primary text-white' : 'bg-slate-100 text-text-muted hover:bg-slate-200'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array(6).fill(0).map((_, i) => <ClassCard key={i} loading={true} />)
            : filteredClasses.map((classData) => <ClassCard key={classData.id} classData={classData} />)}
        </div>
      </div>
    </main>
  )
}
