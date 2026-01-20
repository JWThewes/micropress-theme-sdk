#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { buildCommand } from './commands/build';
import { validateCommand } from './commands/validate';
import { packageCommand } from './commands/package';

// Version injected at build time from package.json
const VERSION = process.env.PKG_VERSION || '0.1.0';

const program = new Command();

program
  .name('micropress-theme')
  .description('CLI for building MicroPress themes')
  .version(VERSION);

program
  .command('init <name>')
  .description('Initialize a new theme project')
  .option('-d, --directory <dir>', 'Directory to create theme in', '.')
  .option('--no-git', 'Skip git initialization')
  .action(initCommand);

program
  .command('build')
  .description('Build the theme for distribution')
  .option('-w, --watch', 'Watch for changes')
  .option('-o, --output <dir>', 'Output directory', 'dist')
  .action(buildCommand);

program
  .command('validate')
  .description('Validate theme structure and manifest')
  .option('--fix', 'Attempt to fix simple issues')
  .action(validateCommand);

program
  .command('package')
  .description('Create a distributable ZIP file')
  .option('-o, --output <file>', 'Output file path')
  .action(packageCommand);

program.parse();
