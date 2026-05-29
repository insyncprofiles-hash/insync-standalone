# InSync Profiles — Standalone Setup Guide

This guide covers everything you need to run InSync Profiles on your own hosting, completely independent of the Manus platform.

---

## What Was Changed from the Manus Version

| Item | Manus Version | Standalone Version |
|---|---|---|
| Static assets | Served via Manus storage proxy | Served from `client/public/assets/` |
| Vite plugin | `vite-plugin-manus-runtime` | Removed |
| CSP headers | Included Manus analytics domains | Clean, generic CSP |
| Hardcoded URLs | `in-syncprofiles.manus.space` | `YOUR_DOMAIN` placeholder |
| Licence notifications | Manus Forge notification API | Generic POST webhook (optional) |
| Auth | Licence key system (unchanged) | Licence key system (unchanged) |

---

## Step 1 — Add Your Static Assets

All images and videos are referenced from `/assets/` in the code. You need to place your files in:

```
client/public/assets/
```

**Required files** (copy from your Manus project's storage or re-export originals):

| Filename | Used in |
|---|---|
| `insync-logo-transparent_9e0df532.png` | Navigation, landing page |
| `accessibility_icon_0186b679.png` | Landing page demo card |
| `accessibility-icon_f6ed13be.png` | Features section |
| `pete_james_headshot_c42b5c10.png` | Demo profile (Pete James) |
| `kira_chen_headshot_70b4d1ab.png` | Demo profile (Kira Chen) |
| `sample_qr_code_ed40ff77.png` | Landing page demo card |
| `infographic_branded_v2_0438716f.png` | Landing page infographic section |
| `insync_expo_post_v2_89644f5b.png` | Landing page social proof |
| `sw_final_video_new_music_46a119c4.mp4` | Demo video on profile editor |
| `sw_video_poster_0e4a9721.png` | Video poster frame |

**How to get these files from Manus:**
1. Open your Manus project at `https://in-syncprofiles.manus.space`
2. Open browser DevTools → Network tab
3. Filter by `assets` or `manus-storage`
4. Load each page that uses images — right-click each image → Save As
5. Place the saved files in `client/public/assets/` with the exact filenames above

**Alternative:** If you have the original source files, rename them to match the filenames above and place them in `client/public/assets/`.

---

## Step 2 — Replace YOUR_DOMAIN

Search the codebase for `YOUR_DOMAIN` and replace with your actual domain:

```bash
# macOS/Linux
grep -r "YOUR_DOMAIN" client/src --include="*.tsx" --include="*.ts" -l

# Replace all at once (replace yourdomain.com with your actual domain)
find client/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's|YOUR_DOMAIN|yourdomain.com|g'
```

Files that contain `YOUR_DOMAIN`:
- `client/src/pages/Admin.tsx` — admin panel instructions
- `client/src/pages/BlogPost.tsx` — blog post link
- `client/src/pages/Coordinators.tsx` — coordinator email template
- `client/src/pages/Home.tsx` — QR code URL fallback
- `client/src/pages/HowToUse.tsx` — how-to instructions
- `client/src/pages/Landing.tsx` — landing page copy
- `client/src/pages/Pricing.tsx` — pricing page instructions
- `client/src/pages/Privacy.tsx` — privacy policy
- `client/src/pages/SupportDeck.tsx` — demo profile URLs

---

## Step 3 — Set Up Your Database

The app uses MySQL. Free options:

| Provider | Free Tier | Notes |
|---|---|---|
| [PlanetScale](https://planetscale.com) | 5 GB, 1 billion row reads/month | Best for production |
| [Railway](https://railway.app) | $5 credit/month | Easiest if hosting on Railway |
| [Aiven](https://aiven.io) | 1 node, limited storage | Good for testing |
| [Clever Cloud](https://www.clever-cloud.com) | 5 MB MySQL | Very limited, dev only |

Once you have a database, get the connection string and set `DATABASE_URL` in your `.env`.

**Run the database migration:**
```bash
# Apply the schema to your database
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

Or apply the SQL directly from `drizzle/migrations/` using your database provider's SQL editor.

---

## Step 4 — Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=mysql://user:password@host:3306/insync_profiles
VITE_APP_DOMAIN=https://yourdomain.com
VITE_NOTIFICATION_WEBHOOK_URL=   # optional
```

---

## Step 5 — Install and Build

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Start the server
pnpm start
```

The server will start on `http://localhost:3000` (or the PORT you set).

---

## Deploying to Free Hosting

### Option A — Railway (Recommended)

Railway is the simplest option — it auto-detects Node.js, handles builds, and provides a free MySQL plugin.

1. Create an account at [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Connect your GitHub account and select your repository
4. Railway will detect the `pnpm build` and `pnpm start` scripts automatically
5. Add a **MySQL** plugin: click **+ New** → **Database** → **MySQL**
6. Copy the `DATABASE_URL` from the MySQL plugin into your Railway environment variables
7. Add all other environment variables from your `.env` file
8. Railway will auto-deploy on every push to `main`

**Custom domain on Railway:**
- Go to your service → **Settings** → **Domains** → **Add Custom Domain**

### Option B — Render

1. Create an account at [render.com](https://render.com)
2. Click **New** → **Web Service** → connect your GitHub repo
3. Set:
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
   - **Environment:** Node
4. Add environment variables in the **Environment** tab
5. For the database, create a separate **PostgreSQL** service (Render's free MySQL is limited — consider switching the Drizzle adapter to PostgreSQL, or use PlanetScale externally)

**Note:** Render's free tier spins down after 15 minutes of inactivity (cold starts ~30s).

### Option C — Local / VPS

```bash
# Clone your repo on the server
git clone https://github.com/yourusername/insync-profiles.git
cd insync-profiles

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
nano .env  # fill in your values

# Build
pnpm build

# Start with PM2 (keeps it running)
npm install -g pm2
pm2 start "pnpm start" --name insync-profiles
pm2 save
pm2 startup
```

---

## Licence Key Management

Licence keys are managed in the **Admin** panel at `/admin`. The admin panel is only accessible to the owner (you).

To generate keys:
1. Go to `yourdomain.com/admin`
2. Use the key generator to create and copy licence keys
3. Send keys to buyers manually (email, Gumroad fulfilment, etc.)

Buyers enter their key at `yourdomain.com/editor` — the key is validated client-side using SHA-256 hashing and stored in `localStorage`.

---

## Optional — Licence Activation Notifications

To get notified when a buyer activates their licence key, set `VITE_NOTIFICATION_WEBHOOK_URL` to any POST webhook:

**Discord:**
1. Go to your Discord server → Channel Settings → Integrations → Webhooks → New Webhook
2. Copy the webhook URL
3. Set `VITE_NOTIFICATION_WEBHOOK_URL=https://discord.com/api/webhooks/...`

**Slack:**
1. Create an Incoming Webhook at [api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks)
2. Set `VITE_NOTIFICATION_WEBHOOK_URL=https://hooks.slack.com/services/...`

**Make.com / Zapier / n8n:**
- Create a webhook trigger and paste the URL into `VITE_NOTIFICATION_WEBHOOK_URL`

---

## Support Deck (Wall Feature)

The Support Deck (`/deck`) allows coordinators to manage a wall of support worker profiles. It uses the Express API at `/api/deck` and requires the database to be running.

The Support Deck data is stored in the `wall_profiles` table — this is created automatically when you run the database migration.

---

## Troubleshooting

**Images not showing:**
- Confirm all files are in `client/public/assets/` with exact filenames
- Check browser console for 404 errors on `/assets/` paths
- Filenames are case-sensitive on Linux

**Database connection errors:**
- Verify `DATABASE_URL` format: `mysql://user:password@host:3306/dbname`
- Check your database provider's firewall allows connections from your hosting IP
- PlanetScale requires SSL — add `?ssl={"rejectUnauthorized":true}` to the URL

**Build errors:**
- Run `pnpm check` to see TypeScript errors
- Ensure Node.js 18+ is installed: `node --version`
- Clear cache: `rm -rf node_modules dist && pnpm install`

**Cold starts on Render free tier:**
- Upgrade to a paid plan, or use Railway which doesn't spin down
- Add a cron job (e.g. UptimeRobot free tier) to ping your URL every 14 minutes
