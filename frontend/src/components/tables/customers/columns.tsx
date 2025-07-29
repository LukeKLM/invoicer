"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import { CustomerTableActions } from "@/components/tables/customers/CustomerTableActions";
import CustomerDetailLink from "@/components/tables/customers/CustomerDetailLink";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <CustomerDetailLink customer={row.original as Customer} />;
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "vatId",
    header: "VAT ID",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "street",
    header: "Street",
  },
  {
    accessorKey: "postalCode",
    header: "Postal Code",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer: Customer = row.original;

      return <CustomerTableActions customer={customer} />;
    },
  },
];
