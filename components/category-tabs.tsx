"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import type { Category } from "@/lib/rss-feeds"
import { GridIcon } from "@/components/icons/grid-icon"
import { PaletteIcon } from "@/components/icons/palette-icon"
import { BrainIcon } from "@/components/icons/brain-icon"
import { CpuIcon } from "@/components/icons/cpu-icon"

interface CategoryTabsProps {
  activeCategory: Category
  onCategoryChange: (category: Category) => void
  counts: Record<Category, number>
}

const categories: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "Todas", icon: GridIcon },
  { id: "design", label: "Design", icon: PaletteIcon },
  { id: "ai", label: "AI", icon: BrainIcon },
  { id: "tech", label: "Tech", icon: CpuIcon },
]

export function CategoryTabs({ activeCategory, onCategoryChange, counts }: CategoryTabsProps) {
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-5xl px-4">
        <nav className="flex gap-1 -mb-px" aria-label="Categorias">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onCategoryChange(id)}
              className={cn(
                "group flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2",
                activeCategory === id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              <Icon className="flex-shrink-0" />
              <span>{label}</span>
              <span
                className={cn(
                  "ml-1 rounded-full px-2 py-0.5 text-xs tabular-nums",
                  activeCategory === id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground",
                )}
              >
                {counts[id]}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
