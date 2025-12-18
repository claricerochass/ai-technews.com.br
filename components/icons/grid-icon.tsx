"use client"

import type { Variants } from "motion/react"
import { motion, useAnimation } from "motion/react"

const pathVariants: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
}

interface GridIconProps {
  className?: string
}

export function GridIcon({ className }: GridIconProps) {
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
        <motion.rect x="3" y="3" width="7" height="7" variants={pathVariants} animate={controls} custom={0} />
        <motion.rect x="14" y="3" width="7" height="7" variants={pathVariants} animate={controls} custom={1} />
        <motion.rect x="3" y="14" width="7" height="7" variants={pathVariants} animate={controls} custom={2} />
        <motion.rect x="14" y="14" width="7" height="7" variants={pathVariants} animate={controls} custom={3} />
      </svg>
    </div>
  )
}
