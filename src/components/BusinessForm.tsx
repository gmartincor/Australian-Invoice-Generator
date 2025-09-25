import React from 'react';
import { BusinessDetails, AustralianState } from '../types';

interface BusinessFormProps {
  business: BusinessDetails;
  onChange: (business: BusinessDetails) => void;
}

const STATES: AustralianState[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

export const BusinessForm: React.FC<BusinessFormProps> = ({ business, onChange }) => {
  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        ...business,
        [parent]: {
          ...(business[parent as keyof BusinessDetails] as object),
          [child]: value
        }
      });
    } else {
      onChange({
        ...business,
        [field]: value
      });
    }
  };

  return (
    <div className="business-form">
      <h3>Business Details</h3>
      
      <div className="form-group">
        <label>Business Name *</label>
        <input
          type="text"
          value={business.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>ABN *</label>
        <input
          type="text"
          value={business.abn}
          onChange={(e) => handleInputChange('abn', e.target.value)}
          placeholder="11 digit ABN"
          required
        />
      </div>

      <div className="form-group">
        <div className="custom-checkbox">
          <input
            type="checkbox"
            id="gst-registered"
            checked={business.isGstRegistered}
            onChange={(e) => handleInputChange('isGstRegistered', e.target.checked)}
          />
          <label htmlFor="gst-registered">
            <span className="checkmark"></span>
            <span className="checkbox-label">GST Registered</span>
          </label>
        </div>
        <small>Check this if you are registered for GST with the ATO</small>
      </div>

      <div className="form-group">
        <label>Street Address *</label>
        <input
          type="text"
          value={business.address.street}
          onChange={(e) => handleInputChange('address.street', e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            value={business.address.city}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>State *</label>
          <select
            value={business.address.state}
            onChange={(e) => handleInputChange('address.state', e.target.value)}
            required
          >
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Postcode *</label>
          <input
            type="text"
            value={business.address.postcode}
            onChange={(e) => handleInputChange('address.postcode', e.target.value)}
            placeholder="4 digits"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={business.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Optional contact number"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={business.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Optional contact email"
          />
        </div>
      </div>
    </div>
  );
};
