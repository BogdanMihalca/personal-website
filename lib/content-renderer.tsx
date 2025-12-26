/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

interface ContentNode {
  type: string;
  content?: ContentNode[];
  attrs?: Record<string, any>;
  text?: string;
  marks?: { type: string; attrs?: Record<string, any> }[];
}

export function ContentRenderer({
  content,
}: {
  content: string | null | undefined;
}) {
  if (!content) return null;

  try {
    const parsedContent = JSON.parse(content);

    return renderNode(parsedContent);
  } catch (error) {
    console.error("Failed to parse content:", error);
    return <p className="text-red-500">Error rendering content</p>;
  }
}

function renderNode(node: ContentNode): React.ReactNode {
  switch (node.type) {
    case "doc":
      return (
        <div className="space-y-6">
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </div>
      );

    case "paragraph":
      const textAlign = node.attrs?.textAlign;
      const alignmentClass = textAlign ? `text-${textAlign}` : "";

      return (
        <p
          className={`text-zinc-300 leading-relaxed font-mono ${alignmentClass}`}
        >
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </p>
      );

    case "heading":
      const level = node.attrs?.level || 2;
      const HeadingTag = `h${level}`;
      const headingClasses =
        {
          h1: "text-2xl font-bold text-neon-cyan mb-4 mt-6 border-b border-neon-cyan/30 pb-2",
          h2: "text-xl font-bold text-neon-cyan mb-3 mt-5",
          h3: "text-lg font-bold text-neon-pink mb-2 mt-4",
          h4: "text-base font-bold text-purple-400 mb-2 mt-3",
          h5: "text-sm font-bold text-cyan-300 mb-2 mt-3",
          h6: "text-xs font-bold text-zinc-200 mb-2 mt-2 uppercase tracking-wider",
        }[HeadingTag] || "";

      return React.createElement(
        HeadingTag,
        { className: headingClasses },
        node.content?.map((child, i) => (
          <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
        ))
      );

    case "bulletList":
      return (
        <ul className="list-disc pl-6 space-y-2 my-4 text-zinc-300">
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </ul>
      );

    case "orderedList":
      return (
        <ol className="list-decimal pl-6 space-y-2 my-4 text-zinc-300">
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </ol>
      );

    case "bullet_list":
      return (
        <ul className="list-disc pl-6 space-y-2 my-4 text-zinc-300">
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </ul>
      );
    case "ordered_list":
      return (
        <ol className="list-decimal pl-6 space-y-2 my-4 text-zinc-300">
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </ol>
      );

    case "list_item":
      return (
        <li>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </li>
      );

    case "listItem":
      return (
        <li>
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </li>
      );

    case "blockquote":
      return (
        <blockquote className="border-l-4 border-neon-cyan pl-4 py-2 my-4 bg-black/30 text-zinc-300 italic">
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre className="bg-black/70 border border-neon-cyan/30 rounded-md p-4 my-4 overflow-x-auto shadow-[inset_0_0_8px_rgba(6,182,212,0.2)]">
          <code className="text-neon-cyan text-sm font-mono block">
            {node.content?.map((child, i) => (
              <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
            ))}
          </code>
        </pre>
      );

    case "text":
      if (!node.marks || node.marks.length === 0) {
        return node.text || null;
      }

      return node.marks.reduce((acc, mark) => {
        switch (mark.type) {
          case "bold":
            return <strong className="font-bold text-zinc-100">{acc}</strong>;
          case "italic":
            return <em className="italic">{acc}</em>;
          case "underline":
            return <u>{acc}</u>;
          case "strike":
            return <s className="text-zinc-500">{acc}</s>;
          case "code":
            return (
              <code className="bg-black/70 text-neon-pink px-1.5 py-0.5 rounded text-sm font-mono">
                {acc}
              </code>
            );
          case "link":
            return (
              <Link
                href={mark.attrs?.href || "#"}
                className="text-neon-cyan hover:text-neon-pink underline transition-colors"
              >
                {acc}
              </Link>
            );
          case "highlight":
            return (
              <mark className="bg-neon-cyan/20 text-neon-cyan rounded px-1">
                {acc}
              </mark>
            );
          case "subscript":
            return <sub>{acc}</sub>;
          case "superscript":
            return <sup>{acc}</sup>;
          default:
            return acc;
        }
      }, <>{node.text || null}</>);

    case "image":
      return (
        <div className="my-6 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 via-neon-pink/20 to-neon-cyan/20 blur-md opacity-70 -z-10"></div>
          <figure className="relative border border-zinc-800/50 bg-black/50 rounded-md overflow-hidden">
            <img
              src={node.attrs?.src || ""}
              alt={node.attrs?.alt || ""}
              className="w-full h-auto rounded-md"
            />
            {node.attrs?.caption && (
              <figcaption className="text-zinc-400 text-sm italic p-2 text-center">
                {node.attrs.caption}
              </figcaption>
            )}
          </figure>
        </div>
      );

    case "horizontalRule":
      return <hr className="my-6 border-t border-zinc-800" />;

    case "taskList":
      return (
        <ul className="list-none pl-0 space-y-2 my-4 text-zinc-300">
          {node.content?.map((child, i) => (
            <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
          ))}
        </ul>
      );

    case "taskItem":
      const checked = node.attrs?.checked;

      return (
        <li className="flex items-start gap-2">
          <div
            className={`mt-1 w-4 h-4 border rounded flex items-center justify-center ${
              checked
                ? "bg-neon-cyan/20 border-neon-cyan/50"
                : "bg-black/30 border-zinc-700"
            }`}
          >
            {checked && <span className="text-neon-cyan text-xs">✓</span>}
          </div>
          <div>
            {node.content?.map((child, i) => (
              <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
            ))}
          </div>
        </li>
      );

    default:
      return null;
  }
}
