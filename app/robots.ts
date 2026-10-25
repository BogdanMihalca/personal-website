import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://bogdanmihalca.com";

  return {
    rules: [
      // ── General crawlers ────────────────────────────────────────────────
      {
        userAgent: "*",
        allow: ["/", "/blog", "/llms.txt"],
        disallow: [
          "/api/",
          "/blog/dashboard/",
          "/admin/",
          "/_next/",
          "/private/",
          "/api/trap",
        ],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/blog"],
        disallow: ["/api/", "/admin/", "/private/", "/blog/dashboard/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/blog"],
        disallow: ["/api/", "/admin/", "/private/", "/blog/dashboard/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/blog"],
        disallow: ["/api/", "/admin/", "/private/", "/blog/dashboard/"],
      },
      {
        userAgent: "YouBot",
        allow: ["/", "/blog"],
        disallow: ["/api/", "/admin/", "/private/", "/blog/dashboard/"],
      },
      {
        userAgent: "PetalBot",
        allow: ["/", "/blog"],
        disallow: ["/api/", "/admin/", "/private/", "/blog/dashboard/"],
      },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "Omgilibot", disallow: "/" },
      { userAgent: "FacebookBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "cohere-ai", disallow: "/" },

      { userAgent: "DataForSeoBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "AhrefsBot", disallow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
