#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';

program
  .version('0.2.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<file1>, <file2>')
  .action((file1, file2) => {
    const result = gendiff(file1, file2);
    console.log(result);
  })
  .parse(process.argv);
