import { useNavigate } from "react-router-dom";
import useSupplierStore from "@/stores/useSupplierStore";
import { Supplier } from "@/types/supplier";
import { ContactRowActions } from "@/components/contacts/ContactRowActions";

interface TableActionsProps {
  supplier: Supplier
}


export const SupplierTableActions: React.FC<TableActionsProps> = ({ supplier }) => {
  const { fetchSuppliers, updateSupplierDialog, deleteApiSupplier, setDraft, setDetail } = useSupplierStore();
  const navigate = useNavigate();

  const openModal = () => {
    // workaround to dropdown do not interfere with modal
    window.setTimeout(() => updateSupplierDialog(true), 100);
  }

  const handleDeleteSupplier = async (supplier_id: number) => {
    if (!supplier_id) return;

    await deleteApiSupplier(supplier_id);
    await fetchSuppliers();
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setDraft({ ...supplier });
    openModal();
  };

  const handleViewSupplier = () => {
    setDetail(supplier)
    navigate(`/suppliers/${supplier.id}`)
  }

  return (
    <ContactRowActions
      entityLabel="supplier"
      name={supplier.name}
      onView={handleViewSupplier}
      onEdit={() => handleEditSupplier(supplier)}
      onDelete={() => handleDeleteSupplier(supplier.id as number)}
    />
  )
}
