import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { isValidElement, type ComponentProps, type ReactNode } from "react";

/** Flatten a rendered markdown node back to plain text.
 *  remark-gfm autolinks a bare URL, so "EMBED::https://…" arrives split across a
 *  string and an <a> element. Reading only children[0] loses the URL entirely. */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

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
            const text = textOf(children).trim();
            if (text.startsWith("EMBED::")) {
              const url = text.slice("EMBED::".length).trim();
              const isMap = url.includes("google.com/maps");
              const isYt = url.includes("youtube");
              if (!url) return null;
              if (!isMap && !isYt) return <div className="embed"><iframe src={url} title="Embedded video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>;
              return (
                <div className={`embed ${isMap ? "map" : ""}`}>
                  <iframe src={isYt ? url.replace("youtube.com", "youtube-nocookie.com").split("?")[0] : url} title={isMap ? "Office location map" : "YouTube video"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                </div>
              );
            }
            return <p {...(rest as ComponentProps<"p">)}>{children}</p>;
          },
          h1: ({ children }) => <h2>{children}</h2>,
          // Comparison tables are wide; give each its own horizontal scroll container.
          table: ({ children }) => <div className="table-scroll"><table>{children}</table></div>,
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
