import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Building2, MapPin, Pencil } from "lucide-react";
import useCustomerStore from "@/stores/useCustomerStore";
import useInvoiceStore from "@/stores/useInvoiceStore";
import CustomerDialog from "@/components/dialogs/CustomerDialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackLink } from "@/components/contacts/BackLink";
import { ContactTitle } from "@/components/contacts/ContactTitle";
import { DetailCard, DetailItem } from "@/components/contacts/DetailCard";
import { ContactDetailSkeleton } from "@/components/contacts/ContactDetailSkeleton";
import { ContactInvoicesCard } from "@/components/contacts/ContactInvoicesCard";
import { InlineError } from "@/components/ui/inline-error";

const CustomerDetailPage: React.FC = () => {
  const { detailCustomer: detailCustomer, fetchCustomer, setDraft, setDetail, updateCustomerDialog } = useCustomerStore();
  // only invoices already loaded client-side; no extra API call
  const allInvoices = useInvoiceStore((state) => state.invoices);
  const { id } = useParams<{ id: string }>();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!id) return

    if (!detailCustomer.id) {
      fetchCustomer(Number(id)).catch(() => setLoadError(true))
    }
  }, [id, detailCustomer.id, fetchCustomer])

  const isLoading = !detailCustomer.id && !loadError

  const handleEdit = () => {
    setDraft({ ...detailCustomer })
    updateCustomerDialog(true)
  }

  const invoices = allInvoices.filter((invoice) =>
    detailCustomer.id !== null && (invoice.customerId === detailCustomer.id || invoice.customer?.id === detailCustomer.id))

  const description = [detailCustomer.vatId && `IČO ${detailCustomer.vatId}`, detailCustomer.city]
    .filter(Boolean).join(" · ")

  return (
    <>
      <PageHeader
        eyebrow={<BackLink to="/customers" label="Customers" />}
        title={<ContactTitle name={detailCustomer.name} loading={isLoading} />}
        description={!isLoading && description ? description : undefined}
        actions={
          <Button variant="outline" onClick={handleEdit} disabled={!detailCustomer.id}>
            <Pencil />
            Edit
          </Button>
        }
      />
      <CustomerDialog onSaved={(customer) => setDetail({ ...customer })} />

      {loadError ? (
        <InlineError>Couldn’t load this customer. It may have been deleted.</InlineError>
      ) : isLoading ? (
        <ContactDetailSkeleton />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailCard title="Company" icon={Building2}>
              <DetailItem label="Name" value={detailCustomer.name} full />
              <DetailItem label="IČO" value={detailCustomer.vatId} mono />
              <DetailItem label="DIČ" value={detailCustomer.dicId} mono />
              <DetailItem
                label="Email"
                full
                value={detailCustomer.email && (
                  <a href={`mailto:${detailCustomer.email}`} className="text-primary underline-offset-4 hover:underline">
                    {detailCustomer.email}
                  </a>
                )}
              />
            </DetailCard>
            <DetailCard title="Address" icon={MapPin}>
              <DetailItem label="Street" value={detailCustomer.street} full />
              <DetailItem label="City" value={detailCustomer.city} />
              <DetailItem label="Postal code" value={detailCustomer.postalCode} />
              <DetailItem label="Country" value={detailCustomer.country} full />
            </DetailCard>
          </div>
          {allInvoices.length > 0 && <ContactInvoicesCard invoices={invoices} entityLabel="customer" />}
        </div>
      )}
    </>
  )
}

export default CustomerDetailPage;
