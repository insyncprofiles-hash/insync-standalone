/**
 * Cloudflare Pages Function: /view
 *
 * Intercepts /view requests before the SPA catches them.
 * Reads profile params from the query string and injects
 * personalised og:image, og:title, og:description meta tags
 * into the HTML so Facebook/LinkedIn scrapers see them.
 *
 * The og:image points to /api/og-image?... which generates
 * the profile card PNG on the fly.
 *
 * NOTE: The insync-og-worker (a separate pre-existing Cloudflare Worker)
 * may intercept this response and overwrite the og:image tag.
 * To work around this, we inject the dynamic og:image as the VERY FIRST
 * meta tag in <head> — Facebook/LinkedIn use the first occurrence they find.
 * We also replace the existing og:image tag using a permissive regex.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = Object.fromEntries(url.searchParams.entries());

  const name = q.name || "Support Worker";
  const title = q.title || "NDIS Support Worker";
  const location = q.location || "Australia";
  const tagline = q.tagline || "";

  // Forward all params to the og-image endpoint
  const ogParams = url.searchParams.toString();
  const ogImageUrl = `${url.origin}/api/og-image?${ogParams}`;
  const pageTitle = `${name} — ${title} | InSync Profiles`;
  const pageDesc = tagline
    ? `${tagline.slice(0, 150)} — View ${name}'s full interactive support worker profile.`
    : `View ${name}'s interactive support worker profile. Services, credentials, availability and communication style. ${location}.`;

  // Fetch the original index.html from the Pages asset
  const assetRes = await context.env.ASSETS.fetch(new Request(`${url.origin}/index.html`));
  let html = await assetRes.text();

  const esc = (s) => s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Strategy 1: Replace existing og:image tag using a permissive regex
  // (handles any whitespace/attribute order variations from insync-og-worker)
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"[^>]*\/?>/gi,
    `<meta property="og:image" content="${esc(ogImageUrl)}" />`
  );

  // Strategy 2: Inject the dynamic og:image as the VERY FIRST tag after <head>
  // Facebook/LinkedIn use the first og:image they find — this ensures our dynamic
  // URL wins even if the insync-og-worker overwrites the one later in the document.
  html = html.replace(
    /<head>/i,
    `<head>\n<meta property="og:image" content="${esc(ogImageUrl)}" />\n<meta property="og:image:width" content="900" />\n<meta property="og:image:height" content="1125" />`
  );

  // Replace other OG meta tags with permissive regex
  html = html
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"[^>]*\/?>/gi, `<meta property="og:title" content="${esc(pageTitle)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"[^>]*\/?>/gi, `<meta property="og:description" content="${esc(pageDesc)}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"[^>]*\/?>/gi, `<meta property="og:url" content="${esc(url.href)}" />`)
    .replace(/<meta\s+property="og:image:width"\s+content="[^"]*"[^>]*\/?>/gi, `<meta property="og:image:width" content="900" />`)
    .replace(/<meta\s+property="og:image:height"\s+content="[^"]*"[^>]*\/?>/gi, `<meta property="og:image:height" content="1125" />`)
    .replace(/<meta\s+property="og:image:alt"\s+content="[^"]*"[^>]*\/?>/gi, `<meta property="og:image:alt" content="${esc(name)} — Support Worker Profile | InSync Profiles" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"[^>]*\/?>/gi, `<meta name="twitter:title" content="${esc(pageTitle)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"[^>]*\/?>/gi, `<meta name="twitter:description" content="${esc(pageDesc)}" />`)
    .replace(/<meta\s+name="twitter:image"\s+content="[^"]*"[^>]*\/?>/gi, `<meta name="twitter:image" content="${esc(ogImageUrl)}" />`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "no-cache",
    },
  });
}
