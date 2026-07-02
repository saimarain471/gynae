import { motion } from "framer-motion"

const STAGGER = 0.035

export function TextRoll({ children, className = "", center = false }) {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={`relative block overflow-hidden ${className}`}
      style={{ lineHeight: 0.9 }}
    >
      {/* Top layer — letters that slide UP on hover */}
      <div aria-hidden="false">
        {children.split("").map((letter, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i
          return (
            <motion.span
              key={`top-${i}`}
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{ ease: "easeInOut", delay }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          )
        })}
      </div>

      {/* Bottom layer — duplicate letters that slide IN from below */}
      <div className="absolute inset-0" aria-hidden="true">
        {children.split("").map((letter, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i
          return (
            <motion.span
              key={`bottom-${i}`}
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              transition={{ ease: "easeInOut", delay }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          )
        })}
      </div>
    </motion.span>
  )
}
