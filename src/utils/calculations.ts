import { InvoiceItem, InvoiceCalculations, BusinessDetails } from '../types';

const GST_RATE = 0.10;

export const shouldApplyGST = (business: BusinessDetails, item: InvoiceItem): boolean => {
  // No aplicar GST si el negocio no está registrado para GST
  if (!business.isGstRegistered) {
    return false;
  }
  
  // No aplicar GST si el item está marcado como GST-free
  if (item.isGstFree) {
    return false;
  }
  
  return true;
};

export const calculateItemTotal = (item: InvoiceItem, business: BusinessDetails): number => {
  const baseAmount = item.quantity * item.unitPrice;
  
  // Si no aplica GST, el total es simplemente el monto base
  if (!shouldApplyGST(business, item)) {
    return baseAmount;
  }
  
  return item.gstIncluded ? baseAmount : baseAmount * (1 + GST_RATE);
};

export const calculateItemGST = (item: InvoiceItem, business: BusinessDetails): number => {
  const baseAmount = item.quantity * item.unitPrice;
  
  // Si no aplica GST, el GST es 0
  if (!shouldApplyGST(business, item)) {
    return 0;
  }
  
  if (item.gstIncluded) {
    return baseAmount - (baseAmount / (1 + GST_RATE));
  }
  
  return baseAmount * GST_RATE;
};

export const calculateInvoiceTotals = (items: InvoiceItem[], business: BusinessDetails): InvoiceCalculations => {
  const totals = items.reduce(
    (acc, item) => {
      const itemTotal = calculateItemTotal(item, business);
      const itemGST = calculateItemGST(item, business);
      
      return {
        total: acc.total + itemTotal,
        gstAmount: acc.gstAmount + itemGST,
        subtotal: acc.subtotal + (itemTotal - itemGST)
      };
    },
    { total: 0, gstAmount: 0, subtotal: 0 }
  );

  return {
    subtotal: Math.round(totals.subtotal * 100) / 100,
    gstAmount: Math.round(totals.gstAmount * 100) / 100,
    total: Math.round(totals.total * 100) / 100
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  
  return `INV-${year}${month}-${timestamp}`;
};
