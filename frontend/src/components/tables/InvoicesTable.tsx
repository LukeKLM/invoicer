import { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";

import useInvoiceStore from "@/stores/useInvoiceStore";
import { DataTable } from "@/components/tables/dataTable";
import { columns } from "@/components/tables/invoices/columns";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { InvoiceStats } from "@/components/invoices/InvoiceStats";
import { InlineError } from "@/components/ui/inline-error";

interface InvoicesTableProps {
  onCreate?: () => void;
}

export default function InvoicesTable({ onCreate }: InvoicesTableProps) {
  const { invoices, fetchInvoices } = useInvoiceStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchInvoices()
      .catch((e: Error) => setError(`Loading invoices failed: ${e.message}`))
      .finally(() => setLoading(false));
  }, [fetchInvoices]);

  return (
    <div className="space-y-6">
      <InvoiceStats invoices={invoices} loading={loading && invoices.length === 0} />
      {error && (
        <InlineError>{error}</InlineError>
      )}
      <DataTable
        columns={columns}
        data={invoices}
        loading={loading}
        searchPlaceholder="Search invoices…"
        emptyState={error ? undefined : (
          <EmptyState
            icon={FileText}
            title="No invoices yet"
            description="Create your first invoice to bill a customer. It will show up here with its status and total."
            action={onCreate && (
              <Button onClick={onCreate}>
                <Plus />
                New invoice
              </Button>
            )}
          />
        )}
      />
    </div>
  );
}
