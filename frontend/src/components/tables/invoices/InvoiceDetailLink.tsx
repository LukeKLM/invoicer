import React from "react";
import { Invoice } from "@/types/invoice";
import { useNavigate } from "react-router-dom";
import useInvoiceStore from "@/stores/useInvoiceStore";


interface InvoiceDetailLinkProps {
  invoice: Invoice;
}

const InvoiceDetailLink: React.FC<InvoiceDetailLinkProps> = ({ invoice }) => {

  const { setDetail } = useInvoiceStore();
  const navigate = useNavigate();

  const handleClickDetail = () => {
    setDetail(invoice)
    navigate(`/invoices/${invoice.id}`)
  }

  return (
    <div
      className="cursor-pointer hover:text-blue-500"
      onClick={() => handleClickDetail()}
    >
      {invoice.invoiceNumber}
    </div>
  );
};

export default InvoiceDetailLink;
