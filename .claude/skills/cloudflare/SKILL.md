---
name: cloudflare
description: Access and modify Cloudflare for jackgolden.net and superbgaming.us — DNS records via the API, site deploys via Wrangler to the jackgolden-net Pages project. Use for DNS changes, record audits, deploying the site, or anything touching the Cloudflare account.
---

# Cloudflare — jackgolden.net

## Auth

```bash
source ~/.secrets/cloudflare.env          # exports CLOUDFLARE_API_TOKEN
export CLOUDFLARE_ACCOUNT_ID=556fcf9a79288a07f7ad03765a373534
```

Both wrangler and the raw API read these. No `wrangler login` needed.

## The site: Cloudflare Pages, no origin

jackgolden.net is served by the Pages project `jackgolden-net` (production
branch `main`, also live at jackgolden-net.pages.dev). There is no origin
server — nothing to keep alive. Migrated 2026-08-24 after the old
DigitalOcean droplet origin died unnoticed (months of 522s).

Deploy from this repo:

```bash
npm run build     # tsc && vite build -> dist/
wrangler pages deploy dist --project-name=jackgolden-net --branch=main --commit-dirty=true
```

## DNS via the API

```bash
CF="https://api.cloudflare.com/client/v4"
H="Authorization: Bearer $CLOUDFLARE_API_TOKEN"

curl -s -H "$H" "$CF/zones" | jq -r '.result[] | .id+"  "+.name'
curl -s -H "$H" "$CF/zones/<zone_id>/dns_records" \
  | jq -r '.result[] | .type+"  "+.name+"  "+.content+"  proxied="+(.proxied|tostring)'
curl -s -X PUT -H "$H" -H 'Content-Type: application/json' \
  "$CF/zones/<zone_id>/dns_records/<record_id>" \
  -d '{"type":"A","name":"<name>","content":"<ip>","proxied":true}'
# DELETE the same URL removes a record.
```

Zones on the account: jackgolden.net, superbgaming.us.

## Known-good origins

Every A/CNAME record must map to one of these, or it is stale:

| Target | What it is |
|---|---|
| Pages (`jackgolden-net`) | jackgolden.net — no IP, no origin |
| 69.48.204.5 | the IONOS box — superbgaming.us, superbcraft bot, jgserv proxy |

## The lesson this skill exists to keep

On 2026-08-24, `groovy.jackgolden.net` still resolved to a long-recycled
DigitalOcean IP — a stranger's live server, wearing this domain and its
certificate, proxied by Cloudflare without complaint. A stale record on a
recycled IP is a quiet hijack. When touching DNS here, list every record and
check it against the origins table above before finishing.
