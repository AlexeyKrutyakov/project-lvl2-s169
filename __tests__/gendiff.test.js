import gendiff from '../src';

const fixturesPath = './__tests__/__fixtures__/';
const file1 = `${fixturesPath}before`;
const file2 = `${fixturesPath}after`;
const file3 = `${fixturesPath}empty`;

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

describe('diff in JSON', () => {
  it('#before.json -> after.json', () => {
    expect(gendiff(`${file1}.json`, `${file2}.json`)).toBe(expected1);
  });

  it('#before.json -> empty.json', () => {
    expect(gendiff(`${file1}.json`, `${file3}.json`)).toBe(expected2);
  });

  it('#empty.json -> after.json', () => {
    expect(gendiff(`${file3}.json`, `${file2}.json`)).toBe(expected3);
  });
});

describe('diff in YAML', () => {
  it('#before.yaml -> after.yaml', () => {
    expect(gendiff(`${file1}.yaml`, `${file2}.yaml`)).toBe(expected1);
  });

  it('#before.yaml -> empty.yaml', () => {
    expect(gendiff(`${file1}.yaml`, `${file3}.yaml`)).toBe(expected2);
  });

  it('#empty.yaml -> after.yaml', () => {
    expect(gendiff(`${file3}.yaml`, `${file2}.yaml`)).toBe(expected3);
  });
});

describe('diff in INI', () => {
  it('#before.ini -> after.ini', () => {
    expect(gendiff(`${file1}.ini`, `${file2}.ini`)).toBe(expected1);
  });

  it('#before.ini -> empty.ini', () => {
    expect(gendiff(`${file1}.ini`, `${file3}.ini`)).toBe(expected2);
  });

  it('#empty.ini -> after.ini', () => {
    expect(gendiff(`${file3}.ini`, `${file2}.ini`)).toBe(expected3);
  });
});
