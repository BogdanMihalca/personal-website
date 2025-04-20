"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import "@/styles/enhanced-editor.css";
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
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  CheckSquare,
  AlignJustify,
} from "lucide-react";

const EnhancedEditor = ({
  onChange,
  content,
}: {
  onChange?: (json: string) => void;
  content: string;
}) => {
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
        placeholder: "Begin your cyberpunk story here...",
        emptyEditorClass: "is-editor-empty",
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-neon-cyan/20 text-neon-cyan rounded px-1",
        },
      }),
      Subscript,
      Superscript,
      TaskList.configure({
        HTMLAttributes: {
          class: "task-list",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "task-item",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Typography,
      Underline,
    ],
    content: JSON.parse(content),
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

  const addTaskList = () => {
    editor.chain().focus().toggleTaskList().run();
  };

  return (
    <div className="editor-container bg-zinc-900/95 border border-neon-cyan/40 rounded-md overflow-hidden">
      <div className="editor-toolbar-container bg-black/80 backdrop-blur-sm border-b border-neon-cyan/30">
        <div className="editor-toolbar p-2 flex flex-wrap gap-1 overflow-x-auto">
          {/* Text styling */}
          <div className="toolbar-group flex items-center space-x-1 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`toolbar-btn ${
                editor.isActive("bold") ? "active" : ""
              }`}
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
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`toolbar-btn ${
                editor.isActive("underline") ? "active" : ""
              }`}
              title="Underline"
            >
              <UnderlineIcon size={16} />
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
          </div>

          <div className="toolbar-divider"></div>

          {/* Text format */}
          <div className="toolbar-group flex items-center space-x-1 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`toolbar-btn ${
                editor.isActive("highlight") ? "active" : ""
              }`}
              title="Highlight"
            >
              <Highlighter size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`toolbar-btn ${
                editor.isActive("code") ? "active" : ""
              }`}
              title="Code"
            >
              <Code size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={`toolbar-btn ${
                editor.isActive("subscript") ? "active" : ""
              }`}
              title="Subscript"
            >
              <SubscriptIcon size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`toolbar-btn ${
                editor.isActive("superscript") ? "active" : ""
              }`}
              title="Superscript"
            >
              <SuperscriptIcon size={16} />
            </button>
          </div>

          <div className="toolbar-divider"></div>

          {/* Headings */}
          <div className="toolbar-group flex items-center space-x-1 mr-2">
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

          <div className="toolbar-divider"></div>

          {/* Lists */}
          <div className="toolbar-group flex items-center space-x-1 mr-2">
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
              onClick={addTaskList}
              className={`toolbar-btn ${
                editor.isActive("taskList") ? "active" : ""
              }`}
              title="Task List"
            >
              <CheckSquare size={16} />
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
          </div>

          <div className="toolbar-divider"></div>

          {/* Alignment */}
          <div className="toolbar-group flex items-center space-x-1 mr-2">
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
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
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
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={`toolbar-btn ${
                editor.isActive({ textAlign: "justify" }) ? "active" : ""
              }`}
              title="Justify"
            >
              <AlignJustify size={16} />
            </button>
          </div>

          <div className="toolbar-divider"></div>

          {/* Links and media */}
          <div className="toolbar-group flex items-center space-x-1 mr-2">
            <button
              onClick={addLink}
              className={`toolbar-btn ${
                editor.isActive("link") ? "active" : ""
              }`}
              title="Add Link"
            >
              <LinkIcon size={16} />
            </button>
            <button
              onClick={addImage}
              className="toolbar-btn"
              title="Add Image"
            >
              <ImageIcon size={16} />
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="toolbar-btn"
              title="Horizontal Rule"
            >
              <Minus size={16} />
            </button>
          </div>

          <div className="toolbar-divider"></div>

          {/* History */}
          <div className="toolbar-group flex items-center space-x-1">
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
      </div>

      <div className="editor-content-wrapper bg-zinc-900 relative min-h-[350px]">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-black/0 via-neon-cyan/5 to-neon-pink/5"></div>
        <EditorContent
          editor={editor}
          onClick={() => editor.commands.focus()}
        />

        <div className="absolute bottom-2 right-3 text-neon-cyan/30 text-xs pointer-events-none font-mono">
          NETRUNNER_EDITOR_v2.0
        </div>
      </div>
    </div>
  );
};

export default EnhancedEditor;
