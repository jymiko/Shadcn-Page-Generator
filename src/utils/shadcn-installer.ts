import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';
import type { GeneratorConfig } from '../types/index.js';

/**
 * List of all possible shadcn components used in generated code
 */
const COMPONENT_MAP = {
  button: 'button',
  table: 'table',
  select: 'select',
  input: 'input',
  badge: 'badge',
  card: 'card',
  checkbox: 'checkbox',
  calendar: 'calendar',
  popover: 'popover',
  pagination: 'pagination',
  dropdown: 'dropdown-menu',
} as const;

/**
 * Check if a component is already installed
 */
function isComponentInstalled(componentName: string, cwd: string): boolean {
  const componentPath = path.join(cwd, 'components', 'ui', `${componentName}.tsx`);
  return fs.existsSync(componentPath);
}

/**
 * Install a shadcn component using the CLI
 */
function installComponent(componentName: string, cwd: string): boolean {
  try {
    logger.info(`Installing ${componentName} component...`);
    execSync(`npx shadcn@latest add ${componentName} --yes --overwrite`, {
      cwd,
      stdio: 'inherit',
    });
    return true;
  } catch (error) {
    logger.error(`Failed to install ${componentName}: ${error}`);
    return false;
  }
}

/**
 * Detect which components are needed based on generator config
 */
export function detectRequiredComponents(config: GeneratorConfig): string[] {
  const required: Set<string> = new Set();

  // Always needed components
  required.add(COMPONENT_MAP.button);
  required.add(COMPONENT_MAP.table);
  required.add(COMPONENT_MAP.select);
  required.add(COMPONENT_MAP.input);
  required.add(COMPONENT_MAP.badge);
  required.add(COMPONENT_MAP.card);
  required.add(COMPONENT_MAP.pagination);
  required.add(COMPONENT_MAP.dropdown);

  // Conditional components
  if (config.includeRowSelection) {
    required.add(COMPONENT_MAP.checkbox);
  }

  if (config.filters.some(f => f.type === 'date')) {
    required.add(COMPONENT_MAP.calendar);
    required.add(COMPONENT_MAP.popover);
  }

  return Array.from(required);
}

/**
 * Check and install missing shadcn components
 */
export async function autoInstallComponents(
  config: GeneratorConfig,
  cwd: string = process.cwd()
): Promise<{ installed: string[]; skipped: string[]; failed: string[] }> {
  const result = {
    installed: [] as string[],
    skipped: [] as string[],
    failed: [] as string[],
  };

  const required = detectRequiredComponents(config);

  logger.info(`Checking ${required.length} shadcn components...`);

  for (const component of required) {
    if (isComponentInstalled(component, cwd)) {
      result.skipped.push(component);
      logger.dim(`  ✓ ${component} already installed`);
    } else {
      logger.dim(`  - ${component} missing, installing...`);
      const success = installComponent(component, cwd);
      if (success) {
        result.installed.push(component);
      } else {
        result.failed.push(component);
      }
    }
  }

  return result;
}

/**
 * Check if shadcn CLI is available
 */
export function checkShadcnCli(): boolean {
  try {
    execSync('npx shadcn@latest --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if components.json exists (indicates shadcn is initialized)
 */
export function isShadcnInitialized(cwd: string = process.cwd()): boolean {
  return fs.existsSync(path.join(cwd, 'components.json'));
}
