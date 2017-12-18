#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';

program
  .version('0.0.1')
  .usage('Usage: gendiff [options] <firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);

gendiff();
