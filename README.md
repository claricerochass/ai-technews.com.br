# AI Tech News - Aggregador Inteligente de Notícias

<div align="center">

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/claricersilveira-8910s-projects/v0-news-aggregator-site)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/bHa6nQGSc9E)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

**[🌐 Visite o Site](https://www.ai-technews.com.br/)**

</div>

---

## 📖 Sobre o Projeto

O **AI Tech News** é um agregador inteligente de notícias que reúne conteúdo de 12 fontes RSS confiáveis nas áreas de Design, Inteligência Artificial e Tecnologia. Com insights gerados por IA, o projeto oferece análises contextualizadas sob três perspectivas: Design, Desenvolvimento e Negócios.

### ✨ Funcionalidades Principais

- **Agregação Multi-Fonte**: Coleta automática de notícias de 12 feeds RSS renomados
- **Insights Inteligentes com IA**: Análises geradas por OpenAI GPT-4o-mini com fallback dinâmico
- **Filtragem por Categoria**: Design, AI e Tech organizados em abas intuitivas
- **Busca em Tempo Real**: Pesquisa instantânea por títulos e descrições
- **Três Perspectivas de Análise**: 
  - 🎨 Design (UX/UI, interfaces)
  - 💻 Dev (código, arquitetura)
  - 💼 Negócio (estratégia, ROI)
- **Rate Limiting Inteligente**: Proteção contra abuso com Upstash Redis
- **Design Responsivo**: Interface adaptativa com tema claro/escuro
- **Cache Otimizado**: SWR para performance e experiência fluida

---

## 🚀 Demo ao Vivo

Acesse o projeto em produção: **[https://www.ai-technews.com.br/](https://www.ai-technews.com.br/)**

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

#### Frontend
- **Framework**: Next.js 16 com App Router
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS v4 + Radix UI (shadcn/ui)
- **Ícones**: Lucide React
- **Temas**: next-themes (dark mode)
- **Data Fetching**: SWR (client-side caching)

#### Backend & APIs
- **Runtime**: Vercel Edge Functions
- **RSS Parsing**: rss-parser
- **IA**: Vercel AI SDK + OpenAI GPT-4o-mini
- **Rate Limiting**: Upstash Redis + @upstash/ratelimit
- **Validação**: Zod

#### DevOps
- **Hosting**: Vercel (CI/CD automático)
- **Analytics**: Vercel Analytics
- **Monitoramento**: Upstash Dashboard

### Endpoints da API

| Endpoint | Método | Descrição | Rate Limit |
|----------|--------|-----------|------------|
| `/api/rss` | GET | Agrega 12 feeds RSS por categoria | 10 req/min |
| `/api/generate-insight` | POST | Gera insights com IA (450-500 chars) | 5 req/min |

---

## 📦 Estrutura do Projeto

```
/
├── app/
│   ├── api/
│   │   ├── rss/route.ts              # Agregação RSS com rate limiting
│   │   └── generate-insight/route.ts # Geração de insights IA
│   ├── layout.tsx                    # Layout raiz + metadata SEO
│   ├── page.tsx                      # HomePage (SWR + filtros)
│   └── globals.css                   # Tailwind CSS v4 + temas
│
├── components/
│   ├── news-item.tsx                 # Card individual de notícia
│   ├── news-list.tsx                 # Grid responsivo com skeleton
│   ├── category-tabs.tsx             # Filtro por categoria
│   ├── header.tsx                    # Search + theme toggle
│   ├── loading-skeleton.tsx          # Loading states
│   ├── icons/                        # Ícones customizados
│   └── ui/                           # shadcn/ui components
│
├── lib/
│   ├── redis.ts                      # Cliente Redis + rate limiters
│   ├── rate-limit-middleware.ts      # Middleware de rate limiting
│   ├── rss-feeds.ts                  # URLs e definições de feeds
│   └── utils.ts                      # Helpers (cn, etc)
│
├── hooks/
│   ├── use-mobile.ts                 # Detector de viewport mobile
│   └── use-toast.ts                  # Sistema de notificações
│
├── public/                           # Assets estáticos
│
├── RATE_LIMITING_SETUP.md           # Guia de configuração Redis
└── README.md                         # Este arquivo
```

---

## 🔧 Configuração Local

### Pré-requisitos

- Node.js 18+ ou 20+
- pnpm (recomendado) ou npm
- Conta Upstash (free tier disponível)
- API Key OpenAI (opcional, usa Vercel AI Gateway)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/news-aggregator-site.git
cd news-aggregator-site
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Upstash Redis (obrigatório para rate limiting)
KV_REST_API_URL=https://your-redis.upstash.io
KV_REST_API_TOKEN=your_token_here

# OpenAI (gerenciado pelo Vercel AI Gateway)
OPENAI_API_KEY=sk-your-key-here
```

4. **Execute o servidor de desenvolvimento**
```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build de Produção

```bash
pnpm build
pnpm start
```

---

## 🛡️ Segurança e Rate Limiting

### Sistema de Proteção

O projeto implementa **Sliding Window Rate Limiting** com Upstash Redis para prevenir abuso das APIs:

#### Limites por IP

| API | Por Minuto | Por Hora | Por Dia |
|-----|------------|----------|---------|
| Geração de Insights | 5 | 20 | 100 |
| Agregação RSS | 10 | 100 | - |

#### Comportamento

- **Quando excedido**: Retorna fallback inteligente em vez de erro 429
- **Headers informativos**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Fail-open**: Se Redis falhar, permite requisições (não bloqueia usuários)

### Configuração do Rate Limiting

Veja [RATE_LIMITING_SETUP.md](./RATE_LIMITING_SETUP.md) para instruções detalhadas.

**Resumo rápido:**
1. Crie conta gratuita no [Upstash](https://upstash.com)
2. Crie um Redis database
3. Copie as credenciais para `.env.local`
4. Deploy automático protegerá as APIs

---

## 📰 Fontes RSS Utilizadas

### Design (3 feeds)
- **Smashing Magazine** - Design patterns, UX/UI
- **A List Apart** - Web standards, design thinking
- **CSS-Tricks** - CSS, frontend development

### AI (3 feeds)
- **MIT AI News** - Pesquisas acadêmicas em IA
- **Hugging Face Blog** - NLP, modelos open-source
- **DeepMind Blog** - Avanços em deep learning

### Tech (3 feeds)
- **TechCrunch** - Startups, venture capital
- **The Verge** - Consumer tech, gadgets
- **Wired** - Tecnologia e cultura digital

---

## 🤖 Sistema de Insights com IA

### Fluxo de Geração

```
1. Usuário clica "Ver Insights"
2. POST /api/generate-insight { title, description, category, perspective }
3. Tenta: OpenAI GPT-4o-mini via Vercel AI Gateway
   ├─ Sucesso: Retorna insight 450-500 caracteres
   └─ Falha: DynamicFallback extrai palavras-chave + template
4. Renderiza com animação smooth
```

### Fallback Inteligente

Quando a IA está indisponível, o sistema:
- Extrai palavras-chave do título (remove 80+ stop words)
- Identifica tema principal (primeiras 3-5 palavras significativas)
- Aplica template específico por perspectiva
- Incorpora contexto da descrição
- **Resultado**: Insight único e relevante, mesmo sem IA

---

## 🌐 Deploy e CI/CD

### Deploy Automático com Vercel

Este projeto está configurado para deploy automático:

1. Push para `main` → Deploy em produção
2. Pull requests → Preview deployments automáticos
3. Variáveis de ambiente gerenciadas no Vercel Dashboard

### Sincronização v0.app

Este repositório sincroniza automaticamente com [v0.app](https://v0.app/chat/bHa6nQGSc9E):
- Mudanças no chat v0 → Push automático para GitHub
- Deploy Vercel detecta mudanças → Build automático

---

## 🎨 Personalização

### Adicionar Novos Feeds RSS

Edite `lib/rss-feeds.ts`:

```typescript
export const RSS_FEEDS = [
  {
    url: 'https://seu-feed.com/rss',
    category: 'tech' as const,
  },
  // ... mais feeds
]
```

### Ajustar Limites de Rate Limiting

Edite `lib/redis.ts`:

```typescript
export const insightRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 req/min
  analytics: true,
})
```

### Customizar Temas

Edite `app/globals.css`:

```css
@theme inline {
  --color-primary: 270 100% 65%;
  --color-background: 0 0% 100%;
  /* ... mais cores */
}
```

---

## 📊 Performance

### Métricas Esperadas

- **TTFB**: < 500ms (Vercel Edge)
- **API RSS Response**: ~2-3s (fetch paralelo de 12 feeds)
- **Insight Generation**: ~1-2s (IA + fallback)
- **Bundle Size**: ~180KB gzipped
- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)

### Otimizações Implementadas

- Client-side caching com SWR (refresh a cada 5 min)
- Parallel fetching de feeds RSS (Promise.all)
- Image loading otimizado com Next.js Image
- Code splitting automático (React.lazy)
- Edge Functions para latência global mínima

---

## 🐛 Troubleshooting

### Erro: "Rate limit error: Unable to parse response"

**Causa**: Variáveis de ambiente do Upstash não configuradas

**Solução**:
1. Verifique `.env.local` tem `KV_REST_API_URL` e `KV_REST_API_TOKEN`
2. Valide credenciais no dashboard Upstash
3. Reinicie o servidor: `pnpm dev`

### Insights sempre genéricos

**Causa**: OpenAI API não disponível ou chave inválida

**Solução**:
1. Verifique `OPENAI_API_KEY` no `.env.local`
2. Teste conectividade: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`
3. Fallback funciona normalmente mesmo sem IA

### Feed RSS não aparece

**Causa**: Feed offline ou formato incompatível

**Solução**:
1. Teste URL manualmente no navegador
2. Verifique formato (RSS 2.0 ou Atom suportados)
3. Logs no console mostram erros específicos

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para mudanças grandes:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para mais detalhes.

---

## 🔗 Links Úteis

- **Site em Produção**: [https://www.ai-technews.com.br/](https://www.ai-technews.com.br/)
- **Chat v0.app**: [https://v0.app/chat/bHa6nQGSc9E](https://v0.app/chat/bHa6nQGSc9E)
- **Dashboard Vercel**: [https://vercel.com/claricersilveira-8910s-projects/v0-news-aggregator-site](https://vercel.com/claricersilveira-8910s-projects/v0-news-aggregator-site)

---

<div align="center">

**Desenvolvido com ❤️ usando [v0.app](https://v0.app) | Hospedado na [Vercel](https://vercel.com)**

</div>
