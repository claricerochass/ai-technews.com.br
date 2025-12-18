"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"

const pathVariants: Variants = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

const dotVariants: Variants = {
  normal: { scale: 1 },
  animate: (i: number) => ({
    scale: [1, 1.3, 1],
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
}

interface PaletteIconProps {
  className?: string
}

export function PaletteIcon({ className }: PaletteIconProps) {
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
        variants={pathVariants}
        animate={controls}
      >
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <motion.circle
          cx="13.5"
          cy="6.5"
          r=".5"
          fill="currentColor"
          variants={dotVariants}
          animate={controls}
          custom={0}
        />
        <motion.circle
          cx="17.5"
          cy="10.5"
          r=".5"
          fill="currentColor"
          variants={dotVariants}
          animate={controls}
          custom={1}
        />
        <motion.circle
          cx="8.5"
          cy="7.5"
          r=".5"
          fill="currentColor"
          variants={dotVariants}
          animate={controls}
          custom={2}
        />
        <motion.circle
          cx="6.5"
          cy="12.5"
          r=".5"
          fill="currentColor"
          variants={dotVariants}
          animate={controls}
          custom={3}
        />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
      </motion.svg>
    </div>
  )
}
