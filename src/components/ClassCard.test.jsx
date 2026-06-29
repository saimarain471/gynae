import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ClassCard from './ClassCard'

vi.mock('../lib/posthog', () => ({
  posthog: { capture: vi.fn() },
}))

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('ClassCard', () => {
  const defaultClassData = {
    id: 1,
    title: 'Pregnancy Week by Week',
    category: 'Prenatal',
    description: 'Everything you need to know about each trimester.',
    duration: '6 hours',
    lessons: 12,
    priceLabel: 'PKR 3,500',
  }

  it('renders loading skeleton when loading is true', () => {
    const { container } = renderWithRouter(<ClassCard loading={true} />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).not.toBeNull()
  })

  it('does not render class data when loading', () => {
    renderWithRouter(<ClassCard loading={true} classData={defaultClassData} />)
    expect(screen.queryByText('Pregnancy Week by Week')).not.toBeInTheDocument()
  })

  it('renders class title', () => {
    renderWithRouter(<ClassCard classData={defaultClassData} />)
    expect(screen.getByText('Pregnancy Week by Week')).toBeInTheDocument()
  })

  it('renders class description', () => {
    renderWithRouter(<ClassCard classData={defaultClassData} />)
    expect(screen.getByText('Everything you need to know about each trimester.')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    renderWithRouter(<ClassCard classData={defaultClassData} />)
    expect(screen.getByText('Prenatal')).toBeInTheDocument()
  })

  it('renders duration', () => {
    renderWithRouter(<ClassCard classData={defaultClassData} />)
    expect(screen.getByText('6 hours')).toBeInTheDocument()
  })

  it('renders lessons count', () => {
    renderWithRouter(<ClassCard classData={defaultClassData} />)
    expect(screen.getByText('12 lessons')).toBeInTheDocument()
  })

  it('renders price label', () => {
    renderWithRouter(<ClassCard classData={defaultClassData} />)
    expect(screen.getByText('PKR 3,500')).toBeInTheDocument()
  })

  it('renders enroll link pointing to correct URL', () => {
    renderWithRouter(<ClassCard classData={defaultClassData} />)
    const link = screen.getByRole('link', { name: /Enroll now/i })
    expect(link).toHaveAttribute('href', '/book-class/1')
  })

  it('captures posthog event on click', async () => {
    const { posthog } = await import('../lib/posthog')
    posthog.capture.mockClear()
    renderWithRouter(<ClassCard classData={defaultClassData} />)
    const link = screen.getByRole('link', { name: /Enroll now/i })
    fireEvent.click(link)
    expect(posthog.capture).toHaveBeenCalledWith('class_card_clicked', {
      classId: 1,
      classTitle: 'Pregnancy Week by Week',
    })
  })

  it('uses correct color for Postnatal category', () => {
    const postnatalData = { ...defaultClassData, category: 'Postnatal' }
    const { container } = renderWithRouter(<ClassCard classData={postnatalData} />)
    const colorBar = container.querySelector('[style*="background-color"]')
    expect(colorBar.style.backgroundColor).toBe('rgb(82, 183, 136)')
  })

  it('uses correct color for Baby Care category', () => {
    const babyCareData = { ...defaultClassData, category: 'Baby Care' }
    const { container } = renderWithRouter(<ClassCard classData={babyCareData} />)
    const colorBar = container.querySelector('[style*="background-color"]')
    expect(colorBar.style.backgroundColor).toBe('rgb(244, 162, 97)')
  })

  it('falls back to default color for unknown category', () => {
    const unknownData = { ...defaultClassData, category: 'Unknown' }
    const { container } = renderWithRouter(<ClassCard classData={unknownData} />)
    const colorBar = container.querySelector('[style*="background-color"]')
    expect(colorBar.style.backgroundColor).toBe('rgb(45, 106, 79)')
  })
})
