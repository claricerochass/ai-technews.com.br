"use client"

import type React from "react"
import { useState } from "react"

import { ExternalLink, Sparkles, ChevronDown, Loader2 } from "lucide-react"
import type { NewsItem as NewsItemType } from "@/lib/rss-feeds"
import { cn } from "@/lib/utils"

interface NewsItemProps {
  item: NewsItemType
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index) * 10000
  return x - Math.floor(x)
}

function DesignPattern({ seed }: { seed: number }) {
  const patternType = seed % 6
  const r1 = seededRandom(seed, 1)
  const r2 = seededRandom(seed, 2)
  const r3 = seededRandom(seed, 3)
  const r4 = seededRandom(seed, 4)

  const gradientId = `designGrad-${seed}`
  const baseColor = "251 191 36"

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${baseColor} / 0.5)`} />
          <stop offset="100%" stopColor={`rgb(${baseColor} / 0.2)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`rgb(${baseColor} / 0.05)`} />

      {patternType === 0 && (
        // Circles pattern
        <>
          <circle cx={20 + r1 * 20} cy={25 + r2 * 15} r={15 + r3 * 10} fill={`url(#${gradientId})`} />
          <circle cx={65 + r2 * 20} cy={60 + r3 * 20} r={20 + r1 * 12} fill={`rgb(${baseColor} / 0.25)`} />
          <circle cx={75 + r4 * 15} cy={20 + r1 * 15} r={8 + r2 * 8} fill={`rgb(${baseColor} / 0.15)`} />
        </>
      )}

      {patternType === 1 && (
        // Triangles pattern
        <>
          <polygon
            points={`${20 + r1 * 10},${70 - r2 * 10} ${50 + r2 * 10},${20 + r3 * 10} ${80 - r3 * 10},${70 - r1 * 10}`}
            fill={`url(#${gradientId})`}
          />
          <polygon
            points={`${60 + r2 * 15},${85 - r1 * 10} ${75 + r3 * 10},${55 + r4 * 10} ${90 - r1 * 5},${85 - r2 * 10}`}
            fill={`rgb(${baseColor} / 0.2)`}
          />
          <polygon
            points={`${5 + r4 * 10},${40 - r1 * 10} ${20 + r1 * 10},${15 + r2 * 10} ${35 - r2 * 10},${40 - r3 * 10}`}
            fill={`rgb(${baseColor} / 0.15)`}
          />
        </>
      )}

      {patternType === 2 && (
        // Diagonal lines pattern
        <>
          <line
            x1={10 + r1 * 10}
            y1="0"
            x2={60 + r2 * 20}
            y2="100"
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth={4 + r1 * 4}
          />
          <line
            x1={30 + r2 * 15}
            y1="0"
            x2={80 + r3 * 15}
            y2="100"
            stroke={`rgb(${baseColor} / 0.25)`}
            strokeWidth={3 + r2 * 3}
          />
          <line
            x1={50 + r3 * 10}
            y1="0"
            x2="100"
            y2={80 + r4 * 20}
            stroke={`rgb(${baseColor} / 0.2)`}
            strokeWidth={5 + r3 * 4}
          />
          <circle cx={25 + r1 * 15} cy={50 + r2 * 20} r={10 + r3 * 8} fill={`url(#${gradientId})`} />
        </>
      )}

      {patternType === 3 && (
        // Hexagon pattern
        <>
          <polygon
            points="50,10 80,30 80,60 50,80 20,60 20,30"
            fill={`url(#${gradientId})`}
            transform={`translate(${r1 * 10 - 5}, ${r2 * 10 - 5}) scale(${0.8 + r3 * 0.4})`}
          />
          <polygon
            points="50,10 80,30 80,60 50,80 20,60 20,30"
            fill={`rgb(${baseColor} / 0.15)`}
            transform={`translate(${55 + r2 * 15}, ${55 + r3 * 15}) scale(0.35)`}
          />
          <polygon
            points="50,10 80,30 80,60 50,80 20,60 20,30"
            fill={`rgb(${baseColor} / 0.12)`}
            transform={`translate(${-5 + r4 * 10}, ${55 + r1 * 15}) scale(0.3)`}
          />
        </>
      )}

      {patternType === 4 && (
        // Concentric circles pattern
        <>
          <circle
            cx={50 + r1 * 10 - 5}
            cy={50 + r2 * 10 - 5}
            r={40 + r3 * 10}
            fill="none"
            stroke={`rgb(${baseColor} / 0.15)`}
            strokeWidth="2"
          />
          <circle
            cx={50 + r1 * 10 - 5}
            cy={50 + r2 * 10 - 5}
            r={30 + r3 * 8}
            fill="none"
            stroke={`rgb(${baseColor} / 0.2)`}
            strokeWidth="3"
          />
          <circle
            cx={50 + r1 * 10 - 5}
            cy={50 + r2 * 10 - 5}
            r={20 + r3 * 5}
            fill="none"
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="4"
          />
          <circle cx={50 + r1 * 10 - 5} cy={50 + r2 * 10 - 5} r={10 + r3 * 3} fill={`url(#${gradientId})`} />
        </>
      )}

      {patternType === 5 && (
        // Diamond/squares pattern
        <>
          <rect
            x={30 + r1 * 10}
            y={30 + r2 * 10}
            width={30 + r3 * 15}
            height={30 + r3 * 15}
            fill={`url(#${gradientId})`}
            transform={`rotate(${45 + r4 * 20}, ${50 + r1 * 5}, ${50 + r2 * 5})`}
          />
          <rect
            x={55 + r2 * 15}
            y={60 + r3 * 15}
            width={20 + r1 * 10}
            height={20 + r1 * 10}
            fill={`rgb(${baseColor} / 0.2)`}
            transform={`rotate(${30 + r1 * 30}, ${65 + r2 * 10}, ${70 + r3 * 10})`}
          />
          <rect
            x={10 + r3 * 10}
            y={10 + r4 * 10}
            width={15 + r2 * 8}
            height={15 + r2 * 8}
            fill={`rgb(${baseColor} / 0.15)`}
            transform={`rotate(${60 + r2 * 30}, ${18 + r3 * 5}, ${18 + r4 * 5})`}
          />
        </>
      )}
    </svg>
  )
}

