import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger.js';

/**
 * File system utilities
 */

/**
 * Ensures a directory exists, creates it if it doesn't
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/**
 * Writes content to a file, creating parent directories if needed
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Checks if a file or directory exists
 */
export async function exists(pathToCheck: string): Promise<boolean> {
  try {
    await fs.access(pathToCheck);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads a file and returns its content
 */
export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

/**
 * Checks if path is a directory
 */
export async function isDirectory(pathToCheck: string): Promise<boolean> {
  try {
    const stats = await fs.stat(pathToCheck);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Removes a file or directory
 */
export async function remove(pathToRemove: string): Promise<void> {
  await fs.remove(pathToRemove);
}

/**
 * Creates multiple directories at once
 */
export async function createDirectories(dirs: string[]): Promise<void> {
  for (const dir of dirs) {
    await ensureDir(dir);
  }
}

/**
 * Writes multiple files at once
 */
export async function writeFiles(files: Array<{ path: string; content: string }>): Promise<void> {
  for (const file of files) {
    await writeFile(file.path, file.content);
    logger.dim(`  Created: ${file.path}`);
  }
}
