import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FAQAccordion from './FAQAccordion'

vi.mock('../lib/posthog', () => ({
  posthog: { capture: vi.fn() },
}))

describe('FAQAccordion', () => {
  const defaultProps = {
    question: 'What is prenatal care?',
    answer: 'Prenatal care is the healthcare you get while pregnant.',
    isOpen: false,
    onToggle: vi.fn(),
  }

  it('renders the question', () => {
    render(<FAQAccordion {...defaultProps} />)
    expect(screen.getByText('What is prenatal care?')).toBeInTheDocument()
  })

  it('renders the answer text', () => {
    render(<FAQAccordion {...defaultProps} />)
    expect(screen.getByText('Prenatal care is the healthcare you get while pregnant.')).toBeInTheDocument()
  })

  it('sets aria-expanded to false when closed', () => {
    render(<FAQAccordion {...defaultProps} isOpen={false} />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('sets aria-expanded to true when open', () => {
    render(<FAQAccordion {...defaultProps} isOpen={true} />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('calls onToggle when button is clicked', () => {
    const onToggle = vi.fn()
    render(<FAQAccordion {...defaultProps} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('captures posthog event when opening (isOpen was false)', async () => {
    const { posthog } = await import('../lib/posthog')
    const onToggle = vi.fn()
    render(<FAQAccordion {...defaultProps} isOpen={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(posthog.capture).toHaveBeenCalledWith('faq_opened', { question: 'What is prenatal care?' })
  })

  it('does not capture posthog event when closing (isOpen was true)', async () => {
    const { posthog } = await import('../lib/posthog')
    posthog.capture.mockClear()
    const onToggle = vi.fn()
    render(<FAQAccordion {...defaultProps} isOpen={true} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it('hides answer panel when closed via CSS classes', () => {
    const { container } = render(<FAQAccordion {...defaultProps} isOpen={false} />)
    const panel = container.querySelector('[class*="max-h-0"]')
    expect(panel).not.toBeNull()
  })

  it('shows answer panel when open via CSS classes', () => {
    const { container } = render(<FAQAccordion {...defaultProps} isOpen={true} />)
    const panel = container.querySelector('[class*="max-h-"]')
    expect(panel.className).toContain('max-h-[600px]')
  })
})
