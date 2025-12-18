"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"

const rectVariants: Variants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 0.9, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
}

const lineVariants: Variants = {
  normal: { pathLength: 1 },
  animate: (i: number) => ({
    pathLength: [0, 1],
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
}

interface CpuIconProps {
  className?: string
}

export function CpuIcon({ className }: CpuIconProps) {
  const controls = useAnimation()

  return (
    <div
      className={className}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.rect x="4" y="4" width="16" height="16" rx="2" variants={rectVariants} animate={controls} />
        <rect x="9" y="9" width="6" height="6" />
        <motion.path d="M15 2v2" variants={lineVariants} animate={controls} custom={0} />
        <motion.path d="M15 20v2" variants={lineVariants} animate={controls} custom={1} />
        <motion.path d="M2 15h2" variants={lineVariants} animate={controls} custom={2} />
        <motion.path d="M2 9h2" variants={lineVariants} animate={controls} custom={3} />
        <motion.path d="M20 15h2" variants={lineVariants} animate={controls} custom={4} />
        <motion.path d="M20 9h2" variants={lineVariants} animate={controls} custom={5} />
        <motion.path d="M9 2v2" variants={lineVariants} animate={controls} custom={6} />
        <motion.path d="M9 20v2" variants={lineVariants} animate={controls} custom={7} />
      </svg>
    </div>
  )
}
