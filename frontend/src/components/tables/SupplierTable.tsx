import { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";
import useSupplierStore from "@/stores/useSupplierStore";
import { DataTable } from "@/components/tables/dataTable";
import { columns } from "@/components/tables/suppliers/columns";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { InlineError } from "@/components/ui/inline-error";

interface SupplierTableProps {
  onCreate?: () => void
}

export default function SupplierTable({ onCreate }: SupplierTableProps) {
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchSuppliers()
      .then(() => { if (active) setError(false) })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) });
    return () => { active = false };
  }, [fetchSuppliers]);

  return (
    <div className="space-y-4">
      {error && <InlineError>Couldn’t load suppliers. Please refresh the page to try again.</InlineError>}
      <DataTable
        columns={columns}
        data={suppliers}
        loading={loading}
        searchPlaceholder="Search suppliers…"
        emptyState={error ? undefined : (
          <EmptyState
            icon={Building2}
            title="No suppliers yet"
            description="Add the companies you issue invoices as, including their bank details for payments."
            action={onCreate && (
              <Button onClick={onCreate}>
                <Plus />
                New supplier
              </Button>
            )}
          />
        )}
      />
    </div>
  );
}