function AIPattern({ seed }: { seed: number }) {
  const patternType = seed % 6
  const r1 = seededRandom(seed, 1)
  const r2 = seededRandom(seed, 2)
  const r3 = seededRandom(seed, 3)
  const r4 = seededRandom(seed, 4)

  const gradientId = `aiGrad-${seed}`
  const baseColor = "16 185 129"

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${baseColor} / 0.5)`} />
          <stop offset="100%" stopColor={`rgb(${baseColor} / 0.2)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`rgb(${baseColor} / 0.05)`} />

      {patternType === 0 && (
        // Neural network nodes
        <>
          {[
            { cx: 15 + r1 * 10, cy: 30 + r2 * 10 },
            { cx: 15 + r2 * 10, cy: 70 - r1 * 10 },
            { cx: 50 + r3 * 10, cy: 50 },
            { cx: 85 - r1 * 10, cy: 30 + r3 * 10 },
            { cx: 85 - r2 * 10, cy: 70 - r2 * 10 },
          ].map((node, i, arr) => (
            <g key={i}>
              {i < arr.length - 1 && (
                <line
                  x1={node.cx}
                  y1={node.cy}
                  x2={arr[i + 1].cx}
                  y2={arr[i + 1].cy}
                  stroke={`rgb(${baseColor} / 0.2)`}
                  strokeWidth="1.5"
                />
              )}
              <circle cx={node.cx} cy={node.cy} r={6 + (i % 3) * 3} fill={`url(#${gradientId})`} />
            </g>
          ))}
        </>
      )}

      {patternType === 1 && (
        // Brain waves pattern
        <>
          <path
            d={`M 10,${30 + r1 * 10} Q 30,${15 + r2 * 15} 50,${30 + r1 * 10} T 90,${30 + r2 * 10}`}
            fill="none"
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="3"
          />
          <path
            d={`M 10,${50 + r2 * 5} Q 30,${35 + r3 * 15} 50,${50 + r2 * 5} T 90,${50 + r1 * 5}`}
            fill="none"
            stroke={`rgb(${baseColor} / 0.4)`}
            strokeWidth="4"
          />
          <path
            d={`M 10,${70 + r3 * 10} Q 30,${55 + r1 * 15} 50,${70 + r3 * 10} T 90,${70 + r2 * 10}`}
            fill="none"
            stroke={`rgb(${baseColor} / 0.25)`}
            strokeWidth="2"
          />
          <circle cx={50 + r4 * 20 - 10} cy={50 + r1 * 10 - 5} r={12 + r2 * 6} fill={`url(#${gradientId})`} />
        </>
      )}

      {patternType === 2 && (
        // Data flow arrows
        <>
          <polygon
            points={`${15 + r1 * 10},50 ${35 + r1 * 10},35 ${35 + r1 * 10},42 ${55 + r2 * 10},42 ${55 + r2 * 10},35 ${75 + r2 * 10},50 ${55 + r2 * 10},65 ${55 + r2 * 10},58 ${35 + r1 * 10},58 ${35 + r1 * 10},65`}
            fill={`url(#${gradientId})`}
          />
          <circle cx={85 - r3 * 5} cy={50} r={8 + r4 * 5} fill={`rgb(${baseColor} / 0.3)`} />
          <circle cx={15 + r1 * 5} cy={25 + r2 * 10} r={6 + r3 * 4} fill={`rgb(${baseColor} / 0.2)`} />
          <circle cx={15 + r2 * 5} cy={75 - r1 * 10} r={6 + r4 * 4} fill={`rgb(${baseColor} / 0.2)`} />
        </>
      )}

      {patternType === 3 && (
        // Matrix dots
        <>
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 5 }, (_, col) => {
              const dotSeed = seededRandom(seed, row * 5 + col)
              const size = 3 + dotSeed * 8
              const opacity = 0.15 + dotSeed * 0.35
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={15 + col * 18 + (dotSeed - 0.5) * 6}
                  cy={15 + row * 18 + (dotSeed - 0.5) * 6}
                  r={size}
                  fill={`rgb(${baseColor} / ${opacity})`}
                />
              )
            }),
          )}
        </>
      )}

      {patternType === 4 && (
        // Binary/code blocks
        <>
          {Array.from({ length: 4 }, (_, i) => {
            const rowSeed = seededRandom(seed, i)
            return (
              <g key={i}>
                <rect
                  x={10 + rowSeed * 10}
                  y={15 + i * 22}
                  width={25 + rowSeed * 20}
                  height={8}
                  rx="2"
                  fill={`rgb(${baseColor} / ${0.2 + rowSeed * 0.2})`}
                />
                <rect
                  x={45 + rowSeed * 15}
                  y={15 + i * 22}
                  width={15 + rowSeed * 15}
                  height={8}
                  rx="2"
                  fill={`rgb(${baseColor} / ${0.15 + rowSeed * 0.15})`}
                />
                {rowSeed > 0.5 && (
                  <rect
                    x={75 + rowSeed * 10}
                    y={15 + i * 22}
                    width={10 + rowSeed * 8}
                    height={8}
                    rx="2"
                    fill={`rgb(${baseColor} / 0.1)`}
                  />
                )}
              </g>
            )
          })}
        </>
      )}

      {patternType === 5 && (
        // Interconnected hexagons
        <>
          <polygon
            points="35,20 50,10 65,20 65,40 50,50 35,40"
            fill={`url(#${gradientId})`}
            transform={`translate(${r1 * 10 - 5}, ${r2 * 10 - 5})`}
          />
          <polygon
            points="35,20 50,10 65,20 65,40 50,50 35,40"
            fill={`rgb(${baseColor} / 0.2)`}
            transform={`translate(${20 + r2 * 10}, ${35 + r3 * 10}) scale(0.7)`}
          />
          <polygon
            points="35,20 50,10 65,20 65,40 50,50 35,40"
            fill={`rgb(${baseColor} / 0.15)`}
            transform={`translate(${-10 + r3 * 10}, ${30 + r4 * 15}) scale(0.5)`}
          />
          <line
            x1={50 + r1 * 10}
            y1={50 + r2 * 10}
            x2={55 + r2 * 15}
            y2={65 + r3 * 10}
            stroke={`rgb(${baseColor} / 0.25)`}
            strokeWidth="2"
          />
        </>
      )}
    </svg>
  )
}

