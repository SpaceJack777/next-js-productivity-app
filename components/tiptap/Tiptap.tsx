"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import TiptapToolbar from "./TiptapToolbar";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TiptapTaskItem } from "./TiptapTaskItem";
import { TiptapCodeBlock } from "./TiptapCodeBlock";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

type TiptapProps = {
  content?: string;
  onChange?: (content: string) => void;
};

const lowlight = createLowlight(common);

const Tiptap = ({ content, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "typescript",
        languageClassPrefix: "language-",
        HTMLAttributes: {
          class: "rounded-md bg-muted p-4 font-mono text-sm",
        },
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(TiptapCodeBlock);
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start gap-2",
        },
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(TiptapTaskItem);
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "!outline-none !focus-visible:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  const handleContentClick = () => {
    if (editor && !editor.isFocused) {
      editor.commands.focus();
    }
  };

  return (
    <div className="overflow-hidden h-full flex flex-col">
      <TiptapToolbar editor={editor} />
      <div
        className="p-4 prose prose-sm max-w-none dark:prose-invert flex-1 cursor-text overflow-y-auto tiptap"
        onClick={handleContentClick}
      >
        <EditorContent
          className="!focus-visible:outline-none"
          editor={editor}
        />
      </div>
    </div>
  );
};

export default Tiptap;
