import { ReactNode } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InlineError } from "@/components/ui/inline-error"

interface ContactFormDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description: ReactNode
  submitLabel: string
  pending: boolean
  error: string | null
  onSubmit: () => void
  children: ReactNode
}

/** Shared create/edit dialog shell for customers and suppliers */
export function ContactFormDialog({
  open,
  onClose,
  title,
  description,
  submitLabel,
  pending,
  error,
  onSubmit,
  children,
}: ContactFormDialogProps) {
  const handleOpenChange = () => {
    if (pending) return
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <DialogHeader className="px-6 pb-4 pr-12 pt-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (!pending) onSubmit()
          }}
        >
          <div className="space-y-6 px-6 pb-6">
            {children}
            {error && <InlineError>{error}</InlineError>}
          </div>
          <div className="sticky bottom-0 flex flex-col-reverse gap-2 rounded-b-2xl border-t bg-card px-6 py-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleOpenChange} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
