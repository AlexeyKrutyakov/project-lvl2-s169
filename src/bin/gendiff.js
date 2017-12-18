#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.1')
  .usage('Usage: gendiff [options] <firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
