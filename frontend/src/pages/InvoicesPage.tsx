import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import InvoicesTable from "@/components/tables/InvoicesTable";
import InvoiceDialog from "@/components/dialogs/InvoiceDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import useInvoiceStore from "@/stores/useInvoiceStore";

const InvoicesPage: React.FC = () => {
  const { updateInvoiceDialog, resetDraft } = useInvoiceStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const handleCreateInvoice = () => {
    resetDraft()
    updateInvoiceDialog(true)
  }

  // "/invoices?new=1" (e.g. from the dashboard) opens the create dialog straight away
  useEffect(() => {
    if (searchParams.get("new") !== "1") return
    resetDraft()
    updateInvoiceDialog(true)
    setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams, resetDraft, updateInvoiceDialog])

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Create, track and download the invoices you've issued."
        actions={
          <Button onClick={handleCreateInvoice}>
            <Plus />
            New invoice
          </Button>
        }
      />
      <InvoiceDialog />
      <InvoicesTable onCreate={handleCreateInvoice} />
    </>
  );
}

export default InvoicesPage;
