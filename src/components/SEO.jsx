import { useEffect } from 'react'

function setMetaTag(name, attr = 'name', value) {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export default function SEO({ title, description, url, image, meta = [] }) {
  const siteTitle = 'Dr. Zainab Mohsin — Gynecologist & Online Pregnancy Classes'
  const siteUrl = url || 'https://gynae.vercel.app'
  const siteImage = image || `${siteUrl}/og-image.jpg`
  const metaDescription = description || 'Learn pregnancy care, safe delivery, newborn baby care, and breastfeeding with Dr. Zainab Mohsin.'

  useEffect(() => {
    if (title) document.title = `${title} — ${siteTitle}`
    else document.title = siteTitle

    setMetaTag('description', 'name', metaDescription)
    setMetaTag('og:title', 'property', title ? `${title} — ${siteTitle}` : siteTitle)
    setMetaTag('og:description', 'property', metaDescription)
    setMetaTag('og:url', 'property', siteUrl)
    setMetaTag('og:image', 'property', siteImage)
    setMetaTag('twitter:title', 'name', title ? `${title} — ${siteTitle}` : siteTitle)
    setMetaTag('twitter:description', 'name', metaDescription)
    setMetaTag('twitter:image', 'name', siteImage)

    // custom meta entries
    meta.forEach((m) => {
      if (m.property) setMetaTag(m.property, 'property', m.content)
      else if (m.name) setMetaTag(m.name, 'name', m.content)
    })
  }, [title, description, url, image, meta, metaDescription, siteTitle, siteUrl, siteImage])

  return null
}
