export interface BusinessDetails {
  name: string;
  abn: string;
  address: Address;
  phone: string;
  email: string;
  isGstRegistered: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface Client {
  name: string;
  address: Address;
  email?: string;
  phone?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  gstIncluded: boolean;
  isGstFree: boolean; // Para servicios exentos de GST
}

export interface InvoiceCalculations {
  subtotal: number;
  gstAmount: number;
  total: number;
}

export interface Invoice {
  number: string;
  date: string;
  dueDate: string;
  business: BusinessDetails;
  client: Client;
  items: InvoiceItem[];
  calculations: InvoiceCalculations;
  notes?: string;
  isTaxInvoice: boolean; // True si hay GST, determina el título del documento
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
