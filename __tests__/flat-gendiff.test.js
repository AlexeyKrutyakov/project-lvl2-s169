import gendiff from '../src';

const fixturesPath = './__tests__/__fixtures__/';
const file0 = 'empty';
const file1 = 'flat-before';
const file2 = 'flat-after';

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


const expected1 = '{\n' +
  '    host: hexlet.io\n' +
  '  - timeout: 50\n' +
  '  + timeout: 20\n' +
  '  - proxy: 123.234.53.22\n' +
  '  + verbose: true\n}';

const expected2 = '{\n' +
  '  - host: hexlet.io\n' +
  '  - timeout: 50\n' +
  '  - proxy: 123.234.53.22\n}';

const expected3 = '{\n' +
  '  + timeout: 20\n' +
  '  + verbose: true\n' +
  '  + host: hexlet.io\n}';

describe(`diff in flat ${ext1}`, () => {
  it(`#${file1}${ext1} -> ${file2}${ext1}`, () => {
    expect(gendiff(`${path1}`, `${path2}`)).toBe(expected1);
  });

  it(`#${file1}${ext1} -> ${file0}${ext1}`, () => {
    expect(gendiff(`${path1}`, `${path0}`)).toBe(expected2);
  });

  it(`#${file0}${ext1} -> ${file2}${ext1}`, () => {
    expect(gendiff(`${path0}`, `${path2}`)).toBe(expected3);
  });
});

describe(`diff in flat ${ext2}`, () => {
  it(`#${file1}${ext2} -> ${file2}${ext2}`, () => {
    expect(gendiff(`${path4}`, `${path5}`)).toBe(expected1);
  });

  it(`#${file1}${ext2} -> ${file0}${ext2}`, () => {
    expect(gendiff(`${path4}`, `${path3}`)).toBe(expected2);
  });

  it(`#${file0}${ext2} -> ${file2}${ext2}`, () => {
    expect(gendiff(`${path3}`, `${path5}`)).toBe(expected3);
  });
});

describe(`diff in flat ${ext3}`, () => {
  it(`#${file1}${ext3} -> ${file2}${ext3}`, () => {
    expect(gendiff(`${path7}`, `${path8}`)).toBe(expected1);
  });

  it(`#${file1}${ext3} -> ${file0}${ext3}`, () => {
    expect(gendiff(`${path7}`, `${path6}`)).toBe(expected2);
  });

  it(`#${file0}${ext3} -> ${file2}${ext3}`, () => {
    expect(gendiff(`${path6}`, `${path8}`)).toBe(expected3);
  });
});
