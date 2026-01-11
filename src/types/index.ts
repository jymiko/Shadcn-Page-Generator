/**
 * Type definitions for shadcn-page-gen
 */

/**
 * Column definition for table
 */
export interface Column {
  label: string;
  key: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  sortable: boolean;
}

/**
 * Filter definition
 */
export interface Filter {
  type: 'select' | 'date' | 'input' | 'multiselect';
  label: string;
  key: string;
  options?: string[];
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  pageTransitions: boolean;
  listAnimations: boolean;
  cardAnimations: boolean;
  intensity: 'subtle' | 'moderate' | 'bold';
}

/**
 * Main generator configuration
 */
export interface GeneratorConfig {
  // Basic Info
  pageName: string;
  routePath: string;
  moduleName: string;

  // Architecture Choice
  architecture: 'ddd' | 'simplified';

  // Entity (if DDD)
  entityName: string;

  // Table Configuration
  columns: Column[];

  // Filters
  filters: Filter[];

  // UI Features
  includeStats: boolean;
  includeRowSelection: boolean;
  includeSearch: boolean;

  // Data Fetching Strategy
  dataFetching: 'mock' | 'tanstack' | 'fetch';

  // Sorting
  sortableColumns: string[];

  // Animations
  animations: AnimationConfig;
}

/**
 * Template context for entity generation
 */
export interface EntityContext {
  entityName: string;
  moduleName: string;
  columns: Column[];
}

/**
 * Template context for repository generation
 */
export interface RepositoryContext {
  entityName: string;
  moduleName: string;
  columns: Column[];
}

/**
 * Template context for use case generation
 */
export interface UseCaseContext {
  entityName: string;
  moduleName: string;
}

/**
 * Template context for component generation
 */
export interface ComponentContext {
  entityName: string;
  moduleName: string;
  pageName: string;
  routePath: string;
  columns: Column[];
  filters: Filter[];
  includeStats: boolean;
  includeRowSelection: boolean;
  includeSearch: boolean;
  dataFetching: 'mock' | 'tanstack' | 'fetch';
  sortableColumns: string[];
  animations: AnimationConfig;
}

/**
 * Template context for page generation
 */
export interface PageContext {
  pageName: string;
  routePath: string;
  moduleName: string;
  entityName: string;
  architecture: 'ddd' | 'simplified';
}

/**
 * File to be generated
 */
export interface GeneratedFile {
  path: string;
  content: string;
}

/**
 * Generator result
 */
export interface GeneratorResult {
  files: GeneratedFile[];
  instructions: string[];
}
