"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import { CustomerTableActions } from "@/components/tables/customers/CustomerTableActions";
import CustomerDetailLink from "@/components/tables/customers/CustomerDetailLink";
import { AddressCell, MonoCell } from "@/components/contacts/ContactCells";

export const columns: ColumnDef<Customer>[] = [
  {
    id: "name",
    // name first so sorting follows the name; email included so search matches it
    accessorFn: (row) => `${row.name ?? ""} ${row.email ?? ""}`,
    header: "Name",
    cell: ({ row }) => {
      return <CustomerDetailLink customer={row.original as Customer} />;
    }
  },
  {
    accessorKey: "vatId",
    header: "IČO",
    cell: ({ row }) => <MonoCell value={row.original.vatId} />,
  },
  {
    accessorKey: "dicId",
    header: "DIČ",
    cell: ({ row }) => <MonoCell value={row.original.dicId} />,
  },
  {
    id: "address",
    accessorFn: (row) => [row.street, row.postalCode, row.city, row.country].filter(Boolean).join(" "),
    header: "Address",
    cell: ({ row }) => (
      <AddressCell
        street={row.original.street}
        postalCode={row.original.postalCode}
        city={row.original.city}
        country={row.original.country}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer: Customer = row.original;

      return <CustomerTableActions customer={customer} />;
    },
  },
];
