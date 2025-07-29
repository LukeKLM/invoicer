
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
import useCustomerStore from "@/stores/useCustomerStore";
import { Customer } from "@/types/customer";

interface TableActionsProps {
  customer: Customer
}


export const CustomerTableActions: React.FC<TableActionsProps> = ({ customer }) => {
  const { fetchCustomers, updateCustomerDialog, deleteApiCustomer, setDraft } = useCustomerStore();

  const openModal = () => {
    // workaround to dropdown do not interfere with modal
    setTimeout(() => updateCustomerDialog(true), 100);
  }

  const handleDeleteCustomer = async (customer_id: number) => {
    if (!customer_id) return;

    await deleteApiCustomer(customer_id);
    await fetchCustomers();
  };

  const handleEditCustomer = (customer: Customer) => {
    setDraft({ ...customer });
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
          onClick={() => handleEditCustomer(customer)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDeleteCustomer(customer.id as number)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
