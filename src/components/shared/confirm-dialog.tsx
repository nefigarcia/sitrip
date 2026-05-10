"use client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  details?: string[];
}

export function ConfirmDialog({
  open, onOpenChange, title, description,
  confirmLabel = "Confirmar", cancelLabel = "Cancelar",
  variant = "destructive", loading, onConfirm, details,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className={cn(
            "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full",
            variant === "destructive" ? "bg-red-100" : "bg-amber-100"
          )}>
            <AlertTriangle className={cn(
              "h-6 w-6",
              variant === "destructive" ? "text-red-600" : "text-amber-600"
            )} />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        {details && details.length > 0 && (
          <div className={cn(
            "rounded-lg border p-3 space-y-1",
            variant === "destructive" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
          )}>
            {details.map((d, i) => (
              <p key={i} className={cn(
                "text-xs flex items-start gap-2",
                variant === "destructive" ? "text-red-700" : "text-amber-700"
              )}>
                <span className="mt-0.5 shrink-0">•</span>{d}
              </p>
            ))}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            loading={loading}
            className={variant === "warning" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {variant === "destructive" && <Trash2 className="h-4 w-4" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
