export type Category = "all" | "design" | "ai" | "tech"

export type PersonaType = "dev" | "design" | "product"

export interface AISummary {
  dev: string
  design: string
  product: string
}

export interface FeedSource {
  name: string
  url: string
  category: Exclude<Category, "all">
}

export const RSS_FEEDS: FeedSource[] = [
  // Design
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    category: "design",
  },
  {
    name: "A List Apart",
    url: "https://alistapart.com/main/feed/",
    category: "design",
  },
  {
    name: "Sidebar.io",
    url: "https://sidebar.io/feed.xml",
    category: "design",
  },
  // AI
  {
    name: "MIT AI News",
    url: "https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml",
    category: "ai",
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "ai",
  },
  {
    name: "Towards Data Science",
    url: "https://towardsdatascience.com/feed",
    category: "ai",
  },
  // Tech
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "tech",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "tech",
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "tech",
  },
]

export interface NewsItem {
  id: string
  title: string
  description: string
  link: string
  pubDate: string
  source: string
  category: Exclude<Category, "all">
  imageUrl?: string
  ai_summary?: AISummary
}
