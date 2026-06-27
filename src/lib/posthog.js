import posthog from 'posthog-js'

export const initPostHog = () => {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: true,
    autocapture: true,
  })
}

export { posthog }
