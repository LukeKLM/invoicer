import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useInvoiceStore from "@/stores/useInvoiceStore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const InvoiceDetailPage: React.FC = () => {
  const { detailInvoice: detailInvoice, fetchInvoice } = useInvoiceStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return

    if (!detailInvoice.id) {
      fetchInvoice(Number(id))
    }
  }, [id, detailInvoice.id, fetchInvoice])

  return (
    <div className="space-y-6 mt-6">
      {/* Invoice Header */}
      <Card>
        <CardHeader>
          <CardTitle>
            Invoice <span className="font-mono">{detailInvoice.invoiceNumber}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Due Date: {detailInvoice.dueDate}</p>
            <p className="text-gray-600">Expose Date: {detailInvoice.exposeDate}</p>
            <p className="text-gray-600">Variable Symbol: {detailInvoice.variableSymbol}</p>
          </div>
          <Badge variant="outline">{detailInvoice.state}</Badge>
        </CardContent>
      </Card>

      {/* Customer & Supplier Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{detailInvoice.customer?.name}</p>
            <p className="text-gray-600">{detailInvoice.customer?.email}</p>
            <p>{detailInvoice.customer?.street}, {detailInvoice.customer?.city}, {detailInvoice.customer?.postalCode}</p>
            <p>{detailInvoice.customer?.country}</p>
            <p className="text-sm text-gray-500">VAT ID: {detailInvoice.customer?.vatId}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{detailInvoice.supplier?.name}</p>
            <p className="text-gray-600">{detailInvoice.supplier?.email}</p>
            <p>{detailInvoice.supplier?.street}, {detailInvoice.supplier?.city}, {detailInvoice.supplier?.postalCode}</p>
            <p>{detailInvoice.supplier?.country}</p>
            <p className="text-sm text-gray-500">VAT ID: {detailInvoice.supplier?.vatId}</p>
            <p className="text-sm text-gray-500">IBAN: {detailInvoice.supplier?.iban}</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailInvoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price} CZK</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="text-right font-semibold">Total Price</TableCell>
                <TableCell>{detailInvoice.totalPrice} CZK</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default InvoiceDetailPage;
