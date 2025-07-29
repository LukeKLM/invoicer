import React, { useEffect } from "react";
import SupplierTable from "@/components/tables/SupplierTable";
import SupplierDialog from "@/components/dialogs/SupplierDialog";
import useSupplierStore from "@/stores/useSupplierStore";
import { Button } from "@/components/ui/button";
import { useLayout } from "@/contexts/LayoutContext";

const SuppliersPage: React.FC = () => {
  const { updateSupplierDialog, resetDraft } = useSupplierStore();

  const handleCreateSupplier = () => {
    resetDraft()
    updateSupplierDialog(true)
  }
  const { setHeaderContent } = useLayout();

  useEffect(() => {
    setHeaderContent(<Button onClick={handleCreateSupplier}>Create Supplier</Button>)
    return () => setHeaderContent(null)
  }, [])

  return (
    <div className="mt-6">
      <SupplierDialog />
      <SupplierTable />
    </div>
  );
}

export default SuppliersPage;
