"use client";

import useCustomerStore from "@/stores/useCustomerStore";
import { useEffect } from "react";
import { DataTable } from "@/components/tables/dataTable";
import { columns } from "@/components/tables/customers/columns";



export default function CustomerTable() {
  const { customers, fetchCustomers } = useCustomerStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div>
      <DataTable columns={columns} data={customers} />
    </div>
  );
}
