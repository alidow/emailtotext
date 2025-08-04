/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sentry error handling
  sentry: {
    hideSourceMaps: true,
  },
}

// Wrap with Sentry config in production
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const { withSentryConfig } = require('@sentry/nextjs')
  module.exports = withSentryConfig(nextConfig, {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  })
} else {
  module.exports = nextConfig
}