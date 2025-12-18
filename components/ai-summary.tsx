"use client"

import type React from "react"

import { useState } from "react"
import { Sparkles, ChevronDown, ChevronUp, Code, Palette, BarChart3 } from "lucide-react"
import type { AISummary, PersonaType } from "@/lib/rss-feeds"
import { cn } from "@/lib/utils"

interface AISummaryProps {
  summary: AISummary
  category: string
}

const personas: { id: PersonaType; label: string; icon: React.ReactNode }[] = [
  { id: "dev", label: "Dev", icon: <Code className="h-3 w-3" /> },
  { id: "design", label: "Design", icon: <Palette className="h-3 w-3" /> },
  { id: "product", label: "Product", icon: <BarChart3 className="h-3 w-3" /> },
]

const personaColors: Record<PersonaType, string> = {
  dev: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  design: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  product: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
}

export function AISummaryCard({ summary, category }: AISummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(() => {
    if (category === "design") return "design"
    if (category === "ai") return "dev"
    return "product"
  })

  const currentPersona = personas.find((p) => p.id === selectedPersona)!

  return (
    <div className="mt-3 rounded-lg border border-border/50 bg-muted/30 p-3">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex w-full items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs font-medium text-muted-foreground">Resumo IA</span>
          {/* Chip da persona selecionada */}
          <span
            className={cn(
              "flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
              personaColors[selectedPersona],
            )}
          >
            {currentPersona.icon}
            {currentPersona.label}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-3">
          <p className="text-sm leading-relaxed text-foreground/80">{summary[selectedPersona]}</p>
        </div>
      )}
    </div>
  )
}
