import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
}

export function useSEO({ title, description, canonical, noindex = false }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Description
    let descEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!descEl) {
      descEl = document.createElement("meta");
      descEl.name = "description";
      document.head.appendChild(descEl);
    }
    descEl.content = description;

    // Robots
    let robotsEl = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsEl) {
      robotsEl = document.createElement("meta");
      robotsEl.name = "robots";
      document.head.appendChild(robotsEl);
    }
    robotsEl.content = noindex ? "noindex, nofollow" : "index, follow";

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.rel = "canonical";
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = canonical;
    }

    // OG title + description
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.content = title;
    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.content = description;

    // Twitter title + description
    const twTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
    if (twTitle) twTitle.content = title;
    const twDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;
    if (twDesc) twDesc.content = description;

    return () => {
      // Restore defaults on unmount
      document.title = "InSync Profiles | Digital Profile Template for NDIS & Aged Care Support Workers";
    };
  }, [title, description, canonical, noindex]);
}
