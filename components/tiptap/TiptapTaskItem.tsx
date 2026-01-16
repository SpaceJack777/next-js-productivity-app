"use client";

import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";

export function TiptapTaskItem({ node, updateAttributes }: NodeViewProps) {
  const checked = node.attrs.checked as boolean;

  return (
    <NodeViewWrapper
      as="li"
      data-checked={checked}
      className="flex items-center gap-2"
    >
      <Checkbox
        contentEditable={false}
        checked={checked}
        onCheckedChange={(newChecked) =>
          updateAttributes({ checked: newChecked === true })
        }
        size="sm"
        variant="accent"
      />
      <NodeViewContent as="div" className="flex-1" />
    </NodeViewWrapper>
  );
}
