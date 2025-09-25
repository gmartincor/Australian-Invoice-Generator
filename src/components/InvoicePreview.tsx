import React from 'react';
import { Invoice } from '../types';
import { formatCurrency } from '../utils/calculations';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  return (
    <div className="invoice-preview">
      <div className="invoice-header">
        <h1>{invoice.isTaxInvoice ? 'TAX INVOICE' : 'INVOICE'}</h1>
        <div className="invoice-meta">
          <div><strong>Invoice #:</strong> {invoice.number}</div>
          <div><strong>Date:</strong> {invoice.date}</div>
          {invoice.dueDate && <div><strong>Due Date:</strong> {invoice.dueDate}</div>}
        </div>
      </div>

      <div className="invoice-parties">
        <div className="from-section">
          <h3>From:</h3>
          <div className="business-details">
            <div className="business-name">{invoice.business.name}</div>
            <div>ABN: {invoice.business.abn}</div>
            <div>{invoice.business.address.street}</div>
            <div>
              {invoice.business.address.city}, {invoice.business.address.state} {invoice.business.address.postcode}
            </div>
            <div>Phone: {invoice.business.phone}</div>
            <div>Email: {invoice.business.email}</div>
          </div>
        </div>

        <div className="to-section">
          <h3>Bill To:</h3>
          <div className="client-details">
            <div className="client-name">{invoice.client.name}</div>
            <div style={{ whiteSpace: 'pre-line' }}>{invoice.client.address.street}</div>
            {(invoice.client.address.city || invoice.client.address.state || invoice.client.address.postcode) && (
              <div>
                {[invoice.client.address.city, invoice.client.address.state, invoice.client.address.postcode].filter(Boolean).join(', ')}
              </div>
            )}
            {invoice.client.email && <div>Email: {invoice.client.email}</div>}
            {invoice.client.phone && <div>Phone: {invoice.client.phone}</div>}
          </div>
        </div>
      </div>

      <div className="invoice-items">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              {invoice.business.isGstRegistered && <th>GST</th>}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => {
              const baseAmount = item.quantity * item.unitPrice;
              let gstAmount = 0;
              let totalAmount = baseAmount;
              
              if (invoice.business.isGstRegistered && !item.isGstFree) {
                gstAmount = item.gstIncluded ? 
                  baseAmount - (baseAmount / 1.1) : 
                  baseAmount * 0.1;
                totalAmount = item.gstIncluded ? baseAmount : baseAmount + gstAmount;
              }

              return (
                <tr key={item.id}>
                  <td>
                    {item.description}
                    {item.isGstFree && <span className="gst-free-label"> (GST-Free)</span>}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  {invoice.business.isGstRegistered && <td>{formatCurrency(gstAmount)}</td>}
                  <td>{formatCurrency(totalAmount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="invoice-totals">
        <div className="totals-row">
          <span>Subtotal:</span>
          <span>{formatCurrency(invoice.calculations.subtotal)}</span>
        </div>
        {invoice.business.isGstRegistered && invoice.calculations.gstAmount > 0 && (
          <div className="totals-row">
            <span>GST (10%):</span>
            <span>{formatCurrency(invoice.calculations.gstAmount)}</span>
          </div>
        )}
        <div className="totals-row total">
          <span><strong>Total (AUD):</strong></span>
          <span><strong>{formatCurrency(invoice.calculations.total)}</strong></span>
        </div>
      </div>

      {invoice.notes && (
        <div className="invoice-notes">
          <h4>Notes:</h4>
          <p>{invoice.notes}</p>
        </div>
      )}

      <div className="invoice-footer">
        <p>This invoice includes GST where applicable.</p>
        <p>Payment terms: Net 30 days unless otherwise specified.</p>
      </div>
    </div>
  );
};
