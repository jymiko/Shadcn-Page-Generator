import prompts from 'prompts';
import type { GeneratorConfig, Column, Filter } from '../types/index.js';
import { toKebabCase, toPascalCase } from '../utils/string-transforms.js';
import { validateNotEmpty, validateRoutePath, validateColumnKey } from './validators.js';

/**
 * Collects all configuration through interactive prompts
 */
export async function collectConfiguration(): Promise<GeneratorConfig | null> {
  // Handle Ctrl+C gracefully
  prompts.override({ onCancel: () => process.exit(0) });

  console.log('\n🚀 Welcome to shadcn-page-gen!\n');

  // Step 1: Page Name
  const { pageName } = await prompts({
    type: 'text',
    name: 'pageName',
    message: 'What is the name of the page? (e.g., "User Management")',
    validate: validateNotEmpty
  });

  if (!pageName) return null;

  // Step 2: Route Path
  const defaultRoute = toKebabCase(pageName);
  const { routePath } = await prompts({
    type: 'text',
    name: 'routePath',
    message: `What is the route path? (e.g., "admin/users")`,
    initial: defaultRoute,
    validate: validateRoutePath
  });

  if (!routePath) return null;

  const cleanRoutePath = routePath.replace(/^\/+|\/+$/g, '');
  const defaultModuleName = cleanRoutePath.replace(/\//g, '-');

  // Step 3: Module Name
  const { moduleName } = await prompts({
    type: 'text',
    name: 'moduleName',
    message: `Module name?`,
    initial: defaultModuleName
  });

  if (!moduleName) return null;

  // Step 4: Architecture Choice
  const { architecture } = await prompts({
    type: 'select',
    name: 'architecture',
    message: 'Choose architecture pattern:',
    choices: [
      {
        title: 'DDD (Domain-Driven Design)',
        value: 'ddd',
        description: 'Full layers: Domain, Application, Infrastructure, Presentation'
      },
      {
        title: 'Simplified',
        value: 'simplified',
        description: 'Just components and pages - cleaner, faster'
      }
    ],
    initial: 0
  });

  if (!architecture) return null;

  // Step 5: Entity Name (if DDD)
  const pascalName = toPascalCase(pageName);
  let entityName = pascalName;

  if (architecture === 'ddd') {
    const response = await prompts({
      type: 'text',
      name: 'entityName',
      message: `Entity name? (e.g., Product, Ticket)`,
      initial: pascalName
    });

    if (!response.entityName) return null;
    entityName = response.entityName;
  }

  // Step 6: Columns
  const columns: Column[] = [];
  let addColumn = true;

  console.log('\n--- Table Columns (ID is automatic) ---');

  const { useDefaultColumns } = await prompts({
    type: 'confirm',
    name: 'useDefaultColumns',
    message: 'Use default columns? (Name, Status, Created At)',
    initial: true
  });

  if (useDefaultColumns) {
    columns.push(
      { label: 'Name', key: 'name', type: 'string', sortable: true },
      { label: 'Status', key: 'status', type: 'string', sortable: true },
      { label: 'Created At', key: 'createdAt', type: 'date', sortable: true }
    );
  } else {
    while (addColumn) {
      const { continueAdding } = await prompts({
        type: 'confirm',
        name: 'continueAdding',
        message: columns.length === 0 ? 'Add a column?' : 'Add another column?',
        initial: true
      });

      if (!continueAdding) break;

      const columnData = await prompts([
        {
          type: 'text',
          name: 'label',
          message: 'Column Label (e.g., "Email Address"):',
          validate: validateNotEmpty
        },
        {
          type: 'text',
          name: 'key',
          message: 'Column Key (e.g., "email"):',
          validate: validateColumnKey
        },
        {
          type: 'select',
          name: 'type',
          message: 'Column Type:',
          choices: [
            { title: 'String', value: 'string' },
            { title: 'Number', value: 'number' },
            { title: 'Boolean', value: 'boolean' },
            { title: 'Date', value: 'date' }
          ],
          initial: 0
        }
      ]);

      if (columnData.label && columnData.key && columnData.type) {
        columns.push({
          ...columnData,
          sortable: false // Will be set later
        });
      }
    }

    if (columns.length === 0) {
      // If user didn't add any, use defaults
      columns.push(
        { label: 'Name', key: 'name', type: 'string', sortable: true },
        { label: 'Status', key: 'status', type: 'string', sortable: true },
        { label: 'Created At', key: 'createdAt', type: 'date', sortable: true }
      );
    }
  }

  // Step 7: Filters
  const filters: Filter[] = [];

  console.log('\n--- Filters ---');

  const { addFilters } = await prompts({
    type: 'confirm',
    name: 'addFilters',
    message: 'Add filters?',
    initial: true
  });

  if (addFilters) {
    let addFilterLoop = true;

    while (addFilterLoop) {
      const { continueAddingFilter } = await prompts({
        type: 'confirm',
        name: 'continueAddingFilter',
        message: filters.length === 0 ? 'Add a filter?' : 'Add another filter?',
        initial: filters.length === 0
      });

      if (!continueAddingFilter) break;

      const filterData = await prompts([
        {
          type: 'select',
          name: 'type',
          message: 'Filter type:',
          choices: [
            { title: 'Dropdown (Select)', value: 'select' },
            { title: 'Date Picker', value: 'date' },
            { title: 'Text Input', value: 'input' }
          ]
        },
        {
          type: 'text',
          name: 'label',
          message: 'Filter Label (e.g., "Status"):',
          validate: validateNotEmpty
        },
        {
          type: 'text',
          name: 'key',
          message: 'Filter Key (URL param, e.g., "status"):',
          validate: validateColumnKey
        }
      ]);

      if (filterData.type && filterData.label && filterData.key) {
        filters.push(filterData);
      }
    }
  }

  // Step 8: UI Options
  console.log('\n--- UI Options ---');

  const uiOptions = await prompts([
    {
      type: 'confirm',
      name: 'includeStats',
      message: 'Include Stats Cards at the top?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'includeRowSelection',
      message: 'Include Row Selection (Checkboxes)?',
      initial: false
    }
  ]);

  // Step 9: Data Fetching Strategy
  const { dataFetching } = await prompts({
    type: 'select',
    name: 'dataFetching',
    message: 'Data Fetching Strategy:',
    choices: [
      { title: 'Mock Data (Repository Pattern)', value: 'mock', description: 'Default mock data with repository pattern' },
      { title: 'TanStack Query (React Query)', value: 'tanstack', description: 'Modern data fetching with caching' },
      { title: 'Standard (fetch/useEffect)', value: 'fetch', description: 'Basic fetch with useEffect' }
    ],
    initial: 0
  });

  // Step 10: Sorting
  const { enableSorting } = await prompts({
    type: 'confirm',
    name: 'enableSorting',
    message: 'Enable Column Sorting?',
    initial: true
  });

  let sortableColumns: string[] = [];

  if (enableSorting && columns.length > 0) {
    const { selected } = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: 'Select columns to enable sorting (Space to select, Enter to submit):',
      choices: columns.map(c => ({ title: c.label, value: c.key, selected: true })),
      min: 0
    });

    sortableColumns = selected || [];

    // Update sortable flag on columns
    columns.forEach(col => {
      col.sortable = sortableColumns.includes(col.key);
    });
  }

  // Step 11: Animations
  console.log('\n--- Animations (Framer Motion) ---');

  const animationOptions = await prompts([
    {
      type: 'confirm',
      name: 'pageTransitions',
      message: 'Add page transition animations?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'listAnimations',
      message: 'Animate table rows on load?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'cardAnimations',
      message: 'Animate stats cards?',
      initial: uiOptions.includeStats
    },
    {
      type: 'select',
      name: 'intensity',
      message: 'Animation intensity:',
      choices: [
        { title: 'Subtle (professional)', value: 'subtle' },
        { title: 'Moderate (balanced)', value: 'moderate' },
        { title: 'Bold (eye-catching)', value: 'bold' }
      ],
      initial: 1
    }
  ]);

  // Build final config
  const config: GeneratorConfig = {
    pageName,
    routePath: cleanRoutePath,
    moduleName,
    architecture,
    entityName,
    columns,
    filters,
    includeStats: uiOptions.includeStats,
    includeRowSelection: uiOptions.includeRowSelection,
    includeSearch: true, // Always include search
    dataFetching,
    sortableColumns,
    animations: {
      pageTransitions: animationOptions.pageTransitions,
      listAnimations: animationOptions.listAnimations,
      cardAnimations: animationOptions.cardAnimations,
      intensity: animationOptions.intensity
    }
  };

  return config;
}
