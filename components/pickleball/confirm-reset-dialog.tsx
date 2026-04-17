import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface ConfirmResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmResetDialog({ open, onOpenChange, onConfirm }: ConfirmResetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        style={{
          background: 'var(--kc-surface-mid)',
          border: '1px solid var(--kc-outline)',
          borderRadius: '32px',
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-lexend font-bold text-xl uppercase tracking-widest"
            style={{ color: 'var(--kc-error)' }}
          >
            Reset Match?
          </DialogTitle>
          <DialogDescription
            className="text-sm mt-2 font-inter"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            All progress, scores, and track records for the current match will be permanently lost.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-8 gap-3 sm:justify-start">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 rounded-full font-inter font-semibold text-sm transition-all active:scale-95 cursor-pointer"
            style={{ background: 'var(--kc-surface-highest)', color: 'var(--kc-text)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="px-6 py-3 rounded-full font-lexend font-bold text-sm uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
            style={{ background: 'var(--kc-error)', color: 'var(--kc-bg)' }}
          >
            Reset Match
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
