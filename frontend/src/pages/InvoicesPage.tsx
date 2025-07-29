import React, { useEffect } from "react";
import InvoicesTable from "@/components/tables/InvoicesTable";
import InvoiceDialog from "@/components/dialogs/InvoiceDialog";
import { useLayout } from "@/contexts/LayoutContext";
import { Button } from "@/components/ui/button";
import useInvoiceStore from "@/stores/useInvoiceStore";

const InvoicesPage: React.FC = () => {
  const { updateInvoiceDialog, resetDraft } = useInvoiceStore();

  const handleCreateInvoice = () => {
    resetDraft()
    updateInvoiceDialog(true)
  }
  const { setHeaderContent } = useLayout();
  useEffect(() => {
    setHeaderContent(<Button onClick={handleCreateInvoice}>Create Invoice</Button>)
    return () => setHeaderContent(null)
  }, [])

  return (
    <div className="mt-6">
      <InvoiceDialog />
      <InvoicesTable />
    </div>
  );
}

export default InvoicesPage;
