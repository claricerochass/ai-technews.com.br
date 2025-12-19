export type Category = "all" | "design" | "ai" | "tech"

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
    name: "CSS-Tricks",
    url: "https://css-tricks.com/feed/",
    category: "design",
  },
  // AI
  {
    name: "MIT AI News",
    url: "https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml",
    category: "ai",
  },
  {
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "ai",
  },
  {
    name: "DeepMind Blog",
    url: "https://deepmind.google/blog/rss.xml",
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
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
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
}
