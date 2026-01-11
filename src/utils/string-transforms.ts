/**
 * String transformation utilities
 */

/**
 * Converts string to PascalCase
 * Example: "user management" => "UserManagement"
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Converts string to camelCase
 * Example: "User Management" => "userManagement"
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Converts string to kebab-case
 * Example: "User Management" => "user-management"
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Converts string to snake_case
 * Example: "User Management" => "user_management"
 */
export function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)+/g, '');
}

/**
 * Pluralizes a word (simple English rules)
 * Example: "User" => "Users", "Category" => "Categories"
 */
export function pluralize(word: string): string {
  if (word.endsWith('y') && !['ay', 'ey', 'iy', 'oy', 'uy'].some(v => word.endsWith(v))) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') ||
      word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es';
  }
  return word + 's';
}

/**
 * Capitalizes first letter
 * Example: "hello" => "Hello"
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
