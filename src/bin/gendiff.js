#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format');
program
  .arguments('<firstConfig> <secondConfig>')
  .action(gendiff);

program.parse(process.argv);
