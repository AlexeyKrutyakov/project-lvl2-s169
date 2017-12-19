#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';

program
  .version('0.0.8')
  .usage('Usage: gendiff [options] <firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv)
  .arguments('<file1>, <file2>')
  .action((file1, file2) => {
    const result = gendiff(file1, file2);
    console.log(result);
  });
