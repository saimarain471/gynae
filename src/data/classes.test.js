import { describe, it, expect } from 'vitest'
import { classes } from './classes'

describe('classes data', () => {
  it('exports an array of 6 classes', () => {
    expect(Array.isArray(classes)).toBe(true)
    expect(classes).toHaveLength(6)
  })

  it('each class has required fields', () => {
    const requiredFields = ['id', 'title', 'category', 'description', 'duration', 'lessons', 'price', 'priceLabel']

    classes.forEach((cls) => {
      requiredFields.forEach((field) => {
        expect(cls).toHaveProperty(field)
      })
    })
  })

  it('each class has a unique id', () => {
    const ids = classes.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all prices are positive numbers', () => {
    classes.forEach((cls) => {
      expect(cls.price).toBeGreaterThan(0)
      expect(typeof cls.price).toBe('number')
    })
  })

  it('all lessons counts are positive integers', () => {
    classes.forEach((cls) => {
      expect(cls.lessons).toBeGreaterThan(0)
      expect(Number.isInteger(cls.lessons)).toBe(true)
    })
  })

  it('categories are valid values', () => {
    const validCategories = ['Prenatal', 'Postnatal', 'Baby Care']
    classes.forEach((cls) => {
      expect(validCategories).toContain(cls.category)
    })
  })

  it('priceLabel format matches PKR pattern', () => {
    classes.forEach((cls) => {
      expect(cls.priceLabel).toMatch(/^PKR \d{1,3}(,\d{3})*$/)
    })
  })
})
