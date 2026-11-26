import React from "react";
import { Customer } from "@/types/customer";
import { useNavigate } from "react-router-dom";
import useCustomerStore from "@/stores/useCustomerStore";
import { ContactNameCell } from "@/components/contacts/ContactNameCell";


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
    <ContactNameCell
      name={customer.name}
      secondary={customer.email}
      onOpen={handleClickDetail}
    />
  );
};

export default CustomerDetailLink;
