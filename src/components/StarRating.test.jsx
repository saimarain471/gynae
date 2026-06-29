import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StarRating from './StarRating'

describe('StarRating', () => {
  it('renders 5 star buttons', () => {
    const { container } = render(<StarRating rating={3} />)
    const buttons = container.querySelectorAll('button')
    expect(buttons).toHaveLength(5)
  })

  it('fills stars up to the rating value', () => {
    const { container } = render(<StarRating rating={3} />)
    const svgs = container.querySelectorAll('svg')
    const filled = Array.from(svgs).filter((svg) => svg.getAttribute('fill') === '#F4A261')
    expect(filled).toHaveLength(3)
  })

  it('leaves stars empty above the rating value', () => {
    const { container } = render(<StarRating rating={2} />)
    const svgs = container.querySelectorAll('svg')
    const empty = Array.from(svgs).filter((svg) => svg.getAttribute('fill') === 'none')
    expect(empty).toHaveLength(3)
  })

  it('renders all stars filled for rating 5', () => {
    const { container } = render(<StarRating rating={5} />)
    const svgs = container.querySelectorAll('svg')
    const filled = Array.from(svgs).filter((svg) => svg.getAttribute('fill') === '#F4A261')
    expect(filled).toHaveLength(5)
  })

  it('renders no stars filled for rating 0', () => {
    const { container } = render(<StarRating rating={0} />)
    const svgs = container.querySelectorAll('svg')
    const empty = Array.from(svgs).filter((svg) => svg.getAttribute('fill') === 'none')
    expect(empty).toHaveLength(5)
  })

  it('sets tabIndex to -1 when not interactive', () => {
    const { container } = render(<StarRating rating={3} />)
    const buttons = container.querySelectorAll('button')
    buttons.forEach((btn) => {
      expect(btn.getAttribute('tabindex')).toBe('-1')
    })
  })

  it('sets tabIndex to 0 when interactive', () => {
    const { container } = render(<StarRating rating={3} interactive={true} onRate={() => {}} />)
    const buttons = container.querySelectorAll('button')
    buttons.forEach((btn) => {
      expect(btn.getAttribute('tabindex')).toBe('0')
    })
  })

  it('calls onRate with star number when interactive', () => {
    const onRate = vi.fn()
    render(<StarRating rating={3} interactive={true} onRate={onRate} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[3])
    expect(onRate).toHaveBeenCalledWith(4)
  })

  it('does not call onRate when not interactive', () => {
    const onRate = vi.fn()
    const { container } = render(<StarRating rating={3} onRate={onRate} />)
    const buttons = container.querySelectorAll('button')
    fireEvent.click(buttons[0])
    expect(onRate).not.toHaveBeenCalled()
  })

  it('provides aria-labels when interactive', () => {
    render(<StarRating rating={3} interactive={true} onRate={() => {}} />)
    expect(screen.getByLabelText('Rate 1 star')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 2 stars')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 5 stars')).toBeInTheDocument()
  })
})
