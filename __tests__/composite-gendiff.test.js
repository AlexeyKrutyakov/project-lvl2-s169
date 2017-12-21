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

const expected1 = '{\n' +
  `${' '.repeat(4)}common: {\n` +
  `${' '.repeat(8)}setting1: Value 1\n` +
  `${' '.repeat(6)}- setting2: 200\n` +
  `${' '.repeat(8)}setting3: true\n` +
  `${' '.repeat(6)}- setting6: {\n` +
  `${' '.repeat(12)}key: value\n` +
  `${' '.repeat(8)}}\n` +
  `${' '.repeat(6)}+ setting4: blah blah\n` +
  `${' '.repeat(6)}+ setting5: {\n` +
  `${' '.repeat(12)}key5: value5\n` +
  `${' '.repeat(8)}}\n` +
  `${' '.repeat(4)}}\n` +
  `${' '.repeat(4)}group1: {\n` +
  `${' '.repeat(6)}- baz: bas\n` +
  `${' '.repeat(6)}+ baz: bars\n` +
  `${' '.repeat(8)}foo: bar\n` +
  `${' '.repeat(4)}}\n` +
  `${' '.repeat(2)}- group2: {\n` +
  `${' '.repeat(8)}abc: 12345\n` +
  `${' '.repeat(4)}}\n` +
  `${' '.repeat(2)}+ group3: {\n` +
  `${' '.repeat(8)}fee: 100500\n` +
  `${' '.repeat(4)}}\n` +
  '}';

const expected2 = '{\n' +
`${' '.repeat(2)}- common: {\n` +
`${' '.repeat(8)}setting1: Value 1\n` +
`${' '.repeat(8)}setting2: 200\n` +
`${' '.repeat(8)}setting3: true\n` +
`${' '.repeat(8)}setting6: {\n` +
`${' '.repeat(12)}key: value\n` +
`${' '.repeat(8)}}\n` +
`${' '.repeat(4)}}\n` +
`${' '.repeat(2)}- group1: {\n` +
`${' '.repeat(8)}baz: bas\n` +
`${' '.repeat(8)}foo: bar\n` +
`${' '.repeat(4)}}\n` +
`${' '.repeat(2)}- group2: {\n` +
`${' '.repeat(8)}abc: 12345\n` +
`${' '.repeat(4)}}\n` +
'}';

const expected3 = '{\n' +
`${' '.repeat(2)}+ common: {\n` +
`${' '.repeat(8)}setting1: Value 1\n` +
`${' '.repeat(8)}setting3: true\n` +
`${' '.repeat(8)}setting4: blah blah\n` +
`${' '.repeat(8)}setting5: {\n` +
`${' '.repeat(12)}key5: value5\n` +
`${' '.repeat(8)}}\n` +
`${' '.repeat(4)}}\n` +
`${' '.repeat(2)}+ group1: {\n` +
`${' '.repeat(8)}foo: bar\n` +
`${' '.repeat(8)}baz: bars\n` +
`${' '.repeat(4)}}\n` +
`${' '.repeat(2)}+ group3: {\n` +
`${' '.repeat(8)}fee: 100500\n` +
`${' '.repeat(4)}}\n` +
'}';

describe(`diff in composite ${ext1}`, () => {
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

describe(`diff in composite ${ext2}`, () => {
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
