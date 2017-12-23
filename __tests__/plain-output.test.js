import fs from 'fs';
import gendiff from '../src';

const fixturesPath = './__tests__/__fixtures__/';
const file0 = 'empty';
const file1 = 'comp-before';
const file2 = 'comp-after';

const ext1 = '.json';
const ext2 = '.yaml';
const ext3 = '.ini';

const path0 = `${fixturesPath}${file0}${ext1}`;
const path1 = `${fixturesPath}${file1}${ext1}`;
const path2 = `${fixturesPath}${file2}${ext1}`;

const path3 = `${fixturesPath}${file0}${ext2}`;
const path4 = `${fixturesPath}${file1}${ext2}`;
const path5 = `${fixturesPath}${file2}${ext2}`;

const path6 = `${fixturesPath}${file0}${ext3}`;
const path7 = `${fixturesPath}${file1}${ext3}`;
const path8 = `${fixturesPath}${file2}${ext3}`;

const correctAnswer1 = `${fixturesPath}answ-comp-01-plain`;
const correctAnswer2 = `${fixturesPath}answ-comp-02-plain`;
const correctAnswer3 = `${fixturesPath}answ-comp-03-plain`;


describe(`diff in composite ${ext1} to plain`, () => {
  it(`#${file1}${ext1} -> ${file2}${ext1}`, () => {
    const expected = fs.readFileSync(correctAnswer1, 'utf-8');
    expect(gendiff(`${path1}`, `${path2}`, 'plain')).toBe(expected);
  });

  it(`#${file1}${ext1} -> ${file0}${ext1}`, () => {
    const expected = fs.readFileSync(correctAnswer2, 'utf-8');
    expect(gendiff(`${path1}`, `${path0}`, 'plain')).toBe(expected);
  });

  it(`#${file0}${ext1} -> ${file2}${ext1}`, () => {
    const expected = fs.readFileSync(correctAnswer3, 'utf-8');
    expect(gendiff(`${path0}`, `${path2}`, 'plain')).toBe(expected);
  });
});

describe(`diff  composite ${ext2} to plain`, () => {
  it(`#${file1}${ext2} -> ${file2}${ext2}`, () => {
    const expected = fs.readFileSync(correctAnswer1, 'utf-8');
    expect(gendiff(`${path4}`, `${path5}`, 'plain')).toBe(expected);
  });

  it(`#${file1}${ext2} -> ${file0}${ext2}`, () => {
    const expected = fs.readFileSync(correctAnswer2, 'utf-8');
    expect(gendiff(`${path4}`, `${path3}`, 'plain')).toBe(expected);
  });

  it(`#${file0}${ext2} -> ${file2}${ext2}`, () => {
    const expected = fs.readFileSync(correctAnswer3, 'utf-8');
    expect(gendiff(`${path3}`, `${path5}`, 'plain')).toBe(expected);
  });
});

describe(`diff in composite ${ext3} to plain`, () => {
  it(`#${file1}${ext3} -> ${file2}${ext3}`, () => {
    const expected = fs.readFileSync(correctAnswer1, 'utf-8');
    expect(gendiff(`${path7}`, `${path8}`, 'plain')).toBe(expected);
  });

  it(`#${file1}${ext3} -> ${file0}${ext3}`, () => {
    const expected = fs.readFileSync(correctAnswer2, 'utf-8');
    expect(gendiff(`${path7}`, `${path6}`, 'plain')).toBe(expected);
  });

  it(`#${file0}${ext3} -> ${file2}${ext3}`, () => {
    const expected = fs.readFileSync(correctAnswer3, 'utf-8');
    expect(gendiff(`${path6}`, `${path8}`, 'plain')).toBe(expected);
  });
});