function TechPattern({ seed }: { seed: number }) {
  const patternType = seed % 6
  const r1 = seededRandom(seed, 1)
  const r2 = seededRandom(seed, 2)
  const r3 = seededRandom(seed, 3)
  const r4 = seededRandom(seed, 4)

  const gradientId = `techGrad-${seed}`
  const baseColor = "59 130 246"

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${baseColor} / 0.5)`} />
          <stop offset="100%" stopColor={`rgb(${baseColor} / 0.2)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`rgb(${baseColor} / 0.05)`} />

      {patternType === 0 && (
        // Circuit board
        <>
          <rect
            x={35 + r1 * 15}
            y={35 + r2 * 15}
            width={20 + r3 * 10}
            height={20 + r3 * 10}
            rx="2"
            fill={`url(#${gradientId})`}
          />
          <line
            x1={45 + r1 * 10}
            y1={10}
            x2={45 + r1 * 10}
            y2={35 + r2 * 15}
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="2"
          />
          <line
            x1={45 + r1 * 10}
            y1={55 + r2 * 15 + r3 * 10}
            x2={45 + r1 * 10}
            y2={90}
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="2"
          />
          <line
            x1={10}
            y1={45 + r2 * 10}
            x2={35 + r1 * 15}
            y2={45 + r2 * 10}
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="2"
          />
          <line
            x1={55 + r1 * 15 + r3 * 10}
            y1={45 + r2 * 10}
            x2={90}
            y2={45 + r2 * 10}
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="2"
          />
          <circle cx={45 + r1 * 10} cy={10} r={4} fill={`url(#${gradientId})`} />
          <circle cx={45 + r1 * 10} cy={90} r={4} fill={`url(#${gradientId})`} />
          <circle cx={10} cy={45 + r2 * 10} r={4} fill={`url(#${gradientId})`} />
          <circle cx={90} cy={45 + r2 * 10} r={4} fill={`url(#${gradientId})`} />
        </>
      )}

      {patternType === 1 && (
        // Gear/cog pattern
        <>
          <circle
            cx={50 + r1 * 10 - 5}
            cy={50 + r2 * 10 - 5}
            r={25 + r3 * 10}
            fill="none"
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="8"
            strokeDasharray="12 8"
          />
          <circle cx={50 + r1 * 10 - 5} cy={50 + r2 * 10 - 5} r={12 + r3 * 5} fill={`url(#${gradientId})`} />
          <circle
            cx={20 + r2 * 10}
            cy={20 + r3 * 10}
            r={10 + r4 * 5}
            fill="none"
            stroke={`rgb(${baseColor} / 0.2)`}
            strokeWidth="4"
            strokeDasharray="6 4"
          />
          <circle cx={20 + r2 * 10} cy={20 + r3 * 10} r={4} fill={`rgb(${baseColor} / 0.3)`} />
        </>
      )}

      {patternType === 2 && (
        // Server rack pattern
        <>
          {Array.from({ length: 4 }, (_, i) => {
            const rowSeed = seededRandom(seed, i)
            return (
              <g key={i}>
                <rect
                  x={15}
                  y={12 + i * 22}
                  width={70}
                  height={16}
                  rx="2"
                  fill={`rgb(${baseColor} / ${0.15 + rowSeed * 0.15})`}
                />
                <circle
                  cx={25 + rowSeed * 5}
                  cy={20 + i * 22}
                  r={3}
                  fill={rowSeed > 0.5 ? `rgb(${baseColor} / 0.6)` : `rgb(${baseColor} / 0.2)`}
                />
                <circle
                  cx={38 + rowSeed * 5}
                  cy={20 + i * 22}
                  r={3}
                  fill={rowSeed > 0.3 ? `rgb(${baseColor} / 0.5)` : `rgb(${baseColor} / 0.2)`}
                />
                <rect
                  x={55}
                  y={17 + i * 22}
                  width={25 + rowSeed * 5}
                  height={6}
                  rx="1"
                  fill={`rgb(${baseColor} / 0.3)`}
                />
              </g>
            )
          })}
        </>
      )}

      {patternType === 3 && (
        // Wifi/signal waves
        <>
          <path
            d={`M ${50 + r1 * 10 - 5},${85 - r2 * 10} Q ${20 + r3 * 10},${50 + r1 * 10} ${50 + r1 * 10 - 5},${15 + r2 * 10}`}
            fill="none"
            stroke={`rgb(${baseColor} / 0.2)`}
            strokeWidth="3"
          />
          <path
            d={`M ${50 + r1 * 10 - 5},${75 - r2 * 8} Q ${30 + r3 * 8},${50 + r1 * 8} ${50 + r1 * 10 - 5},${25 + r2 * 8}`}
            fill="none"
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="4"
          />
          <path
            d={`M ${50 + r1 * 10 - 5},${65 - r2 * 6} Q ${40 + r3 * 6},${50 + r1 * 6} ${50 + r1 * 10 - 5},${35 + r2 * 6}`}
            fill="none"
            stroke={`rgb(${baseColor} / 0.4)`}
            strokeWidth="5"
          />
          <circle cx={50 + r1 * 10 - 5} cy={50 + r2 * 5 - 2} r={8 + r3 * 5} fill={`url(#${gradientId})`} />
        </>
      )}

      {patternType === 4 && (
        // Brackets/code pattern
        <>
          <text
            x={15 + r1 * 10}
            y={40 + r2 * 10}
            fontSize={40 + r3 * 15}
            fill={`rgb(${baseColor} / 0.25)`}
            fontFamily="monospace"
          >
            {"{"}
          </text>
          <text
            x={55 + r2 * 15}
            y={70 + r1 * 10}
            fontSize={35 + r4 * 15}
            fill={`rgb(${baseColor} / 0.2)`}
            fontFamily="monospace"
          >
            {"}"}
          </text>
          <rect x={35 + r3 * 10} y={35 + r4 * 10} width={20 + r1 * 10} height={6} rx="1" fill={`url(#${gradientId})`} />
          <rect
            x={40 + r4 * 8}
            y={48 + r1 * 8}
            width={25 + r2 * 12}
            height={6}
            rx="1"
            fill={`rgb(${baseColor} / 0.3)`}
          />
        </>
      )}

      {patternType === 5 && (
        // Database cylinders
        <>
          <ellipse
            cx={50 + r1 * 10 - 5}
            cy={25 + r2 * 5}
            rx={25 + r3 * 10}
            ry={10 + r4 * 5}
            fill={`url(#${gradientId})`}
          />
          <rect
            x={25 + r1 * 10 - 5 - r3 * 10}
            y={25 + r2 * 5}
            width={50 + r3 * 20}
            height={40 + r4 * 10}
            fill={`rgb(${baseColor} / 0.25)`}
          />
          <ellipse
            cx={50 + r1 * 10 - 5}
            cy={65 + r2 * 5 + r4 * 10}
            rx={25 + r3 * 10}
            ry={10 + r4 * 5}
            fill={`rgb(${baseColor} / 0.35)`}
          />
          <line
            x1={25 + r1 * 10 - 5 - r3 * 10}
            y1={25 + r2 * 5}
            x2={25 + r1 * 10 - 5 - r3 * 10}
            y2={65 + r2 * 5 + r4 * 10}
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="1"
          />
          <line
            x1={75 + r1 * 10 - 5 + r3 * 10}
            y1={25 + r2 * 5}
            x2={75 + r1 * 10 - 5 + r3 * 10}
            y2={65 + r2 * 5 + r4 * 10}
            stroke={`rgb(${baseColor} / 0.3)`}
            strokeWidth="1"
          />
        </>
      )}
    </svg>
  )
}

