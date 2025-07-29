import React from "react";
import { Customer } from "@/types/customer";
import { useNavigate } from "react-router-dom";
import useCustomerStore from "@/stores/useCustomerStore";


interface CustomerDetailLinkProps {
  customer: Customer;
}

const CustomerDetailLink: React.FC<CustomerDetailLinkProps> = ({ customer }) => {

  const { setDetail } = useCustomerStore();
  const navigate = useNavigate();

  const handleClickDetail = () => {
    setDetail(customer)
    navigate(`/customers/${customer.id}`)
  }

  return (
    <div
      className="cursor-pointer hover:text-blue-500"
      onClick={() => handleClickDetail()}
    >
      {customer.name}
    </div>
  );
};

export default CustomerDetailLink;
