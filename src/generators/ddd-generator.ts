import path from 'path';
import type { GeneratorConfig, GeneratorResult, GeneratedFile } from '../types/index.js';
import { writeFiles, createDirectories } from '../utils/file-system.js';
import {
  generateEntity,
  generateRepositoryInterface,
  generateRepositoryImpl,
  generateUseCase,
  generateComponent,
  generatePage,
  generateTemplate
} from '../templates/ddd/index.js';

/**
 * DDD (Domain-Driven Design) Generator
 * Generates complete module structure with all layers
 */
export class DDDGenerator {
  constructor(private config: GeneratorConfig) {}

  async generate(): Promise<GeneratorResult> {
    const files: GeneratedFile[] = [];
    const cwd = process.cwd();
    const { moduleName, routePath } = this.config;

    // Define directory structure
    const moduleDir = path.join(cwd, 'modules', moduleName);
    const appDir = path.join(cwd, 'app', '(dashboard)', routePath);

    // Create directories
    const dirs = [
      path.join(moduleDir, 'domain', 'entities'),
      path.join(moduleDir, 'domain', 'repositories'),
      path.join(moduleDir, 'application', 'use-cases'),
      path.join(moduleDir, 'infrastructure', 'repositories'),
      path.join(moduleDir, 'presentation', 'components'),
      appDir
    ];

    await createDirectories(dirs);

    // Generate files
    // 1. Domain Layer - Entity
    files.push({
      path: path.join(moduleDir, 'domain', 'entities', `${moduleName}.entity.ts`),
      content: generateEntity(this.config)
    });

    // 2. Domain Layer - Repository Interface
    files.push({
      path: path.join(moduleDir, 'domain', 'repositories', `${moduleName}.repository.interface.ts`),
      content: generateRepositoryInterface(this.config)
    });

    // 3. Infrastructure Layer - Repository Implementation
    files.push({
      path: path.join(moduleDir, 'infrastructure', 'repositories', `${moduleName}.repository.ts`),
      content: generateRepositoryImpl(this.config)
    });

    // 4. Application Layer - Use Case
    files.push({
      path: path.join(moduleDir, 'application', 'use-cases', `get-${moduleName}s.use-case.ts`),
      content: generateUseCase(this.config)
    });

    // 5. Presentation Layer - Component
    files.push({
      path: path.join(moduleDir, 'presentation', 'components', `${moduleName}-list.tsx`),
      content: generateComponent(this.config)
    });

    // 6. App Layer - Page
    files.push({
      path: path.join(appDir, 'page.tsx'),
      content: generatePage(this.config)
    });

    // 7. App Layer - Template (if animations enabled)
    if (this.config.animations.pageTransitions) {
      files.push({
        path: path.join(appDir, 'template.tsx'),
        content: generateTemplate(this.config)
      });
    }

    // Write all files
    await writeFiles(files);

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
    instructions.push('Connect to your real API (replace mock repository)');

    if (this.config.dataFetching === 'tanstack') {
      instructions.push('Ensure your app is wrapped in <QueryClientProvider>');
    }

    return instructions;
  }
}
