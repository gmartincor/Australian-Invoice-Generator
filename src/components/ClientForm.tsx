import React from 'react';
import { Client, AustralianState } from '../types';

interface ClientFormProps {
  client: Client;
  onChange: (client: Client) => void;
}

const STATES: AustralianState[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

export const ClientForm: React.FC<ClientFormProps> = ({ client, onChange }) => {
  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        ...client,
        [parent]: {
          ...(client[parent as keyof Client] as object),
          [child]: value
        }
      });
    } else {
      onChange({
        ...client,
        [field]: value
      });
    }
  };

  return (
    <div className="client-form">
      <h3>Client Details</h3>
      
      <div className="form-group">
        <label>Client Name *</label>
        <input
          type="text"
          value={client.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Client Address *</label>
        <textarea
          value={client.address.street}
          onChange={(e) => handleInputChange('address.street', e.target.value)}
          placeholder="Full address (street, city, state, postcode)"
          required
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={client.address.city}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
            placeholder="Optional - for organized records"
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <select
            value={client.address.state}
            onChange={(e) => handleInputChange('address.state', e.target.value)}
          >
            <option value="">Select State (Optional)</option>
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Postcode</label>
          <input
            type="text"
            value={client.address.postcode}
            onChange={(e) => handleInputChange('address.postcode', e.target.value)}
            placeholder="4 digits (optional)"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={client.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={client.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
