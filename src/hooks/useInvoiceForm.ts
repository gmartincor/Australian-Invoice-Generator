import { useState } from 'react';
import { BusinessDetails, Client, InvoiceItem, Invoice } from '../types';
import { generateInvoiceNumber, calculateInvoiceTotals } from '../utils/calculations';

export const useInvoiceForm = () => {
  const [business, setBusiness] = useState<BusinessDetails>({
    name: '',
    abn: '',
    address: {
      street: '',
      city: '',
      state: 'NSW',
      postcode: '',
      country: 'Australia'
    },
    phone: '',
    email: '',
    isGstRegistered: false,
    bankAccount: {
      accountName: '',
      bsb: '',
      accountNumber: ''
    }
  });

  const [client, setClient] = useState<Client>({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    email: '',
    phone: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([{
    id: '1',
    description: '',
    quantity: 1,
    unitPrice: 0,
    gstIncluded: false,
    isGstFree: false
  }]);

  const [invoiceDetails, setInvoiceDetails] = useState({
    number: generateInvoiceNumber(),
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  });

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      gstIncluded: false,
      isGstFree: false
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const generateInvoice = (): Invoice => {
    const calculations = calculateInvoiceTotals(items, business);
    
    return {
      number: invoiceDetails.number,
      date: invoiceDetails.date,
      dueDate: invoiceDetails.dueDate,
      business,
      client,
      items,
      calculations,
      notes: invoiceDetails.notes,
      isTaxInvoice: business.isGstRegistered && calculations.gstAmount > 0
    };
  };

  const resetForm = () => {
    setItems([{
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      gstIncluded: false,
      isGstFree: false
    }]);
    setInvoiceDetails({
      number: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      notes: ''
    });
  };

  return {
    business,
    setBusiness,
    client,
    setClient,
    items,
    addItem,
    removeItem,
    updateItem,
    invoiceDetails,
    setInvoiceDetails,
    generateInvoice,
    resetForm
  };
};
