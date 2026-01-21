"use client";

import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./animate-ui/components/radix/dialog";

type ActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  cancel?: string;
  confirm?: string;
  variant?: "default" | "destructive";
  children?: ReactNode;
};

export function ActionDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Action",
  description,
  cancel = "Cancel",
  confirm = "Confirm",
  variant = "default",
  children,
}: ActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onEnter={handleConfirm}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancel}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={variant}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
