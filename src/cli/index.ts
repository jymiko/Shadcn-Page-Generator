import ora from 'ora';
import { collectConfiguration } from './prompts.js';
import { logger } from '../utils/logger.js';
import { PageGenerator } from '../generators/index.js';

/**
 * Main CLI entry point
 */
export async function run(): Promise<void> {
  try {
    // Show welcome banner
    console.clear();
    logger.title('🎨 shadcn-page-gen');
    logger.dim('Generate production-ready Next.js pages with shadcn/ui, Tailwind v4, and Framer Motion\n');

    // Collect configuration through interactive prompts
    const config = await collectConfiguration();

    if (!config) {
      logger.warning('Operation cancelled');
      process.exit(0);
    }

    // Show configuration summary
    console.log('\n');
    logger.title('📋 Configuration Summary');
    logger.info(`Page Name: ${config.pageName}`);
    logger.info(`Route: /${config.routePath}`);
    logger.info(`Architecture: ${config.architecture.toUpperCase()}`);
    logger.info(`Data Fetching: ${config.dataFetching}`);
    logger.info(`Animations: ${config.animations.intensity} intensity`);
    console.log('');

    // Generate files
    const spinner = ora('Generating files...').start();

    try {
      const generator = new PageGenerator(config);
      const result = await generator.generate();

      spinner.succeed('Files generated successfully!');

      // Show generated files
      console.log('');
      logger.title('📁 Generated Files');
      result.files.forEach(file => {
        logger.dim(`  ${file.path}`);
      });

      // Show next steps
      console.log('');
      logger.title('🎉 Success!');
      logger.success('Your page has been generated!');

      console.log('');
      logger.title('📝 Next Steps');
      result.instructions.forEach((instruction, index) => {
        logger.step(index + 1, result.instructions.length, instruction);
      });

      console.log('');
      logger.dim('Happy coding! 🚀\n');

    } catch (error) {
      spinner.fail('Generation failed');
      throw error;
    }

  } catch (error) {
    logger.error('An error occurred:');
    console.error(error);
    process.exit(1);
  }
}

// Auto-execute when run as CLI
run();
