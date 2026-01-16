"use client";

import { ReactNode } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./animate-ui/components/radix/dialog";

type ActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  title?: string;
  cancel?: string;
  save?: string;
  children: ReactNode;
};

export function ActionDialog({
  open,
  onOpenChange,
  onSave,
  title = "Action",
  cancel = "Cancel",
  save = "Save",
  children,
}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onEnter={onSave}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancel}
          </Button>
          <Button onClick={onSave}>{save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
