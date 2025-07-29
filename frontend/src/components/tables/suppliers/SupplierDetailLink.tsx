import React from "react";
import { Supplier } from "@/types/supplier";
import { useNavigate } from "react-router-dom";
import useSupplierStore from "@/stores/useSupplierStore";


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
    <div
      className="cursor-pointer hover:text-blue-500"
      onClick={() => handleClickDetail()}
    >
      {supplier.name}
    </div>
  );
};

export default SupplierDetailLink;
