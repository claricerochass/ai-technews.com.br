"use client"

import type { NewsItem as NewsItemType } from "@/lib/rss-feeds"
import { NewsItem } from "@/components/news-item"
import { LoadingSkeleton } from "@/components/loading-skeleton"

interface NewsListProps {
  items: NewsItemType[]
  isLoading: boolean
  error?: string
}

export function NewsList({ items, isLoading, error }: NewsListProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">Erro ao carregar notícias</p>
        <p className="mt-1 text-xs text-muted-foreground/60">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">Nenhuma notícia encontrada</p>
        <p className="mt-1 text-xs text-muted-foreground/60">Tente ajustar os filtros ou a busca</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <NewsItem key={item.id} item={item} />
      ))}
    </div>
  )
}
