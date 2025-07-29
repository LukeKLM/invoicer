import { Customer } from "@/types/customer";
import { Supplier } from "@/types/supplier";

export enum InvoicePaymentType {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export enum InvoiceStateType {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}


export interface InvoiceItem {
  id: number | null;
  invoiceId: number | null;
  price: string;
  title: string;
  quantity: number;
}

export interface Invoice {
  id: number | null;
  dueDate: string;
  exposeDate: string;
  invoiceNumber: string;
  orderNumber?: string;
  paymentType: InvoicePaymentType;
  state: InvoiceStateType;
  variableSymbol: string;
  items: InvoiceItem[];
  customer: Customer | null;
  supplier: Supplier | null;
  totalPrice: string;
  customerId: number | undefined;
  supplierId: number | undefined;
}
