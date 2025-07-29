import React, { useEffect } from "react";
import CustomerTable from "@/components/tables/CustomerTable";
import CustomerDialog from "@/components/dialogs/CustomerDialog";
import useCustomerStore from "@/stores/useCustomerStore";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";

const CustomersPage: React.FC = () => {
  const { updateCustomerDialog, resetDraft } = useCustomerStore();

  const handleCreateCustomer = () => {
    resetDraft()
    updateCustomerDialog(true)
  }
  const { setHeaderContent } = useLayout();

  useEffect(() => {
    setHeaderContent(<Button onClick={handleCreateCustomer}>Create Customer</Button>)
    return () => setHeaderContent(null)
  }, [])

  return (
    <div className="mt-6">
      <CustomerDialog />
      <CustomerTable />
    </div>
  );
}

export default CustomersPage;
