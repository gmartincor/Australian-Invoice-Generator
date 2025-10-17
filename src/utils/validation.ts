import { BusinessDetails, Client, Invoice, ValidationResult, AustralianState } from '../types';

const ABN_REGEX = /^\d{11}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTCODE_REGEX = /^\d{4}$/;
const BSB_REGEX = /^\d{3}-?\d{3}$/;

const AUSTRALIAN_STATES: AustralianState[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

export const validateABN = (abn: string): boolean => {
  const cleanABN = abn.replace(/\s/g, '');
  
  if (!ABN_REGEX.test(cleanABN)) {
    return false;
  }

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = cleanABN.split('').map(Number);
  
  digits[0] -= 1;
  
  const sum = digits.reduce((acc, digit, index) => acc + (digit * weights[index]), 0);
  
  return sum % 89 === 0;
};

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePostcode = (postcode: string): boolean => {
  return POSTCODE_REGEX.test(postcode);
};

export const validateState = (state: string): boolean => {
  return AUSTRALIAN_STATES.includes(state as AustralianState);
};

export const validateBSB = (bsb: string): boolean => {
  return BSB_REGEX.test(bsb);
};

export const validateBusinessDetails = (business: BusinessDetails): ValidationResult => {
  const errors: string[] = [];

  if (!business.name.trim()) {
    errors.push('Business name is required');
  }

  if (!validateABN(business.abn)) {
    errors.push('Valid ABN is required (11 digits)');
  }

  if (!business.address.street.trim()) {
    errors.push('Business street address is required');
  }

  if (!business.address.city.trim()) {
    errors.push('Business city is required');
  }

  if (!validateState(business.address.state)) {
    errors.push('Valid Australian state is required');
  }

  if (!validatePostcode(business.address.postcode)) {
    errors.push('Valid postcode is required (4 digits)');
  }

  // Phone y Email son opcionales por ley australiana
  if (business.phone && business.phone.trim() === '') {
    // No es error, es opcional
  }

  if (business.email && business.email.trim() && !validateEmail(business.email)) {
    errors.push('Valid email format required if provided');
  }

  if (business.bankAccount) {
    const hasAnyBankField = business.bankAccount.accountName || business.bankAccount.bsb || business.bankAccount.accountNumber;
    
    if (hasAnyBankField) {
      if (!business.bankAccount.accountName?.trim()) {
        errors.push('Account name is required when providing bank details');
      }
      if (!business.bankAccount.bsb?.trim()) {
        errors.push('BSB is required when providing bank details');
      } else if (!validateBSB(business.bankAccount.bsb)) {
        errors.push('Valid BSB format required (XXX-XXX or XXXXXX)');
      }
      if (!business.bankAccount.accountNumber?.trim()) {
        errors.push('Account number is required when providing bank details');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateClient = (client: Client): ValidationResult => {
  const errors: string[] = [];

  if (!client.name.trim()) {
    errors.push('Client name is required');
  }

  if (!client.address.street.trim()) {
    errors.push('Client address is required');
  }

  if (client.address.postcode && !validatePostcode(client.address.postcode)) {
    errors.push('Valid postcode format required (4 digits) if provided');
  }

  if (client.email && !validateEmail(client.email)) {
    errors.push('Valid email format required if provided');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateInvoice = (invoice: Invoice): ValidationResult => {
  const errors: string[] = [];

  if (!invoice.number.trim()) {
    errors.push('Invoice number is required');
  }

  if (!invoice.date) {
    errors.push('Invoice date is required');
  }

  if (invoice.items.length === 0) {
    errors.push('At least one invoice item is required');
  }

  invoice.items.forEach((item, index) => {
    if (!item.description.trim()) {
      errors.push(`Item ${index + 1}: Description is required`);
    }
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
    }
    if (item.unitPrice <= 0) {
      errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
    }
  });

  const businessValidation = validateBusinessDetails(invoice.business);
  const clientValidation = validateClient(invoice.client);

  errors.push(...businessValidation.errors);
  errors.push(...clientValidation.errors);

  return {
    isValid: errors.length === 0,
    errors
  };
};
