export default function GynaeBackground({ variant = 'default' }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {variant === 'default' && (
        <>
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-[#E1F5EE] to-[#B7E4C7] opacity-40" />
          <div className="absolute -left-16 bottom-20 h-64 w-64 rounded-full bg-[#E1F5EE] opacity-30" />
          <svg className="absolute left-8 top-24 h-16 w-48 opacity-[0.07]" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30 L40 30 L55 5 L70 55 L85 15 L100 45 L115 30 L200 30" stroke="#2D6A4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg className="absolute -right-8 top-1/3 h-40 w-40 opacity-[0.05]" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="55" rx="30" ry="35" stroke="#2D6A4F" strokeWidth="2.5" />
            <path d="M20 55 C10 55 5 45 5 35 C5 25 12 18 20 18" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M80 55 C90 55 95 45 95 35 C95 25 88 18 80 18" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="5" cy="18" r="5" stroke="#2D6A4F" strokeWidth="2" />
            <circle cx="95" cy="18" r="5" stroke="#2D6A4F" strokeWidth="2" />
            <ellipse cx="50" cy="75" rx="12" ry="8" stroke="#2D6A4F" strokeWidth="2" />
          </svg>
          <svg className="absolute bottom-16 right-12 h-48 w-20 opacity-[0.06]" viewBox="0 0 50 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[0, 15, 30, 45, 60, 75, 90, 105].map((y, i) => (
              <g key={y}>
                <circle cx={i % 2 === 0 ? 10 : 40} cy={y + 8} r="4" fill="#2D6A4F" />
                <line x1={i % 2 === 0 ? 10 : 40} y1={y + 8} x2={i % 2 === 0 ? 40 : 10} y2={y + 8} stroke="#52B788" strokeWidth="1.5" strokeDasharray="3 2" />
              </g>
            ))}
          </svg>
          <svg className="absolute -left-6 top-1/2 h-24 w-24 opacity-[0.06]" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="36" stroke="#2D6A4F" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="40" cy="40" r="20" stroke="#52B788" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="6" fill="#2D6A4F" opacity="0.4" />
          </svg>
          {[[85, 15], [10, 60], [90, 75]].map(([x, y], i) => (
            <svg key={i} className="absolute opacity-[0.08]" style={{ left: `${x}%`, top: `${y}%`, width: '20px', height: '20px' }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="2" width="4" height="16" rx="2" fill="#2D6A4F" />
              <rect x="2" y="8" width="16" height="4" rx="2" fill="#2D6A4F" />
            </svg>
          ))}
        </>
      )}

      {variant === 'classes' && (
        <>
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-bl from-[#E1F5EE] to-transparent opacity-60" />
          <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#FFF3E8] opacity-40" />
          <svg className="absolute left-4 top-16 h-32 w-32 opacity-[0.06]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="28" r="18" stroke="#2D6A4F" strokeWidth="2.5" />
            <ellipse cx="50" cy="68" rx="22" ry="26" stroke="#2D6A4F" strokeWidth="2.5" />
            <path d="M28 60 C18 55 14 48 18 42" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M72 60 C82 55 86 48 82 42" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="17" cy="40" r="4" stroke="#2D6A4F" strokeWidth="2" />
            <circle cx="83" cy="40" r="4" stroke="#2D6A4F" strokeWidth="2" />
          </svg>
          <svg className="absolute bottom-20 right-8 h-14 w-56 opacity-[0.06]" viewBox="0 0 220 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 27 L50 27 L65 5 L80 50 L95 15 L110 40 L125 27 L220 27" stroke="#2D6A4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {[[8, 20], [92, 35], [5, 80], [88, 82], [50, 5]].map(([x, y], i) => (
            <svg key={i} className="absolute opacity-[0.07]" style={{ left: `${x}%`, top: `${y}%`, width: '16px', height: '16px' }} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="1" width="4" height="14" rx="1.5" fill="#2D6A4F" />
              <rect x="1" y="6" width="14" height="4" rx="1.5" fill="#2D6A4F" />
            </svg>
          ))}
          <svg className="absolute right-4 top-1/3 h-40 w-24 opacity-[0.05]" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[0, 1, 2, 3, 4].map((row) =>
              [0, 1, 2].map((col) => (
                <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 20 + 10} r="3" fill="#52B788" />
              ))
            )}
          </svg>
          <svg className="absolute -left-4 top-1/2 h-36 w-28 opacity-[0.05]" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 10 C10 15 5 35 8 55 C12 78 28 92 40 95 C52 92 68 78 72 55 C75 35 70 15 55 10 C50 8 30 8 25 10Z" stroke="#2D6A4F" strokeWidth="2.5" />
            <circle cx="40" cy="52" r="14" stroke="#52B788" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
        </>
      )}
    </div>
  )
}
