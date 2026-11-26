import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import useCustomerStore from "@/stores/useCustomerStore";
import { DataTable } from "@/components/tables/dataTable";
import { columns } from "@/components/tables/customers/columns";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { InlineError } from "@/components/ui/inline-error";

interface CustomerTableProps {
  onCreate?: () => void
}

export default function CustomerTable({ onCreate }: CustomerTableProps) {
  const { customers, fetchCustomers } = useCustomerStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchCustomers()
      .then(() => { if (active) setError(false) })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) });
    return () => { active = false };
  }, [fetchCustomers]);

  return (
    <div className="space-y-4">
      {error && <InlineError>Couldn’t load customers. Please refresh the page to try again.</InlineError>}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        searchPlaceholder="Search customers…"
        emptyState={error ? undefined : (
          <EmptyState
            icon={Users}
            title="No customers yet"
            description="Add the companies you invoice. Enter an IČO and we’ll fill in the details from ARES."
            action={onCreate && (
              <Button onClick={onCreate}>
                <Plus />
                New customer
              </Button>
            )}
          />
        )}
      />
    </div>
  );
}
