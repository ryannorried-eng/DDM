import { DIMENSION_CONSTRAINTS } from '../data/options.js';

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateDimensions(dims) {
  const errors = {};
  const fields = ['width', 'length', 'height'];
  for (const field of fields) {
    const val = Number(dims[field]);
    const { min, max } = DIMENSION_CONSTRAINTS[field];
    if (!dims[field] && dims[field] !== 0) {
      errors[field] = `${capitalize(field)} is required`;
    } else if (isNaN(val)) {
      errors[field] = `Enter a valid number`;
    } else if (val < min) {
      errors[field] = `Minimum is ${min} ft`;
    } else if (val > max) {
      errors[field] = `Maximum is ${max} ft`;
    }
  }
  return errors;
}

export function validateLead(lead) {
  const errors = {};
  if (!lead.name.trim()) errors.name = 'Full name is required';
  if (!lead.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(lead.email)) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
