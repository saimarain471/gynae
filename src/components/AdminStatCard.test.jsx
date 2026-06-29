import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminStatCard from './AdminStatCard'
import { BookOpen } from 'lucide-react'

describe('AdminStatCard', () => {
  const defaultProps = {
    icon: BookOpen,
    label: 'Total Bookings',
    value: 42,
    color: 'bg-green-500',
    loading: false,
  }

  it('renders the label', () => {
    render(<AdminStatCard {...defaultProps} />)
    expect(screen.getByText('Total Bookings')).toBeInTheDocument()
  })

  it('renders the value when not loading', () => {
    render(<AdminStatCard {...defaultProps} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders loading skeleton when loading is true', () => {
    const { container } = render(<AdminStatCard {...defaultProps} loading={true} />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).not.toBeNull()
  })

  it('does not render value when loading', () => {
    render(<AdminStatCard {...defaultProps} loading={true} />)
    expect(screen.queryByText('42')).not.toBeInTheDocument()
  })

  it('applies color class to icon container', () => {
    const { container } = render(<AdminStatCard {...defaultProps} />)
    const iconContainer = container.querySelector('.bg-green-500')
    expect(iconContainer).not.toBeNull()
  })

  it('renders the icon', () => {
    const { container } = render(<AdminStatCard {...defaultProps} />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })
})
