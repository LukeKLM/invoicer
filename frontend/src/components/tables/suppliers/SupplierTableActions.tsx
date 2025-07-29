
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSupplierStore from "@/stores/useSupplierStore";
import { Supplier } from "@/types/supplier";

interface TableActionsProps {
  supplier: Supplier
}


export const SupplierTableActions: React.FC<TableActionsProps> = ({ supplier }) => {
  const { fetchSuppliers, updateSupplierDialog, deleteApiSupplier, setDraft } = useSupplierStore();

  const openModal = () => {
    // workaround to dropdown do not interfere with modal
    setTimeout(() => updateSupplierDialog(true), 100);
  }

  const handleDeleteSupplier = async (supplier_id: number) => {
    if (!supplier_id) return;

    await deleteApiSupplier(supplier_id);
    await fetchSuppliers();
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setDraft({ ...supplier });
    openModal();
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleEditSupplier(supplier)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDeleteSupplier(supplier.id as number)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
