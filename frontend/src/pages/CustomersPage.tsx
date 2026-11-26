import React from "react";
import { Plus } from "lucide-react";
import CustomerTable from "@/components/tables/CustomerTable";
import CustomerDialog from "@/components/dialogs/CustomerDialog";
import useCustomerStore from "@/stores/useCustomerStore";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

const CustomersPage: React.FC = () => {
  const { updateCustomerDialog, resetDraft } = useCustomerStore();

  const handleCreateCustomer = () => {
    resetDraft()
    updateCustomerDialog(true)
  }

  return (
    <>
      <PageHeader
        title="Customers"
        description="Companies you invoice. Add one by IČO to fill in its details from ARES."
        actions={
          <Button onClick={handleCreateCustomer}>
            <Plus />
            New customer
          </Button>
        }
      />
      <CustomerDialog />
      <CustomerTable onCreate={handleCreateCustomer} />
    </>
  );
}

export default CustomersPage;
