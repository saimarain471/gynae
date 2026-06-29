import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('initPostHog', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('does not initialize when VITE_POSTHOG_KEY is not set', async () => {
    vi.stubEnv('VITE_POSTHOG_KEY', '')

    const posthogModule = await import('posthog-js')
    const spy = vi.spyOn(posthogModule.default, 'init')

    // Re-import to get fresh module
    const { initPostHog } = await import('./posthog')
    initPostHog()

    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
    vi.unstubAllEnvs()
  })
})
