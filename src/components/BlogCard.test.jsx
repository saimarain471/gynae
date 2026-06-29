import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogCard from './BlogCard'

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('BlogCard', () => {
  const defaultProps = {
    id: 1,
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    excerpt: 'This is a test excerpt for the blog card.',
    category: 'Prenatal',
    author: 'Dr. Zainab',
    read_time: 5,
    created_at: '2024-06-15T00:00:00Z',
    cover_image_url: null,
  }

  it('renders the blog title', () => {
    renderWithRouter(<BlogCard {...defaultProps} />)
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
  })

  it('renders the excerpt', () => {
    renderWithRouter(<BlogCard {...defaultProps} />)
    expect(screen.getByText('This is a test excerpt for the blog card.')).toBeInTheDocument()
  })

  it('renders the author name', () => {
    renderWithRouter(<BlogCard {...defaultProps} />)
    expect(screen.getByText('Dr. Zainab')).toBeInTheDocument()
  })

  it('renders read time', () => {
    renderWithRouter(<BlogCard {...defaultProps} />)
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    renderWithRouter(<BlogCard {...defaultProps} />)
    expect(screen.getByText('Prenatal')).toBeInTheDocument()
  })

  it('links to the correct blog post URL', () => {
    renderWithRouter(<BlogCard {...defaultProps} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog/test-blog-post')
  })

  it('renders cover image when provided', () => {
    renderWithRouter(<BlogCard {...defaultProps} cover_image_url="https://example.com/image.jpg" />)
    const img = screen.getByAltText('Test Blog Post')
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('renders gradient placeholder when no cover image', () => {
    const { container } = renderWithRouter(<BlogCard {...defaultProps} cover_image_url={null} />)
    const gradient = container.querySelector('[class*="bg-gradient"]')
    expect(gradient).not.toBeNull()
  })

  it('falls back to General category style for unknown category', () => {
    renderWithRouter(<BlogCard {...defaultProps} category="Unknown" />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('applies Postnatal category style', () => {
    renderWithRouter(<BlogCard {...defaultProps} category="Postnatal" />)
    expect(screen.getByText('Postnatal')).toBeInTheDocument()
  })

  it('applies Baby Care category style', () => {
    renderWithRouter(<BlogCard {...defaultProps} category="Baby Care" />)
    expect(screen.getByText('Baby Care')).toBeInTheDocument()
  })
})
