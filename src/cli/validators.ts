/**
 * Input validation functions
 */

export function validateNotEmpty(value: string): boolean | string {
  return value.length > 0 || 'This field is required';
}

export function validateRoutePath(value: string): boolean | string {
  if (!value || value.length === 0) {
    return 'Route path is required';
  }

  // Check for valid characters (alphanumeric, dash, slash)
  if (!/^[a-z0-9\-\/]+$/.test(value)) {
    return 'Route path can only contain lowercase letters, numbers, dashes, and slashes';
  }

  return true;
}

export function validateIdentifier(value: string): boolean | string {
  if (!value || value.length === 0) {
    return 'This field is required';
  }

  // Check for valid identifier (alphanumeric, underscore, dash)
  if (!/^[a-zA-Z][a-zA-Z0-9_\-]*$/.test(value)) {
    return 'Must start with a letter and contain only letters, numbers, underscores, and dashes';
  }

  return true;
}

export function validateColumnKey(value: string): boolean | string {
  if (!value || value.length === 0) {
    return 'Column key is required';
  }

  // Check for valid JavaScript identifier
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
    return 'Column key must be a valid JavaScript identifier (camelCase recommended)';
  }

  return true;
}
