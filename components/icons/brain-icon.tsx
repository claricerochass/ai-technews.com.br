"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"

const pathVariants: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: {
    pathLength: [0, 1],
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
}

const pulseVariants: Variants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
}

interface BrainIconProps {
  className?: string
}

export function BrainIcon({ className }: BrainIconProps) {
  const controls = useAnimation()

  return (
    <div
      className={className}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pulseVariants}
        animate={controls}
      >
        <motion.path
          d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
          variants={pathVariants}
          animate={controls}
        />
        <motion.path
          d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"
          variants={pathVariants}
          animate={controls}
        />
        <path d="M12 5v14" />
        <path d="M9 8.5h6" />
        <path d="M9 12h6" />
        <path d="M9 15.5h6" />
      </motion.svg>
    </div>
  )
}