const categoryPatterns: Record<string, React.FC<{ seed: number }>> = {
  design: DesignPattern,
  ai: AIPattern,
  tech: TechPattern,
}

const categoryColors: Record<string, string> = {
  design: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ai: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  tech: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
}

export function NewsItem({ item }: NewsItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedChip, setSelectedChip] = useState<string | null>(null)
  const [insights, setInsights] = useState<Record<string, string>>({})
  const [loadingChip, setLoadingChip] = useState<string | null>(null)

  const hasImage = Boolean(item.imageUrl)
  const PatternComponent = categoryPatterns[item.category] || TechPattern
  const seed = hashString(item.title)

  async function fetchInsight(perspective: string) {
    if (insights[perspective]) {
      return
    }

    setLoadingChip(perspective)

    try {
      const response = await fetch("/api/generate-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          category: item.category,
          perspective,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao gerar insight")
      }

      const data = await response.json()
      setInsights((prev) => ({ ...prev, [perspective]: data.insight }))
    } catch (error) {
      console.error("[v0] Error fetching insight:", error)
      setInsights((prev) => ({
        ...prev,
        [perspective]: "Não foi possível gerar o insight. Tente novamente.",
      }))
    } finally {
      setLoadingChip(null)
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (minutes < 1) return "agora"
    if (hours < 1) return `${minutes} min atrás`
    if (hours < 24) return `${hours}h atrás`
    if (days < 7) return `${days}d atrás`

    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    })
  }

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setSelectedChip(null)
    }
  }

  const handleChipClick = async (e: React.MouseEvent, chip: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (selectedChip === chip) {
      setSelectedChip(null)
    } else {
      setSelectedChip(chip)
      await fetchInsight(chip)
    }
  }

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-4 rounded-lg p-4 transition-colors hover:bg-secondary/50"
      >
        <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
          {hasImage ? (
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full transition-transform group-hover:scale-105">
              <PatternComponent seed={seed} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-foreground/80">
              {item.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.description}</p>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("rounded px-1.5 py-0.5 font-medium", categoryColors[item.category])}>
              {item.category.toUpperCase()}
            </span>
            <span className="text-border">•</span>
            <span>{item.source}</span>
            <span className="text-border">•</span>
            <span>{formatDate(item.pubDate)}</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </a>

      <div className="px-4 pb-4">
        <button
          onClick={handleToggleExpand}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ver insights</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            {/* Chips de seleção */}
            <div className="flex gap-2">
              <button
                onClick={(e) => handleChipClick(e, "design")}
                disabled={loadingChip !== null}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  selectedChip === "design"
                    ? "bg-purple-500 text-white ring-2 ring-purple-300"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200",
                  loadingChip !== null && "opacity-50 cursor-not-allowed",
                )}
              >
                {loadingChip === "design" ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Gerando...
                  </span>
                ) : (
                  "Design"
                )}
              </button>
              <button
                onClick={(e) => handleChipClick(e, "dev")}
                disabled={loadingChip !== null}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  selectedChip === "dev"
                    ? "bg-green-500 text-white ring-2 ring-green-300"
                    : "bg-green-100 text-green-700 hover:bg-green-200",
                  loadingChip !== null && "opacity-50 cursor-not-allowed",
                )}
              >
                {loadingChip === "dev" ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Gerando...
                  </span>
                ) : (
                  "Dev"
                )}
              </button>
              <button
                onClick={(e) => handleChipClick(e, "business")}
                disabled={loadingChip !== null}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  selectedChip === "business"
                    ? "bg-amber-500 text-white ring-2 ring-amber-300"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200",
                  loadingChip !== null && "opacity-50 cursor-not-allowed",
                )}
              >
                {loadingChip === "business" ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Gerando...
                  </span>
                ) : (
                  "Negócio"
                )}
              </button>
            </div>

            {/* Texto do insight */}
            {selectedChip ? (
              loadingChip === selectedChip ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Gerando insight inteligente...</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">{insights[selectedChip]}</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground/70 italic">
                Selecione um ponto de vista, para ver seu insight inteligente
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
