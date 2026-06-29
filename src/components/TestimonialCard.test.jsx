import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TestimonialCard from './TestimonialCard'

// Extract getInitials for direct testing
function getInitials(name = '') {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

describe('getInitials utility', () => {
  it('returns two-letter initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('returns uppercase initials', () => {
    expect(getInitials('alice bob')).toBe('AB')
  })

  it('handles single name by taking first two characters', () => {
    expect(getInitials('Alice')).toBe('AL')
  })

  it('handles empty string', () => {
    expect(getInitials('')).toBe('')
  })

  it('handles names with extra spaces', () => {
    expect(getInitials('  Sarah Khan  ')).toBe('SK')
  })

  it('handles names with multiple parts', () => {
    expect(getInitials('Dr Zainab Mohsin')).toBe('DZ')
  })
})

describe('TestimonialCard', () => {
  it('renders patient name', () => {
    render(
      <TestimonialCard
        patient_name="Sarah Khan"
        city="Lahore"
        rating={5}
        review_text="Great experience"
      />
    )
    expect(screen.getByText('Sarah Khan')).toBeInTheDocument()
  })

  it('renders review text with quotes', () => {
    render(
      <TestimonialCard
        patient_name="Test User"
        rating={4}
        review_text="Excellent doctor"
      />
    )
    expect(screen.getByText(/Excellent doctor/)).toBeInTheDocument()
  })

  it('renders city', () => {
    render(
      <TestimonialCard
        patient_name="User"
        city="Islamabad"
        rating={5}
        review_text="Good"
      />
    )
    expect(screen.getByText('Islamabad')).toBeInTheDocument()
  })

  it('renders service type badge', () => {
    render(
      <TestimonialCard
        patient_name="User"
        rating={5}
        review_text="Review"
        service_type="Prenatal"
      />
    )
    expect(screen.getByText('Prenatal')).toBeInTheDocument()
  })

  it('falls back to legacy props', () => {
    render(
      <TestimonialCard
        name="Legacy Name"
        title="Karachi"
        quote="Legacy quote"
      />
    )
    expect(screen.getByText('Legacy Name')).toBeInTheDocument()
    expect(screen.getByText('Karachi')).toBeInTheDocument()
    expect(screen.getByText(/Legacy quote/)).toBeInTheDocument()
  })

  it('falls back to Anonymous when no name provided', () => {
    render(<TestimonialCard rating={5} review_text="Test" />)
    expect(screen.getByText('Anonymous')).toBeInTheDocument()
  })

  it('renders initials avatar', () => {
    render(
      <TestimonialCard
        patient_name="Sarah Khan"
        rating={5}
        review_text="Test"
      />
    )
    expect(screen.getByText('SK')).toBeInTheDocument()
  })

  it('renders formatted date when created_at is provided', () => {
    render(
      <TestimonialCard
        patient_name="User"
        rating={5}
        review_text="Test"
        created_at="2024-03-15T00:00:00Z"
      />
    )
    expect(screen.getByText(/Mar 2024/)).toBeInTheDocument()
  })

  it('applies featured styling when featured prop is true', () => {
    const { container } = render(
      <TestimonialCard
        patient_name="User"
        rating={5}
        review_text="Test"
        featured={true}
      />
    )
    const article = container.querySelector('article')
    expect(article.className).toContain('border-l-4')
  })
})
