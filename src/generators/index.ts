import type { GeneratorConfig, GeneratorResult } from '../types/index.js';
import { DDDGenerator } from './ddd-generator.js';
import { SimplifiedGenerator } from './simplified-generator.js';

/**
 * Main page generator orchestrator
 * Chooses between DDD and Simplified generators based on config
 */
export class PageGenerator {
  private generator: DDDGenerator | SimplifiedGenerator;

  constructor(private config: GeneratorConfig) {
    // Choose generator based on architecture
    this.generator = config.architecture === 'ddd'
      ? new DDDGenerator(config)
      : new SimplifiedGenerator(config);
  }

  /**
   * Generates all files and returns result
   */
  async generate(): Promise<GeneratorResult> {
    return await this.generator.generate();
  }
}
