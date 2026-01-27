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
  onOpenChangeAction: (open: boolean) => void;
  onConfirmAction: () => void | Promise<void>;
  title?: string;
  description?: string;
  cancel?: string;
  confirm?: string;
  variant?: "default" | "destructive";
  children?: ReactNode;
};

export function ActionDialog({
  open,
  onOpenChangeAction,
  onConfirmAction,
  title = "Action",
  description,
  cancel = "Cancel",
  confirm = "Confirm",
  variant = "default",
  children,
}: ActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onConfirmAction();
      onOpenChangeAction(false);
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChangeAction(false)}
            disabled={isLoading}
          >
            {cancel}
          </Button>
          <Button
            onClick={() => handleConfirm()}
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
