import chalk from 'chalk';

/**
 * Logger utility with colored output
 */

export const logger = {
  success(message: string): void {
    console.log(chalk.green('✓'), message);
  },

  error(message: string): void {
    console.log(chalk.red('✗'), message);
  },

  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  },

  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  },

  log(message: string): void {
    console.log(message);
  },

  title(message: string): void {
    console.log(chalk.bold.cyan(`\n${message}\n`));
  },

  step(step: number, total: number, message: string): void {
    console.log(chalk.gray(`[${step}/${total}]`), message);
  },

  dim(message: string): void {
    console.log(chalk.dim(message));
  }
};
