#!/usr/bin/env node
import gendiff from '..';

const program = require('commander');

program
  .description('Compares two configuration files and shows a difference.')
  .option('-h, --help', 'output usage information')
  .option('-v, --version', 'output the version number')
  .option('-f, --format [type]', 'Output format');
program
  .arguments('[options] <firstConfig> <secondConfig>')
  .action((options, firstConfig, secondConfig) => gendiff(firstConfig, secondConfig));

program.parse(process.argv);
