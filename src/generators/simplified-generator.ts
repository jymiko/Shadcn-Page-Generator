import path from 'path';
import prompts from 'prompts';
import type { GeneratorConfig, GeneratorResult, GeneratedFile } from '../types/index.js';
import { writeFiles, createDirectories, checkExistingFiles } from '../utils/file-system.js';
import { logger } from '../utils/logger.js';
import { autoInstallComponents, isShadcnInitialized, checkShadcnCli } from '../utils/shadcn-installer.js';
import {
  generateSimplifiedComponent,
  generateSimplifiedPage,
  generateTemplate
} from '../templates/simplified/index.js';

/**
 * Simplified Generator
 * Generates just components and pages without DDD layers
 */
export class SimplifiedGenerator {
  constructor(private config: GeneratorConfig) {}

  async generate(): Promise<GeneratorResult> {
    const files: GeneratedFile[] = [];
    const cwd = process.cwd();
    const { moduleName, routePath } = this.config;

    // Check and install shadcn components
    await this.checkAndInstallComponents(cwd);

    // Define directory structure
    const componentDir = path.join(cwd, 'components', moduleName);
    const appDir = path.join(cwd, 'app', '(dashboard)', routePath);

    // Create directories
    await createDirectories([componentDir, appDir]);

    // Generate files
    // 1. Component
    files.push({
      path: path.join(componentDir, `${moduleName}-list.tsx`),
      content: generateSimplifiedComponent(this.config)
    });

    // 2. Page
    files.push({
      path: path.join(appDir, 'page.tsx'),
      content: generateSimplifiedPage(this.config)
    });

    // 3. Template (if animations enabled)
    if (this.config.animations.pageTransitions) {
      files.push({
        path: path.join(appDir, 'template.tsx'),
        content: generateTemplate(this.config)
      });
    }

// Check for existing files
const filePaths = files.map(f => f.path);
const existingFiles = await checkExistingFiles(filePaths);

if (existingFiles.length > 0) {
  console.log('');
  logger.warning(`Found ${existingFiles.length} existing file(s):`);
  existingFiles.forEach(file => {
    const relativePath = path.relative(cwd, file);
    logger.dim(`  - ${relativePath}`);
  });
  console.log('');

  // Always overwrite when regenerating
  logger.info('Overwriting existing files...');
}

// Write all files
await writeFiles(files, true);

    // Generate instructions
    const instructions = this.generateInstructions();

    return { files, instructions };
  }

  private generateInstructions(): string[] {
    const instructions: string[] = [];

    instructions.push(`Navigate to your page: http://localhost:3000/${this.config.routePath}`);

    // Check for dependencies
    const deps: string[] = [];
    if (this.config.dataFetching === 'tanstack') {
      deps.push('@tanstack/react-query');
    }
    if (this.config.animations.pageTransitions || this.config.animations.listAnimations) {
      deps.push('framer-motion');
    }

    if (deps.length > 0) {
      instructions.push(`Install dependencies: npm install ${deps.join(' ')}`);
    }

    instructions.push('Customize the generated code to fit your needs');
    instructions.push('Replace mock data with your real API');

    if (this.config.dataFetching === 'tanstack') {
      instructions.push('Ensure your app is wrapped in <QueryClientProvider>');
    }

    return instructions;
  }

  private async checkAndInstallComponents(cwd: string): Promise<void> {
    if (!isShadcnInitialized(cwd)) {
      logger.warning('shadcn/ui is not initialized in this project.');
      logger.info('Please run: npx shadcn@latest init');
      return;
    }

    if (!checkShadcnCli()) {
      logger.warning('shadcn CLI not available. Skipping component auto-install.');
      return;
    }

    console.log('');
    logger.info('🔍 Checking shadcn components...');
    const result = await autoInstallComponents(this.config, cwd);

    if (result.installed.length > 0) {
      console.log('');
      logger.success(`✓ Installed ${result.installed.length} component(s): ${result.installed.join(', ')}`);
    }

    if (result.failed.length > 0) {
      console.log('');
      logger.error(`✗ Failed to install ${result.failed.length} component(s): ${result.failed.join(', ')}`);
    }

    console.log('');
  }
}
