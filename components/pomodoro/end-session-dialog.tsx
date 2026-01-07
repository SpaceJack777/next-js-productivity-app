'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/radix/dialog';
import { Button } from '@/components/ui/button';

interface EndSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  elapsedMinutes: number;
}

export function EndSessionDialog({
  open,
  onOpenChange,
  onConfirm,
  elapsedMinutes,
}: EndSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>End Session Early?</DialogTitle>
          <DialogDescription>
            You&apos;ve focused for {elapsedMinutes} minute
            {elapsedMinutes !== 1 ? 's' : ''}.
            {elapsedMinutes >= 5 ? (
              <> This session will be saved to your records.</>
            ) : (
              <> Sessions under 5 minutes won&apos;t be saved.</>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Continue Session</Button>
          </DialogClose>
          <Button onClick={onConfirm}>End Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
