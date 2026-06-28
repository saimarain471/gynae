import { useState } from 'react'

export default function About() {
  const [imgError, setImgError] = useState(false)

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="rounded-[1.5rem] bg-green-100 p-10 text-center text-text">
            <div className="mx-auto flex h-72 w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-white">
              {!imgError ? (
                <img
                  src="/dr-zainab.jpg"
                  alt="Dr. Zainab Mohsin — Consultant Gynecologist"
                  className="h-full w-full object-cover object-top"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#E1F5EE]">
                  <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#2D6A4F]/10">
                    <span className="text-2xl font-bold text-[#2D6A4F] font-['Playfair_Display']">ZM</span>
                  </div>
                  <p className="text-sm font-semibold text-[#2D6A4F]">Dr. Zainab Mohsin</p>
                  <p className="mt-1 text-xs text-[#6B7280]">Photo coming soon</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">About Dr. Zainub</p>
            <h1 className="text-4xl font-semibold text-text">Dr. Zainub Mohsin, MBBS, FCPS</h1>
            <p className="text-base leading-7 text-text-muted">
              Dr. Zainub Mohsin is a consultant gynecologist and obstetrics specialist with over 10 years of experience supporting Pakistani mothers through pregnancy, delivery, and newborn care.
            </p>
          </div>
          <div className="space-y-4 text-sm leading-7 text-text-muted">
            <p>
              She teaches evidence-based prenatal health, delivery preparation, breastfeeding support, postpartum recovery, and newborn baby care with a compassionate and practical approach.
            </p>
            <p>
              Her online classes are designed for busy mothers who want trusted guidance, clear step-by-step advice, and real support for the early months of motherhood.
            </p>
            <p>
              Dr. Zainub believes every mother deserves to be informed, empowered, and supported through every stage of pregnancy and beyond.
            </p>
          </div>
          <blockquote className="rounded-3xl border-l-4 border-secondary bg-secondary/10 p-6 text-text">
            <p className="text-lg font-semibold">“Every mother deserves to be informed, empowered, and supported.”</p>
          </blockquote>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-text">Education & Experience</h2>
            <ul className="mt-4 space-y-3 text-sm text-text-muted">
              <li>MBBS from a top medical university</li>
              <li>FCPS in Gynecology & Obstetrics</li>
              <li>10+ years of clinical and online education experience</li>
              <li>Support for prenatal, postnatal, and newborn care</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text">What she teaches</h2>
            <ul className="mt-4 space-y-3 text-sm text-text-muted">
              <li>Trimester-by-trimester pregnancy care</li>
              <li>Safe delivery preparation and hospital readiness</li>
              <li>Breastfeeding and newborn feeding guidance</li>
              <li>Postpartum recovery and emotional wellness</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text">Personal story</h2>
            <p className="mt-4 text-sm leading-7 text-text-muted">
              As a doctor and educator, she blends clinical experience with warm support to help families feel secure and ready for the journey ahead.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
