import React, { useState } from 'react';
import './App.css';
import { BusinessForm } from './components/BusinessForm';
import { ClientForm } from './components/ClientForm';
import { ItemsForm } from './components/ItemsForm';
import { InvoiceDetailsForm } from './components/InvoiceDetailsForm';
import { InvoicePreview } from './components/InvoicePreview';
import { useInvoiceForm } from './hooks/useInvoiceForm';
import { validateInvoice } from './utils/validation';
import { InvoicePDFGenerator } from './services/pdfGenerator';

function App() {
  const {
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
  } = useInvoiceForm();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleGeneratePDF = () => {
    const invoice = generateInvoice();
    const validation = validateInvoice(invoice);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setValidationErrors([]);
    const pdfGenerator = new InvoicePDFGenerator();
    pdfGenerator.generatePDF(invoice);
  };

  const handleReset = () => {
    resetForm();
    setValidationErrors([]);
  };

  const currentInvoice = generateInvoice();

  return (
    <div className="App">
      <div className="header">
        <h1>Australian Invoice Generator</h1>
        <p>Generate GST-compliant invoices for Australian businesses</p>
      </div>

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h4>Please correct the following errors:</h4>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="invoice-generator">
        <div className="form-section">
          <BusinessForm
            business={business}
            onChange={setBusiness}
          />

          <ClientForm
            client={client}
            onChange={setClient}
          />

          <InvoiceDetailsForm
            invoiceDetails={invoiceDetails}
            onChange={setInvoiceDetails}
          />

          <ItemsForm
            items={items}
            business={business}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
          />
        </div>

        <div className="preview-section">
          <h3>Invoice Preview</h3>
          <InvoicePreview invoice={currentInvoice} />
        </div>
      </div>

      <div className="actions-section">
        <button 
          className="generate-btn"
          onClick={handleGeneratePDF}
        >
          Generate PDF
        </button>
        <button 
          className="reset-btn"
          onClick={handleReset}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
}

export default App;
