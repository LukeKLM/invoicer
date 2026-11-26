import React from "react";
import { Link } from "react-router-dom";
import { Invoice } from "@/types/invoice";
import useInvoiceStore from "@/stores/useInvoiceStore";


interface InvoiceDetailLinkProps {
  invoice: Invoice;
}

const InvoiceDetailLink: React.FC<InvoiceDetailLinkProps> = ({ invoice }) => {

  const { setDetail } = useInvoiceStore();

  return (
    <Link
      to={`/invoices/${invoice.id}`}
      onClick={() => setDetail(invoice)}
      className="rounded font-mono text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {invoice.invoiceNumber}
    </Link>
  );
};

export default InvoiceDetailLink;
