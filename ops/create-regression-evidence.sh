#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TS="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="${ROOT_DIR}/evidence/regression-${TS}"

mkdir -p "${OUT_DIR}"

cat > "${OUT_DIR}/README.txt" <<EOF
Regression Evidence Folder: regression-${TS}

Goal:
- Run manual regression for H5 + WeChat Mini Program.
- Collect screenshots and any console/network errors.

How to use:
- Follow H5.md and MP_WEIXIN.md.
- Put screenshots under screenshots/.
- If something fails, paste the full stack trace and the exact steps to reproduce.
EOF

mkdir -p "${OUT_DIR}/screenshots"

cat > "${OUT_DIR}/H5.md" <<'EOF'
# H5 Manual Regression (Evidence)

## Start (production build preview)
Commands:
```bash
cd /Users/adam/0.9/lilishop-uniapp
npm run build:h5
bash ops/serve-h5-dist.sh
```

Open:
- http://127.0.0.1:5174/

## Checklist (minimum)
1. App boots (no white screen)
2. Home renders + tabbar visible
3. Category page opens
4. Search page opens + can search a keyword
5. Goods detail page opens
6. Add to cart succeeds
7. Cart page opens and shows item
8. Checkout page opens (submit optional)
9. Mine page opens

## Evidence to save
- 6 to 10 screenshots in `screenshots/`:
  - 01-home.png, 02-category.png, 03-search.png, 04-goods.png, 05-cart.png, 06-checkout.png, 07-mine.png
- If any failure:
  - Browser console error text
  - Network tab failing request (URL + status + response body head)
EOF

cat > "${OUT_DIR}/MP_WEIXIN.md" <<'EOF'
# WeChat Mini Program Manual Regression (Evidence)

## Build
Commands:
```bash
cd /Users/adam/0.9/lilishop-uniapp
npm run build:mp-weixin
```

## Open in WeChat DevTools
Project path:
- /Users/adam/0.9/lilishop-uniapp/dist/build/mp-weixin

## Checklist (minimum)
1. App boots (no blank page)
2. Home renders + tabbar visible
3. Category opens
4. Search opens
5. Goods detail opens
6. Add to cart works
7. Cart shows item
8. Checkout page opens (submit optional)
9. Mine opens

## Evidence to save
- 6 to 10 screenshots in `screenshots/`:
  - mp-01-home.png, mp-02-category.png, mp-03-search.png, mp-04-goods.png, mp-05-cart.png, mp-06-checkout.png, mp-07-mine.png
- If any failure:
  - DevTools console error text
  - Request failure details
EOF

echo "${OUT_DIR}"
