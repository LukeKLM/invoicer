import { useState } from "react"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface ContactRowActionsProps {
  /** e.g. "customer" */
  entityLabel: string
  name: string
  onView?: () => void
  onEdit: () => void
  onDelete: () => Promise<void>
}

export function ContactRowActions({ entityLabel, name, onView, onEdit, onDelete }: ContactRowActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${name || entityLabel}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {onView && (
            <DropdownMenuItem onClick={onView}>
              <Eye className="text-muted-foreground" />
              View details
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="text-muted-foreground" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setConfirmOpen(true)}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${entityLabel}?`}
        description={<><span className="font-medium text-foreground">{name || `This ${entityLabel}`}</span> will be permanently removed. This action can’t be undone.</>}
        confirmLabel={`Delete ${entityLabel}`}
        onConfirm={onDelete}
        errorMessage={() => `Couldn’t delete this ${entityLabel}. It may still be used on an invoice.`}
      />
    </div>
  )
}
