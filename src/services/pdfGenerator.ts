import jsPDF from 'jspdf';
import { Invoice } from '../types';
import { formatCurrency } from '../utils/calculations';

export class InvoicePDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private readonly pageWidth: number = 210;
  private readonly margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
  }

  public generatePDF(invoice: Invoice): void {
    this.addHeader(invoice);
    this.addBusinessDetails(invoice.business);
    this.addInvoiceInfo(invoice);
    this.addClientDetails(invoice.client);
    this.addItemsTable(invoice);
    this.addTotals(invoice.calculations, invoice.business);
    this.addPaymentDetails(invoice.business);
    this.addFooter(invoice);
    
    this.downloadPDF(invoice.number);
  }

  private addHeader(invoice: Invoice): void {
    this.doc.setFontSize(24);
    this.doc.setFont(undefined, 'bold');
    const title = invoice.isTaxInvoice ? 'TAX INVOICE' : 'INVOICE';
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;
  }

  private addBusinessDetails(business: any): void {
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('From:', this.margin, this.currentY);
    this.currentY += 8;

    this.doc.setFont(undefined, 'normal');
    this.doc.text(business.name, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(`ABN: ${business.abn}`, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(business.address.street, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(`${business.address.city}, ${business.address.state} ${business.address.postcode}`, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(`Phone: ${business.phone}`, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(`Email: ${business.email}`, this.margin, this.currentY);
    this.currentY += 15;
  }

  private addInvoiceInfo(invoice: Invoice): void {
    const rightMargin = this.pageWidth - this.margin;
    
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Invoice Number:', rightMargin - 85, this.currentY - 60, { align: 'left' });
    this.doc.text('Invoice Date:', rightMargin - 85, this.currentY - 50, { align: 'left' });
    if (invoice.dueDate) {
      this.doc.text('Due Date:', rightMargin - 85, this.currentY - 40, { align: 'left' });
    }
    
    this.doc.setFont(undefined, 'normal');
    this.doc.text(invoice.number, rightMargin - 8, this.currentY - 60, { align: 'right' });
    this.doc.text(invoice.date, rightMargin - 8, this.currentY - 50, { align: 'right' });
    if (invoice.dueDate) {
      this.doc.text(invoice.dueDate, rightMargin - 8, this.currentY - 40, { align: 'right' });
    }
  }

  private addClientDetails(client: any): void {
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Bill To:', this.margin, this.currentY);
    this.currentY += 8;

    this.doc.setFont(undefined, 'normal');
    this.doc.text(client.name, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(client.address.street, this.margin, this.currentY);
    
    const addressParts = [client.address.city, client.address.state, client.address.postcode].filter(Boolean);
    if (addressParts.length > 0) {
      this.currentY += 6;
      this.doc.text(addressParts.join(', '), this.margin, this.currentY);
    }
    
    if (client.email) {
      this.currentY += 6;
      this.doc.text(`Email: ${client.email}`, this.margin, this.currentY);
    }
    this.currentY += 15;
  }

  private addItemsTable(invoice: Invoice): void {
    const tableY = this.currentY;
    const business = invoice.business;
    
    // Configurar columnas según si el negocio tiene GST o no
    let colWidths: number[];
    let headers: string[];
    
    if (business.isGstRegistered) {
      colWidths = [80, 20, 30, 30, 30];
      headers = ['Description', 'Qty', 'Unit Price', 'GST', 'Total'];
    } else {
      colWidths = [100, 30, 30, 30];
      headers = ['Description', 'Qty', 'Unit Price', 'Total'];
    }
    
    this.doc.setFont(undefined, 'bold');
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(this.margin, tableY, 190, 8, 'F');
    
    let x = this.margin;
    headers.forEach((header, index) => {
      this.doc.text(header, x + 2, tableY + 6);
      x += colWidths[index];
    });
    
    this.currentY = tableY + 12;
    this.doc.setFont(undefined, 'normal');
    
    invoice.items.forEach((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      let gstAmount = 0;
      let totalWithGST = itemTotal;
      
      if (business.isGstRegistered && !item.isGstFree) {
        gstAmount = item.gstIncluded ? 
          itemTotal - (itemTotal / 1.1) : 
          itemTotal * 0.1;
        totalWithGST = item.gstIncluded ? itemTotal : itemTotal + gstAmount;
      }
      
      x = this.margin;
      this.doc.text(item.description, x + 2, this.currentY, { maxWidth: colWidths[0] - 4 });
      x += colWidths[0];
      this.doc.text(item.quantity.toString(), x + 2, this.currentY);
      x += colWidths[1];
      this.doc.text(formatCurrency(item.unitPrice), x + 2, this.currentY);
      x += colWidths[2];
      
      if (business.isGstRegistered) {
        this.doc.text(formatCurrency(gstAmount), x + 2, this.currentY);
        x += colWidths[3];
      }
      
      this.doc.text(formatCurrency(totalWithGST), x + 2, this.currentY);
      
      this.currentY += 8;
    });
    
    this.doc.line(this.margin, this.currentY, this.margin + 190, this.currentY);
    this.currentY += 5;
  }

  private addTotals(calculations: any, business: any): void {
    const rightX = this.pageWidth - this.margin - 60;
    
    this.doc.setFont(undefined, 'normal');
    this.doc.text('Subtotal:', rightX, this.currentY);
    this.doc.text(formatCurrency(calculations.subtotal), rightX + 50, this.currentY, { align: 'right' });
    this.currentY += 8;
    
    if (business.isGstRegistered && calculations.gstAmount > 0) {
      this.doc.text('GST (10%):', rightX, this.currentY);
      this.doc.text(formatCurrency(calculations.gstAmount), rightX + 50, this.currentY, { align: 'right' });
      this.currentY += 8;
    }
    
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Total (AUD):', rightX, this.currentY);
    this.doc.text(formatCurrency(calculations.total), rightX + 50, this.currentY, { align: 'right' });
    this.currentY += 15;
  }

  private addPaymentDetails(business: any): void {
    if (!business.bankAccount?.accountName || !business.bankAccount?.bsb || !business.bankAccount?.accountNumber) {
      return;
    }

    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Payment Details:', this.margin, this.currentY);
    this.currentY += 8;

    this.doc.setFont(undefined, 'normal');
    this.doc.text(`Account Name: ${business.bankAccount.accountName}`, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(`BSB: ${business.bankAccount.bsb}`, this.margin, this.currentY);
    this.currentY += 6;
    this.doc.text(`Account Number: ${business.bankAccount.accountNumber}`, this.margin, this.currentY);
    this.currentY += 15;
  }

  private addFooter(invoice: Invoice): void {
    if (invoice.notes) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Notes:', this.margin, this.currentY);
      this.currentY += 8;
      this.doc.setFont(undefined, 'normal');
      this.doc.text(invoice.notes, this.margin, this.currentY, { maxWidth: 170 });
      this.currentY += 15;
    }
    
    this.doc.setFontSize(10);
    if (invoice.business.isGstRegistered) {
      this.doc.text('This invoice includes GST where applicable.', this.margin, this.currentY);
    }
  }

  private downloadPDF(invoiceNumber: string): void {
    this.doc.save(`invoice-${invoiceNumber}.pdf`);
  }
}
