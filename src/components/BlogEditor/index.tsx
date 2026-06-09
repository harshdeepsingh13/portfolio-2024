"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Heading from "@tiptap/extension-heading";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import { useEffect, useRef, useState } from "react";
import { CharCountWrapper, EditorWrapper } from "./styles";
import { ChipExtension } from "./ChipExtension";
import { importTiptapJson } from "@/services/blog/importJson";

// Configure lowlight with supported languages
const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("css", css);
lowlight.register("python", python);

function ToolbarBtn({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`toolbar-btn${isActive ? " is-active" : ""}`}
      title={title}
    >
      {children}
    </button>
  );
}

interface BlogEditorProps {
  /** Initial TipTap JSON document */
  content?: Record<string, unknown>;
  /** HTML string fallback — used when body_json is absent (e.g. seeded posts) */
  contentHtml?: string;
  /** Called whenever content changes */
  onChange?: (data: { json: Record<string, unknown>; html: string }) => void;
  placeholder?: string;
}

export default function BlogEditor({
  content,
  contentHtml,
  onChange,
  placeholder = "Write your post here…",
}: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      // StarterKit without the extensions we're replacing
      StarterKit.configure({
        heading: false,       // replaced by Heading extension below
        codeBlock: false,     // replaced by CodeBlockLowlight
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      // Heading with explicit levels
      Heading.configure({ levels: [1, 2, 3, 4] }),
      // Syntax-highlighted code blocks
      CodeBlockLowlight.configure({ lowlight }),
      // Link
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      // Image
      ImageExtension.configure({ inline: false, allowBase64: true }),
      // YouTube embed
      Youtube.configure({ width: 640, height: 360 }),
      // Placeholder
      Placeholder.configure({ placeholder }),
      // Character count
      CharacterCount,
      // Tables
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      // Inline chip labels
      ChipExtension,
    ],
    content: content ?? contentHtml ?? "",
    editorProps: {
      attributes: {
        spellcheck: "true",
      },
    },
    onUpdate({ editor }) {
      if (onChange) {
        onChange({
          json: editor.getJSON() as Record<string, unknown>,
          html: editor.getHTML(),
        });
      }
    },
  });

  // Sync external content changes (e.g. when loading an existing post)
  useEffect(() => {
    if (!editor) return;
    if (content) {
      const currentJson = JSON.stringify(editor.getJSON());
      const newJson = JSON.stringify(content);
      if (currentJson !== newJson) {
        // emitUpdate: false — TipTap v3 defaults to true, which would fire onUpdate
        // and mark the form dirty even though this is a programmatic content load.
        editor.commands.setContent(content, { emitUpdate: false });
      }
    } else if (contentHtml && editor.isEmpty) {
      editor.commands.setContent(contentHtml, { emitUpdate: false });
    }
  }, [editor, content, contentHtml]);

  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    e.target.value = ""; // reset so same file can be re-selected

    if (!editor.isEmpty) {
      const ok = window.confirm(
        "Uploading a JSON will replace all existing content and cannot be undone. Continue?",
      );
      if (!ok) return;
    }

    setImportError(null);
    try {
      const { json, warnings } = await importTiptapJson(file);
      if (editor.isDestroyed) return;
      // TipTap v3: second arg is an options object, not a boolean
      editor.commands.setContent(json, { emitUpdate: true });
      if (warnings.length > 0) {
        setImportError(`Imported with warnings: ${warnings.join("; ")}`);
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed");
    }
  };

  if (!editor) return null;

  const charCount = editor.storage.characterCount?.characters?.() ?? 0;
  const wordCount = editor.storage.characterCount?.words?.() ?? 0;

  return (
    <EditorWrapper>
      {/* Toolbar */}
      <div className="tiptap-toolbar">
        {/* History */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          ↩
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          ↪
        </ToolbarBtn>
        <div className="toolbar-divider" />

        {/* Headings */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarBtn>
        <div className="toolbar-divider" />

        {/* Inline marks */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline code"
        >
          {"<>"}
        </ToolbarBtn>
        <div className="toolbar-divider" />

        {/* Lists */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet list"
        >
          • —
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered list"
        >
          1. —
        </ToolbarBtn>
        <div className="toolbar-divider" />

        {/* Blocks */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          ❝
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code block"
        >
          {"{ }"}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          —
        </ToolbarBtn>
        <div className="toolbar-divider" />

        {/* Link */}
        <ToolbarBtn
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          isActive={editor.isActive("link")}
          title="Insert link"
        >
          🔗
        </ToolbarBtn>

        {/* Image */}
        <ToolbarBtn
          onClick={() => {
            const url = window.prompt("Enter image URL:");
            if (!url) return;
            const alt = window.prompt("ALT text (describe the image for SEO & accessibility):") ?? "";
            editor.chain().focus().setImage({ src: url, alt: alt.trim() }).run();
          }}
          title="Insert image"
        >
          🖼
        </ToolbarBtn>

        {/* Edit image ALT text */}
        <ToolbarBtn
          onClick={() => {
            if (!editor.isActive("image")) return;
            const currentAlt = (editor.getAttributes("image").alt as string) ?? "";
            const alt = window.prompt("Edit image ALT text:", currentAlt);
            if (alt !== null) {
              editor.chain().focus().updateAttributes("image", { alt: alt.trim() }).run();
            }
          }}
          isActive={editor.isActive("image")}
          title="Edit image ALT text"
        >
          ALT
        </ToolbarBtn>

        {/* YouTube */}
        <ToolbarBtn
          onClick={() => {
            const url = window.prompt("Enter YouTube URL:");
            if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }}
          title="Embed YouTube"
        >
          ▶
        </ToolbarBtn>

        {/* Chip */}
        <ToolbarBtn
          onClick={() => {
            const label = window.prompt("Chip label:");
            if (label?.trim()) {
              editor
                .chain()
                .focus()
                .insertContent({ type: "chip", attrs: { label: label.trim() } })
                .run();
            }
          }}
          title="Insert chip"
        >
          🏷
        </ToolbarBtn>
        <div className="toolbar-divider" />

        {/* Table */}
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          title="Insert table"
        >
          ⊞
        </ToolbarBtn>
        <div className="toolbar-divider" />
        <ToolbarBtn onClick={() => jsonInputRef.current?.click()} title="Upload TipTap JSON">
          ↑ JSON
        </ToolbarBtn>
        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleJsonImport}
        />
      </div>

      {/* Bubble menu for selected text */}
      <BubbleMenu
        editor={editor}
        className="bubble-menu"
      >
        <button
          type="button"
          className={`toolbar-btn${editor.isActive("bold") ? " is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`toolbar-btn${editor.isActive("italic") ? " is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={`toolbar-btn${editor.isActive("link") ? " is-active" : ""}`}
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          title="Link"
        >
          🔗
        </button>
      </BubbleMenu>

      {/* Editor content area */}
      <EditorContent editor={editor} style={{ flex: 1, display: "flex", flexDirection: "column" }} />

      {/* Character / word count */}
      <CharCountWrapper>
        {wordCount} words · {charCount} characters
      </CharCountWrapper>
      {importError && (
        <div
          style={{
            fontSize: "0.75rem",
            color: importError.startsWith("Imported with warnings") ? "#f59e0b" : "#ef4444",
            marginTop: "4px",
            padding: "6px 10px",
            borderRadius: "4px",
            backgroundColor: importError.startsWith("Imported with warnings")
              ? "rgba(245,158,11,0.08)"
              : "rgba(239,68,68,0.08)",
          }}
        >
          {importError}
        </div>
      )}
    </EditorWrapper>
  );
}
