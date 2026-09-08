import type { NextConfig } from "next";
import redirects from "./redirects.json";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return redirects as { source: string; destination: string; permanent: boolean }[];
  },
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: [
        "default-src 'self'",
        // Next.js inlines its bootstrap and Framer Motion writes inline styles.
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://i.ytimg.com https://*.ytimg.com https://maps.gstatic.com https://*.googleapis.com https://*.ggpht.com",
        "media-src 'self' https://videos.pexels.com",
        "font-src 'self' data:",
        "connect-src 'self' https://videos.pexels.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
        "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com https://maps.google.com https://www.ypo.education",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "upgrade-insecure-requests",
      ].join("; ") },
    ] }, {
      source: "/:file(.*\\.(?:jpg|jpeg|png|svg|webp|avif|ico|woff2))",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }];
  },
};

export default nextConfig;
