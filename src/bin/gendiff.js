#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';

program
  .version('0.4.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format , default = "tree"')
  .arguments('<file1>, <file2>')
  .action((file1, file2, option) => {
    const result = gendiff(file1, file2, option.format);
    console.log(result);
  })
  .parse(process.argv);
