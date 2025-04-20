"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  ImageIcon,
  Undo,
  Redo,
  Strikethrough,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

const SimpleEditor = ({ onChange }: { onChange?: (json: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-neon-pink hover:text-neon-cyan transition-colors duration-200",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md border border-neon-cyan/30 shadow-lg mx-auto my-4",
        },
      }),
      Placeholder.configure({
        placeholder: "Begin your story here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      onChange?.(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="editor-container bg-zinc-900/95 border border-neon-cyan/40 rounded-md overflow-hidden">
      <div className="editor-toolbar bg-black/80 backdrop-blur-sm p-2 border-b border-neon-cyan/30 flex flex-wrap gap-1">
        <div className="flex items-center space-x-1 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`toolbar-btn ${
              editor.isActive("italic") ? "active" : ""
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`toolbar-btn ${
              editor.isActive("strike") ? "active" : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`toolbar-btn ${editor.isActive("code") ? "active" : ""}`}
            title="Code"
          >
            <Code size={16} />
          </button>
        </div>

        <div className="border-l border-neon-cyan/30 mx-1 h-6"></div>

        <div className="flex items-center space-x-1 mr-2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`toolbar-btn ${
              editor.isActive("heading", { level: 1 }) ? "active" : ""
            }`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`toolbar-btn ${
              editor.isActive("heading", { level: 2 }) ? "active" : ""
            }`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
        </div>

        <div className="border-l border-neon-cyan/30 mx-1 h-6"></div>

        <div className="flex items-center space-x-1 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`toolbar-btn ${
              editor.isActive("bulletList") ? "active" : ""
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`toolbar-btn ${
              editor.isActive("orderedList") ? "active" : ""
            }`}
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`toolbar-btn ${
              editor.isActive("blockquote") ? "active" : ""
            }`}
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="toolbar-btn"
            title="Horizontal Rule"
          >
            <Minus size={16} />
          </button>
        </div>

        <div className="border-l border-neon-cyan/30 mx-1 h-6"></div>
        <div className="flex items-center space-x-1 mr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`toolbar-btn ${
              editor.isActive({ textAlign: "left" }) ? "active" : ""
            }`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`toolbar-btn ${
              editor.isActive({ textAlign: "center" }) ? "active" : ""
            }`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`toolbar-btn ${
              editor.isActive({ textAlign: "right" }) ? "active" : ""
            }`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetTextAlign().run()}
            className={`toolbar-btn ${
              editor.isActive({ textAlign: "" }) ? "active" : ""
            }`}
            title="Align Justify"
          >
            <AlignJustify size={16} />
          </button>
        </div>

        <div className="border-l border-neon-cyan/30 mx-1 h-6"></div>

        <div className="flex items-center space-x-1 mr-2">
          <button
            onClick={addLink}
            className={`toolbar-btn ${editor.isActive("link") ? "active" : ""}`}
            title="Add Link"
          >
            <LinkIcon size={16} />
          </button>
          <button onClick={addImage} className="toolbar-btn" title="Add Image">
            <ImageIcon size={16} />
          </button>
        </div>

        <div className="border-l border-neon-cyan/30 mx-1 h-6"></div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`toolbar-btn ${
              !editor.can().undo() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`toolbar-btn ${
              !editor.can().redo() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>

      <div className="editor-content-wrapper bg-zinc-900 relative min-h-[350px]">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-black/0 via-neon-cyan/5 to-neon-pink/5"></div>
        <EditorContent editor={editor} />

        <div className="absolute bottom-2 right-3 text-neon-cyan/30 text-xs pointer-events-none font-mono">
          NETRUNNER_EDITOR
        </div>
      </div>

      <style jsx global>{`
        .toolbar-btn {
          @apply p-2 rounded-sm text-neon-cyan/80 hover:text-neon-pink transition-colors duration-150 
                 hover:bg-black/30 border border-transparent hover:border-neon-cyan/30 hover:shadow-[0_0_5px_rgba(6,182,212,0.3)];
        }

        .toolbar-btn.active {
          @apply bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50 shadow-[0_0_8px_rgba(6,182,212,0.4)];
        }

        .ProseMirror {
          @apply min-h-[300px] p-4 focus:outline-none;
        }

        .ProseMirror p {
          @apply text-zinc-200 mb-4;
        }

        .ProseMirror h1 {
          @apply text-2xl font-bold text-neon-cyan mb-4 mt-6 border-b border-neon-cyan/30 pb-2;
        }

        .ProseMirror h2 {
          @apply text-xl font-bold text-neon-cyan mb-3 mt-5;
        }

        .ProseMirror h3 {
          @apply text-lg font-bold text-neon-pink mb-2 mt-4;
        }

        .ProseMirror blockquote {
          @apply border-l-4 border-neon-cyan pl-4 italic my-4 text-zinc-300 bg-black/30 py-1;
        }

        .ProseMirror ul {
          @apply list-disc pl-5 my-4;
        }

        .ProseMirror ol {
          @apply list-decimal pl-5 my-4;
        }

        .ProseMirror code {
          @apply bg-black/50 text-neon-pink px-1 py-0.5 rounded;
        }

        .ProseMirror pre {
          @apply bg-black/70 text-neon-cyan p-3 rounded-md border border-neon-cyan/20 shadow-inner my-4;
          overflow-x: auto;
        }

        .ProseMirror hr {
          @apply my-4 border-t-2 border-neon-cyan/30;
        }

        .ProseMirror a {
          @apply text-neon-pink hover:text-neon-cyan transition-colors duration-200;
        }

        .ProseMirror img {
          @apply max-w-full h-auto rounded-md border border-neon-cyan/30 shadow-lg my-4;
          margin-left: auto;
          margin-right: auto;
        }

        .ProseMirror-focused {
          @apply outline-none ring-0;
        }

        .ProseMirror .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          @apply text-zinc-500 float-left h-0 pointer-events-none;
        }
      `}</style>
    </div>
  );
};

export default SimpleEditor;
