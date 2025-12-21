# Configuração do Rate Limiting

Este documento explica como configurar o rate limiting usando Upstash Redis.

## Pré-requisitos

- Conta no Upstash (https://upstash.com)
- Projeto Vercel configurado

## Passo 1: Criar Database no Upstash

1. Acesse https://console.upstash.com
2. Clique em "Create Database"
3. Escolha:
   - **Name**: news-aggregator-ratelimit
   - **Type**: Regional (ou Global para melhor performance)
   - **Region**: Escolha o mais próximo dos seus usuários
4. Clique em "Create"

## Passo 2: Obter Credenciais

Na dashboard do database criado, copie:
- **UPSTASH_REDIS_REST_URL**: URL de acesso REST
- **UPSTASH_REDIS_REST_TOKEN**: Token de autenticação

## Passo 3: Configurar Variáveis de Ambiente

### Local Development (.env.local)

Crie o arquivo `.env.local` na raiz do projeto:

```env
UPSTASH_REDIS_REST_URL=https://xxx-xxx-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxxxxxxxxxxxxxxxxxxx
```

### Vercel Production

1. Acesse o dashboard do projeto no Vercel
2. Vá em **Settings → Environment Variables**
3. Adicione as duas variáveis:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Selecione os ambientes: **Production**, **Preview**, **Development**
5. Clique em "Save"

## Passo 4: Verificar Instalação

As dependências já estão instaladas no projeto:

```json
"@upstash/redis": "1.35.8",
"@upstash/ratelimit": "2.0.7"
```

Se necessário, reinstale:

```bash
pnpm install
```

## Limites Configurados

### API `/api/generate-insight` (Crítico)
- **5 requisições por minuto** por IP
- **Algoritmo**: Sliding Window
- **Comportamento**: Retorna fallback inteligente em vez de bloquear

### API `/api/rss` (Moderado)
- **10 requisições por minuto** por IP
- **Algoritmo**: Sliding Window
- **Comportamento**: Retorna 429 Too Many Requests

## Estrutura de Arquivos

```
lib/
├── redis.ts                    # Configuração Redis + Rate limiters
└── rate-limit-middleware.ts    # Middleware genérico

app/api/
├── generate-insight/route.ts   # Rate limit aplicado
└── rss/route.ts               # Rate limit aplicado
```

## Headers de Rate Limit

Todas as respostas incluem headers informativos:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1703089234567
```

Quando limite excedido:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 42
```

## Monitoramento

### Upstash Dashboard

Acesse https://console.upstash.com para visualizar:
- Requests por segundo
- Hit rate do Redis
- Top IPs bloqueados
- Latência P95

### Analytics (Habilitado)

Os rate limiters estão configurados com `analytics: true`:

```typescript
export const insightRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true, // ← Coleta métricas
  prefix: "rl:insight",
})
```

## Ajustando Limites

Para modificar os limites, edite `/lib/redis.ts`:

```typescript
// Exemplo: Aumentar para 10 requisições por minuto
export const insightRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "rl:insight",
})
```

Opções de período:
- `"10 s"` - 10 segundos
- `"1 m"` - 1 minuto
- `"1 h"` - 1 hora
- `"1 d"` - 1 dia

## Troubleshooting

### Erro: "Cannot connect to Redis"

**Causa**: Variáveis de ambiente não configuradas

**Solução**:
1. Verifique se `.env.local` existe
2. Confirme que as variáveis estão corretas
3. Reinicie o servidor de desenvolvimento

### Erro: "Rate limit not working"

**Causa**: Variáveis não carregadas no Vercel

**Solução**:
1. Verifique **Settings → Environment Variables** no Vercel
2. Certifique-se que os ambientes estão selecionados
3. Faça redeploy do projeto

### Comportamento Local vs Produção

**Local**: IP geralmente é `::1` ou `127.0.0.1`
**Produção**: IP real do usuário via `x-forwarded-for`

Para testar localmente com IPs diferentes, use ferramentas como:
```bash
curl -H "x-forwarded-for: 192.168.1.100" http://localhost:3000/api/rss
```

## Custos

### Upstash Free Tier
- **10.000 comandos/dia**: Grátis
- **Além disso**: $0.20 por 100k comandos

### Estimativa de Uso
```
Cenário: 1000 usuários/dia
- 5 insights/usuário = 5.000 requisições
- 10 carregamentos RSS/usuário = 10.000 requisições
Total: 15k comandos/dia

Status: Dentro do Free Tier ✓
```

## Segurança

### Fail-Open Strategy

Se o Redis falhar, o middleware permite a requisição:

```typescript
} catch (error) {
  console.error("Rate limit error:", error)
  return handler() // ← Permite acesso
}
```

Isso garante disponibilidade mesmo em caso de problemas no Redis.

### Identificação de Usuários

Atualmente usa IP (`x-forwarded-for`). Para maior controle:

1. **Adicionar autenticação**: Use session ID ou user ID
2. **Combinar IP + User-Agent**: Hash de ambos como identificador
3. **Whitelist**: Excluir IPs confiáveis do rate limiting

## Próximos Passos

1. Monitorar métricas por 7 dias
2. Ajustar limites baseado em uso real
3. Considerar rate limiting por hora/dia para proteção adicional
4. Implementar whitelist para IPs administrativos (se necessário)

## Suporte

- **Upstash Docs**: https://docs.upstash.com/redis
- **Rate Limit SDK**: https://github.com/upstash/ratelimit
- **Issues**: Criar issue no repositório do projeto
