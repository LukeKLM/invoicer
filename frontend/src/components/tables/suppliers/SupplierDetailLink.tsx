import React from "react";
import { Supplier } from "@/types/supplier";
import { useNavigate } from "react-router-dom";
import useSupplierStore from "@/stores/useSupplierStore";
import { ContactNameCell } from "@/components/contacts/ContactNameCell";


interface SupplierDetailLinkProps {
  supplier: Supplier;
}

const SupplierDetailLink: React.FC<SupplierDetailLinkProps> = ({ supplier }) => {

  const { setDetail } = useSupplierStore();
  const navigate = useNavigate();

  const handleClickDetail = () => {
    setDetail(supplier)
    navigate(`/suppliers/${supplier.id}`)
  }

  return (
    <ContactNameCell
      name={supplier.name}
      secondary={supplier.email}
      onOpen={handleClickDetail}
    />
  );
};

export default SupplierDetailLink;
