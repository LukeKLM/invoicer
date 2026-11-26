import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Building2, Landmark, MapPin, Pencil } from "lucide-react";
import useSupplierStore from "@/stores/useSupplierStore";
import useInvoiceStore from "@/stores/useInvoiceStore";
import SupplierDialog from "@/components/dialogs/SupplierDialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackLink } from "@/components/contacts/BackLink";
import { ContactTitle } from "@/components/contacts/ContactTitle";
import { DetailCard, DetailItem } from "@/components/contacts/DetailCard";
import { ContactDetailSkeleton } from "@/components/contacts/ContactDetailSkeleton";
import { ContactInvoicesCard } from "@/components/contacts/ContactInvoicesCard";
import { InlineError } from "@/components/ui/inline-error";

const SupplierDetailPage: React.FC = () => {
  const { detailSupplier: detailSupplier, fetchSupplier, setDraft, setDetail, updateSupplierDialog } = useSupplierStore();
  // only invoices already loaded client-side; no extra API call
  const allInvoices = useInvoiceStore((state) => state.invoices);
  const { id } = useParams<{ id: string }>();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!id) return

    if (!detailSupplier.id) {
      fetchSupplier(Number(id)).catch(() => setLoadError(true))
    }
  }, [id, detailSupplier.id, fetchSupplier])

  const isLoading = !detailSupplier.id && !loadError

  const handleEdit = () => {
    setDraft({ ...detailSupplier })
    updateSupplierDialog(true)
  }

  const invoices = allInvoices.filter((invoice) =>
    detailSupplier.id !== null && (invoice.supplierId === detailSupplier.id || invoice.supplier?.id === detailSupplier.id))

  const description = [detailSupplier.vatId && `IČO ${detailSupplier.vatId}`, detailSupplier.city]
    .filter(Boolean).join(" · ")

  const accountNumber = detailSupplier.bankAccount
    ? `${detailSupplier.bankAccount}${detailSupplier.bankCode ? `/${detailSupplier.bankCode}` : ""}`
    : ""

  return (
    <>
      <PageHeader
        eyebrow={<BackLink to="/suppliers" label="Suppliers" />}
        title={<ContactTitle name={detailSupplier.name} loading={isLoading} />}
        description={!isLoading && description ? description : undefined}
        actions={
          <Button variant="outline" onClick={handleEdit} disabled={!detailSupplier.id}>
            <Pencil />
            Edit
          </Button>
        }
      />
      <SupplierDialog onSaved={(supplier) => setDetail({ ...supplier })} />

      {loadError ? (
        <InlineError>Couldn’t load this supplier. It may have been deleted.</InlineError>
      ) : isLoading ? (
        <ContactDetailSkeleton />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailCard title="Company" icon={Building2}>
              <DetailItem label="Name" value={detailSupplier.name} full />
              <DetailItem label="IČO" value={detailSupplier.vatId} mono />
              <DetailItem
                label="Email"
                value={detailSupplier.email && (
                  <a href={`mailto:${detailSupplier.email}`} className="text-primary underline-offset-4 hover:underline">
                    {detailSupplier.email}
                  </a>
                )}
              />
            </DetailCard>
            <DetailCard title="Address" icon={MapPin}>
              <DetailItem label="Street" value={detailSupplier.street} full />
              <DetailItem label="City" value={detailSupplier.city} />
              <DetailItem label="Postal code" value={detailSupplier.postalCode} />
              <DetailItem label="Country" value={detailSupplier.country} full />
            </DetailCard>
            <DetailCard title="Bank details" icon={Landmark} className="md:col-span-2">
              <DetailItem label="Account number" value={accountNumber} mono sensitive />
              <DetailItem label="Bank code" value={detailSupplier.bankCode} mono />
              <DetailItem label="IBAN" value={detailSupplier.iban} mono full sensitive />
            </DetailCard>
          </div>
          {allInvoices.length > 0 && <ContactInvoicesCard invoices={invoices} entityLabel="supplier" />}
        </div>
      )}
    </>
  )
}

export default SupplierDetailPage;
