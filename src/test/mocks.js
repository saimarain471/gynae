import { vi } from 'vitest'

export const mockPosthog = {
  capture: vi.fn(),
  init: vi.fn(),
}

vi.mock('../lib/posthog', () => ({
  posthog: mockPosthog,
  initPostHog: vi.fn(),
}))
