"use client";

import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function TiptapCodeBlock({ node }: NodeViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const code = node.textContent;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="relative group my-4 bg-accent  rounded-md">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="sm"
          variant="secondary"
          onClick={copyToClipboard}
          className="border"
        >
          {copied ? (
            <>
              <Check className="size-3 mr-1" />
            </>
          ) : (
            <>
              <Copy className="size-3 mr-1" />
            </>
          )}
        </Button>
      </div>
      <pre>
        <code>
          <NodeViewContent />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}
