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

  // Replace OG meta tags with profile-specific values
  html = html
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(pageTitle)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(pageDesc)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${esc(url.href)}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(ogImageUrl)}" />`)
    .replace(/<meta property="og:image:width" content="[^"]*" \/>/, `<meta property="og:image:width" content="900" />`)
    .replace(/<meta property="og:image:height" content="[^"]*" \/>/, `<meta property="og:image:height" content="1125" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(name)} — Support Worker Profile | InSync Profiles" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(pageTitle)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(pageDesc)}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${esc(ogImageUrl)}" />`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "no-cache",
    },
  });
}
