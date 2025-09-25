import React from 'react';
import { InvoiceItem, BusinessDetails } from '../types';
import { formatCurrency, calculateItemTotal, calculateItemGST } from '../utils/calculations';

interface ItemsFormProps {
  items: InvoiceItem[];
  business: BusinessDetails;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<InvoiceItem>) => void;
}

export const ItemsForm: React.FC<ItemsFormProps> = ({ 
  items, 
  business,
  onAddItem, 
  onRemoveItem, 
  onUpdateItem 
}) => {
  return (
    <div className="items-form">
      <h3>Invoice Items</h3>
      
      <div className="items-table">
        <div className={`items-header ${business.isGstRegistered ? 'with-gst' : 'no-gst'}`}>
          <div>Description</div>
          <div>Qty</div>
          <div>Unit Price</div>
          {business.isGstRegistered && <div>GST Incl.</div>}
          {business.isGstRegistered && <div>GST Free</div>}
          {business.isGstRegistered && <div>GST</div>}
          <div>Total</div>
          <div>Actions</div>
        </div>

        {items.map((item) => (
          <div key={item.id} className={`item-row ${business.isGstRegistered ? 'with-gst' : 'no-gst'}`}>
            <div className="form-group">
              <input
                type="text"
                value={item.description}
                onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                placeholder="Service or product description"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => onUpdateItem(item.id, { quantity: Number(e.target.value) })}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => onUpdateItem(item.id, { unitPrice: Number(e.target.value) })}
                min="0"
                step="0.01"
                required
              />
            </div>

            {business.isGstRegistered && (
              <div className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={item.gstIncluded}
                  onChange={(e) => onUpdateItem(item.id, { gstIncluded: e.target.checked })}
                  disabled={item.isGstFree}
                />
              </div>
            )}

            {business.isGstRegistered && (
              <div className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={item.isGstFree}
                  onChange={(e) => onUpdateItem(item.id, { isGstFree: e.target.checked })}
                />
                <div className="checkbox-help">Medical, education, etc.</div>
              </div>
            )}

            {business.isGstRegistered && (
              <div className="calculated-field">
                {formatCurrency(calculateItemGST(item, business))}
              </div>
            )}

            <div className="calculated-field">
              {formatCurrency(calculateItemTotal(item, business))}
            </div>

            <div className="actions">
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                disabled={items.length === 1}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={onAddItem} className="add-item-btn">
        Add Item
      </button>
    </div>
  );
};
