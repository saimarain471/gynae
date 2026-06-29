import { vi } from 'vitest'

export const mockPosthog = {
  capture: vi.fn(),
  init: vi.fn(),
}

vi.mock('../lib/posthog', () => ({
  posthog: {
    capture: vi.fn(),
    init: vi.fn(),
  },
  initPostHog: vi.fn(),
}))
