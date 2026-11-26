// Money values are kept as strings - the API serializes Decimals as strings
export type SkipPaySettings = {
  id: number | null;
  customerId: number | null;
  dailyRate: string;
  kdBonus: string;
  repayment: string;
  specialBonus: string;
  learningBudget: string;
  multisportCard: string;
  developmentPercentage: number;
  maintenancePercentage: number;
}

export type PublicHoliday = {
  date: string;
  name: string;
}

export type WorkingDaysOverview = {
  year: number;
  month: number;
  weekdays: number;
  workingDays: number;
  publicHolidays: PublicHoliday[];
}

export type SkipPayCalculationInput = {
  holidays: number;
  vacationDays: string;
  year: number;
  month: number;
}

export type SkipPayCalculationResult = {
  year: number;
  month: number;

  dailyRate: string;
  kdBonus: string;
  specialBonus: string;
  repayment: string;
  multisportCard: string;
  learningBudget: string;
  developmentPercentage: number;
  maintenancePercentage: number;

  weekdays: number;
  publicHolidays: PublicHoliday[];
  holidays: number;
  workingDays: number;
  vacationDays: string;
  workedDays: string;

  netIncome: string;
  incomeWithKdBonus: string;
  incomeWithSpecialBonus: string;
  grossInvoiceAmount: string;
  incomeAfterMultisport: string;

  developmentShare: string;
  maintenanceShare: string;
  invoiceTotal: string;
  netPayout: string;
}

export type SkipPayInvoiceDraft = {
  customerId: number;
  supplierId: number | null;
  invoiceNumber: string;
  variableSymbol: string;
  orderNumber: string | null;
  exposeDate: string;
  dueDate: string;
  paymentType: string;
  state: string;
  items: { title: string, price: string, quantity: number }[];
  calculation: SkipPayCalculationResult;
}
