import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useSupplierStore from "@/stores/useSupplierStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SupplierDetailPage: React.FC = () => {
  const { detailSupplier: detailSupplier, fetchSupplier } = useSupplierStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return

    if (!detailSupplier.id) {
      fetchSupplier(Number(id))
    }
  }, [id, detailSupplier.id, fetchSupplier])

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{detailSupplier.name}</p>
            <p className="text-gray-600">{detailSupplier.email}</p>
            <p>{detailSupplier.street}, {detailSupplier.city}, {detailSupplier.postalCode}</p>
            <p>{detailSupplier.country}</p>
            <p className="text-sm text-gray-500">VAT ID: {detailSupplier.vatId}</p>
            <p className="text-sm text-gray-500">Bank Account: {detailSupplier.bankAccount}</p>
            <p className="text-sm text-gray-500">Bank Code: {detailSupplier.bankCode}</p>
            <p className="text-sm text-gray-500">IBAN: {detailSupplier.iban}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SupplierDetailPage;
