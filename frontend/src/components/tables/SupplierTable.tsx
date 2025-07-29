"use client";

import useSupplierStore from "@/stores/useSupplierStore";
import { useEffect } from "react";
import { DataTable } from "@/components/tables/dataTable";
import { columns } from "@/components/tables/suppliers/columns";



export default function SupplierTable() {
  const { suppliers, fetchSuppliers } = useSupplierStore();

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return (
    <div>
      <DataTable columns={columns} data={suppliers} />
    </div>
  );
}
