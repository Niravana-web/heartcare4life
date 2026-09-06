import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { ComponentProps } from "react";

/** Renders markdown page bodies. Handles the **[EMBED]** url convention and raw <div> leftovers. */
export default function Prose({ body, className = "" }: { body: string; className?: string }) {
  const md = body
    .replace(/<div[^>]*>[\s\S]*?<\/div>/g, "")
    .replace(/^-\s*\*\*\[EMBED\]\*\*\s*(\S+)\s*$/gm, "EMBED::$1")
    .replace(/^\*\*\[EMBED\]\*\*\s*(\S+)\s*$/gm, "EMBED::$1")
    .replace(/^\*\*\[VIDEO\]\*\*\s*(\S+)\s*$/gm, "")
    .replace(/^-!\[/gm, "![");
  return (
    <div className={`prose-hc ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: (props) => {
            const { children, ...rest } = props as { children?: React.ReactNode; node?: unknown } & ComponentProps<"p">;
            delete (rest as { node?: unknown }).node;
            const first = Array.isArray(children) ? children[0] : children;
            if (typeof first === "string" && first.startsWith("EMBED::")) {
              const url = first.slice(7);
              const isMap = url.includes("google.com/maps");
              const isYt = url.includes("youtube");
              if (!isMap && !isYt) return <p><a href={url} target="_blank" rel="noopener">{url}</a></p>;
              return (
                <div className={`embed ${isMap ? "map" : ""}`}>
                  <iframe src={isYt ? url.replace("youtube.com", "youtube-nocookie.com").split("?")[0] : url} title={isMap ? "Office location map" : "YouTube video"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                </div>
              );
            }
            return <p {...(rest as ComponentProps<"p">)}>{children}</p>;
          },
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href = "", children }) => {
            if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
            const ext = href.startsWith("http");
            return <a href={href} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>{children}</a>;
          },
          img: ({ src = "", alt = "" }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : ""} alt={alt} loading="lazy" decoding="async" />
          ),
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
