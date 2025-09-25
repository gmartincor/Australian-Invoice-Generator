import React from 'react';

interface InvoiceDetailsFormProps {
  invoiceDetails: {
    number: string;
    date: string;
    dueDate: string;
    notes: string;
  };
  onChange: (details: any) => void;
}

export const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({ 
  invoiceDetails, 
  onChange 
}) => {
  const handleChange = (field: string, value: string) => {
    onChange({
      ...invoiceDetails,
      [field]: value
    });
  };

  return (
    <div className="invoice-details-form">
      <h3>Invoice Details</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Invoice Number *</label>
          <input
            type="text"
            value={invoiceDetails.number}
            onChange={(e) => handleChange('number', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Invoice Date *</label>
          <input
            type="date"
            value={invoiceDetails.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={invoiceDetails.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            placeholder="Payment terms (optional)"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          value={invoiceDetails.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          placeholder="Additional notes or payment terms..."
        />
      </div>
    </div>
  );
};
