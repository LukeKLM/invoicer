import React from "react";
import { Plus } from "lucide-react";
import SupplierTable from "@/components/tables/SupplierTable";
import SupplierDialog from "@/components/dialogs/SupplierDialog";
import useSupplierStore from "@/stores/useSupplierStore";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

const SuppliersPage: React.FC = () => {
  const { updateSupplierDialog, resetDraft } = useSupplierStore();

  const handleCreateSupplier = () => {
    resetDraft()
    updateSupplierDialog(true)
  }

  return (
    <>
      <PageHeader
        title="Suppliers"
        description="The companies you issue invoices as, with the bank details printed on each invoice."
        actions={
          <Button onClick={handleCreateSupplier}>
            <Plus />
            New supplier
          </Button>
        }
      />
      <SupplierDialog />
      <SupplierTable onCreate={handleCreateSupplier} />
    </>
  );
}

export default SuppliersPage;
