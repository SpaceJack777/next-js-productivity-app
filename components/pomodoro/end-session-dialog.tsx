"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { type SessionType } from "@/hooks/use-session-state";

interface EndSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  elapsedMinutes: number;
  sessionType: SessionType;
}

export function EndSessionDialog({
  open,
  onOpenChange,
  onConfirm,
  elapsedMinutes,
  sessionType,
}: EndSessionDialogProps) {
  const isFocus = sessionType === "focus";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isFocus ? "End Focus Session Early?" : "Skip Break?"}
          </DialogTitle>
          <DialogDescription>
            {isFocus ? (
              <>
                You&apos;ve focused for {elapsedMinutes} minute
                {elapsedMinutes !== 1 ? "s" : ""}.
                {elapsedMinutes >= 5 ? (
                  <> This session will be saved to your records.</>
                ) : (
                  <> Sessions under 5 minutes won&apos;t be saved.</>
                )}
              </>
            ) : (
              <>
                You&apos;ve rested for {elapsedMinutes} minute
                {elapsedMinutes !== 1 ? "s" : ""}. Ready to continue working?
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {isFocus ? "Continue Session" : "Continue Break"}
            </Button>
          </DialogClose>
          <Button onClick={onConfirm}>
            {isFocus ? "End Session" : "Skip Break"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
