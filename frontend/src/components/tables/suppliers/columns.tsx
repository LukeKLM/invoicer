"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@/types/supplier";
import { SupplierTableActions } from "@/components/tables/suppliers/SupplierTableActions";
import SupplierDetailLink from "@/components/tables/suppliers/SupplierDetailLink";

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <SupplierDetailLink supplier={row.original as Supplier} />;
    },
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
    accessorKey: "bankAccount",
    header: "Bank Account",
  },
  {
    accessorKey: "bankCode",
    header: "Bank Code",
  },
  {
    accessorKey: "iban",
    header: "IBAN",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier: Supplier = row.original;

      return <SupplierTableActions supplier={supplier} />;
    },
  },
];
