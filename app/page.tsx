"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Header } from "@/components/header"
import { CategoryTabs } from "@/components/category-tabs"
import { NewsList } from "@/components/news-list"
import type { Category, NewsItem } from "@/lib/rss-feeds"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch with auto-refresh every 5 minutes
  const {
    data: news,
    error,
    isLoading,
  } = useSWR<NewsItem[]>("/api/rss", fetcher, {
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    revalidateOnFocus: false,
  })

  // Filter news by category and search query
  const filteredNews = useMemo(() => {
    if (!news || news.length === 0) return []

    return news.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [news, activeCategory, searchQuery])

  // Count items per category
  const counts = useMemo(() => {
    if (!news) return { all: 0, design: 0, ai: 0, tech: 0 }

    const filtered = searchQuery
      ? news.filter((item) => {
          return (
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })
      : news

    return {
      all: filtered.length,
      design: filtered.filter((i) => i.category === "design").length,
      ai: filtered.filter((i) => i.category === "ai").length,
      tech: filtered.filter((i) => i.category === "tech").length,
    }
  }, [news, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} counts={counts} />
      <main className="mx-auto max-w-5xl px-4 py-4">
        <NewsList items={filteredNews} isLoading={isLoading} error={error?.message} />
      </main>
    </div>
  )
}
