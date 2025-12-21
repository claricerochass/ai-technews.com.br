import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ai-technews - Agregador de Notícias sobre IA, Design e Tech",
  description:
    "Seu agregador de notícias sobre Inteligência Artificial, Design e Tecnologia. Insights inteligentes gerados por IA para cada notícia.",
  keywords: ["notícias", "tecnologia", "inteligência artificial", "design", "tech news", "AI news"],
  authors: [{ name: "ai-technews" }],
  openGraph: {
    title: "ai-technews - Agregador de Notícias",
    description: "Seu agregador de notícias sobre IA, Design e Tecnologia com insights inteligentes.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ai-technews - Agregador de Notícias",
    description: "Seu agregador de notícias sobre IA, Design e Tecnologia com insights inteligentes.",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
