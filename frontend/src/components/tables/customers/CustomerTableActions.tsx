import { useNavigate } from "react-router-dom";
import useCustomerStore from "@/stores/useCustomerStore";
import { Customer } from "@/types/customer";
import { ContactRowActions } from "@/components/contacts/ContactRowActions";

interface TableActionsProps {
  customer: Customer
}


export const CustomerTableActions: React.FC<TableActionsProps> = ({ customer }) => {
  const { fetchCustomers, updateCustomerDialog, deleteApiCustomer, setDraft, setDetail } = useCustomerStore();
  const navigate = useNavigate();

  const openModal = () => {
    // workaround to dropdown do not interfere with modal
    window.setTimeout(() => updateCustomerDialog(true), 100);
  }

  const handleDeleteCustomer = async (customer_id: number) => {
    if (!customer_id) return;

    await deleteApiCustomer(customer_id);
    await fetchCustomers();
  };

  const handleEditCustomer = (customer: Customer) => {
    setDraft({ ...customer });
    openModal();
  };

  const handleViewCustomer = () => {
    setDetail(customer)
    navigate(`/customers/${customer.id}`)
  }

  return (
    <ContactRowActions
      entityLabel="customer"
      name={customer.name}
      onView={handleViewCustomer}
      onEdit={() => handleEditCustomer(customer)}
      onDelete={() => handleDeleteCustomer(customer.id as number)}
    />
  )
}
