"use client";

import { useState } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ActionDialog } from "../action-dialog";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Unlink,
  Underline,
  LucideIcon,
  SquareCheck,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

type ToolbarButton = {
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  isSeparated?: boolean;
};

type TiptapToolbarProps = {
  editor: Editor | null;
};

function ToolbarButtonComponent({ button }: { button: ToolbarButton }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={button.onClick}
      disabled={button.disabled}
      className={button.isActive ? "bg-accent" : ""}
    >
      <button.icon className="size-4" />
      {button.children}
    </Button>
  );
}

export default function TiptapToolbar({ editor }: TiptapToolbarProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor?.isActive("link") ?? false,
      isBold: ctx.editor?.isActive("bold") ?? false,
      isItalic: ctx.editor?.isActive("italic") ?? false,
      isStrike: ctx.editor?.isActive("strike") ?? false,
      isCode: ctx.editor?.isActive("codeBlock") ?? false,
      isUnderline: ctx.editor?.isActive("underline") ?? false,
      isTaskList: ctx.editor?.isActive("taskList") ?? false,
      isQuote: ctx.editor?.isActive("blockquote") ?? false,
      isBulletList: ctx.editor?.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
      isH1: ctx.editor?.isActive("heading", { level: 1 }) ?? false,
      isH2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
      isH3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
    }),
  });

  const openLinkDialog = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setShowLinkDialog(true);
  };

  const saveLink = () => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkUrl("");
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();
    setLinkUrl("");
  };

  const toggleCodeBlock = () => {
    if (!editor) return;

    if (editorState?.isCode) {
      editor.chain().focus().toggleCodeBlock().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleCodeBlock()
        .updateAttributes("codeBlock", { language: "typescript" })
        .run();
    }
  };

  const marksButtons: ToolbarButton[] = [
    {
      icon: Bold,
      onClick: () => editor!.chain().focus().toggleBold().run(),
      isActive: editorState?.isBold,
    },
    {
      icon: Italic,
      onClick: () => editor!.chain().focus().toggleItalic().run(),
      isActive: editorState?.isItalic,
    },
    {
      icon: Strikethrough,
      onClick: () => editor!.chain().focus().toggleStrike().run(),
      isActive: editorState?.isStrike,
    },
    {
      icon: Code,
      onClick: toggleCodeBlock,
      isActive: editorState?.isCode,
    },
    {
      icon: Underline,
      onClick: () => editor!.chain().focus().toggleUnderline().run(),
      isActive: editorState?.isUnderline,
    },
    {
      icon: Link,
      onClick: openLinkDialog,
      isActive: editorState?.isLink,
    },
    {
      icon: Unlink,
      onClick: () => editor!.chain().focus().unsetLink().run(),
      disabled: !editorState?.isLink,
    },
  ];

  const nodeButtons: ToolbarButton[] = [
    {
      icon: SquareCheck,
      onClick: () => editor!.chain().focus().toggleTaskList().run(),
      isActive: editorState?.isTaskList,
    },
    {
      icon: Quote,
      onClick: () => editor!.chain().focus().toggleBlockquote().run(),
      isActive: editorState?.isQuote,
    },
    {
      icon: List,
      onClick: () => editor!.chain().focus().toggleBulletList().run(),
      isActive: editorState?.isBulletList,
    },
    {
      icon: ListOrdered,
      onClick: () => editor!.chain().focus().toggleOrderedList().run(),
      isActive: editorState?.isOrderedList,
    },
  ];

  const textButtons: ToolbarButton[] = [
    {
      icon: Heading1,
      onClick: () => editor!.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editorState?.isH1,
    },
    {
      icon: Heading2,
      onClick: () => editor!.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editorState?.isH2,
    },
    {
      icon: Heading3,
      onClick: () => editor!.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editorState?.isH3,
    },
  ];

  if (!editor) return null;

  return (
    <>
      <div className="px-4 py-2 gap-2 flex">
        {marksButtons.map((button, index) => (
          <ToolbarButtonComponent key={index} button={button} />
        ))}
        <Separator orientation="vertical" />
        {nodeButtons.map((button, index) => (
          <ToolbarButtonComponent key={index} button={button} />
        ))}
        <Separator orientation="vertical" />
        {textButtons.map((button, index) => (
          <ToolbarButtonComponent key={index} button={button} />
        ))}
      </div>

      <ActionDialog
        title="Insert URL"
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        onConfirm={saveLink}
        confirm="Save"
      >
        <Input
          placeholder="https://example.com"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          autoFocus
        />
      </ActionDialog>
    </>
  );
}
