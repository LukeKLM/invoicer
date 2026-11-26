"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@/types/supplier";
import { SupplierTableActions } from "@/components/tables/suppliers/SupplierTableActions";
import SupplierDetailLink from "@/components/tables/suppliers/SupplierDetailLink";
import { AddressCell, EmptyValue, MonoCell } from "@/components/contacts/ContactCells";
import { Sensitive } from "@/components/ui/sensitive";

export const columns: ColumnDef<Supplier>[] = [
  {
    id: "name",
    // name first so sorting follows the name; email included so search matches it
    accessorFn: (row) => `${row.name ?? ""} ${row.email ?? ""}`,
    header: "Name",
    cell: ({ row }) => {
      return <SupplierDetailLink supplier={row.original as Supplier} />;
    },
  },
  {
    accessorKey: "vatId",
    header: "IČO",
    cell: ({ row }) => <MonoCell value={row.original.vatId} />,
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
    id: "bank",
    accessorFn: (row) => [row.bankAccount && `${row.bankAccount}/${row.bankCode}`, row.iban].filter(Boolean).join(" "),
    header: "Bank account",
    cell: ({ row }) => {
      const { bankAccount, bankCode, iban } = row.original
      if (!bankAccount && !iban) return <EmptyValue />
      return (
        <div className="whitespace-nowrap font-mono text-xs">
          {bankAccount && <p className="text-foreground"><Sensitive>{bankAccount}</Sensitive>{bankCode && `/${bankCode}`}</p>}
          {iban && <p className="text-muted-foreground"><Sensitive>{iban}</Sensitive></p>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier: Supplier = row.original;

      return <SupplierTableActions supplier={supplier} />;
    },
  },
];
