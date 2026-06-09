/**
 * Cloudflare Pages Function: /api/shorten
 * Proxies URL shortening requests so the Bitly token never reaches the browser.
 *
 * Set the secret in Cloudflare Pages dashboard:
 *   Settings → Environment variables → Add variable
 *   Name: BITLY_TOKEN   Value: <your token>   (mark as Encrypted)
 *
 * POST /api/shorten
 * Body: { "url": "https://insyncprofiles.net/view?..." }
 * Returns: { "short": "https://bit.ly/xxx" } or { "short": null, "fallback": "https://tinyurl.com/..." }
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS — allow requests from the same origin
  const origin = request.headers.get("Origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const longUrl = body?.url;
  if (!longUrl || typeof longUrl !== "string" || !longUrl.startsWith("http")) {
    return new Response(JSON.stringify({ error: "Missing or invalid url" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const BITLY_TOKEN = env.BITLY_TOKEN;

  // --- Try Bitly ---
  if (BITLY_TOKEN) {
    try {
      const bitlyRes = await fetch("https://api-ssl.bitly.com/v4/shorten", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BITLY_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ long_url: longUrl }),
      });
      const bitlyData = await bitlyRes.json();
      const short = bitlyData?.link;
      if (short && short.startsWith("http")) {
        return new Response(JSON.stringify({ short }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } catch {
      // fall through to TinyURL
    }
  }

  // --- Fallback: TinyURL v2 API (returns direct link, no preview redirect) ---
  try {
    const tinyRes = await fetch("https://api.tinyurl.com/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: longUrl, domain: "tinyurl.com" }),
    });
    const tinyData = await tinyRes.json();
    const short = tinyData?.data?.tiny_url;
    if (short && short.startsWith("http")) {
      return new Response(JSON.stringify({ short, fallback: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch {
    // both failed
  }

  return new Response(JSON.stringify({ short: null }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// Handle CORS preflight
export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
