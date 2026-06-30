const fs = require('fs')
const path = require('path')

const BASE_URL = process.env.SITE_URL || 'https://gynae.vercel.app'

const routes = [
  '/',
  '/about',
  '/classes',
  '/booking',
  '/thank-you',
  '/blog',
  '/faqs',
  '/testimonials',
  '/admin'
]

function generate() {
  const pages = routes.map((r) => `  <url>\n    <loc>${BASE_URL}${r}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages}\n</urlset>`

  const outDir = path.join(__dirname, '..', 'public')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8')
  console.log('Generated public/sitemap.xml')
}

generate()
