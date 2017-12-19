import gendiff from '../src';

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
  const file1 = './__tests__/__fixtures__/before.json';
  const file2 = './__tests__/__fixtures__/after.json';
  const file3 = './__tests__/__fixtures__/empty.json';

  it('#before.json -> after.json', () => {
    expect(gendiff(file1, file2)).toBe(expected1);
  });

  it('#before.json -> empty.json', () => {
    expect(gendiff(file1, file3)).toBe(expected2);
  });

  it('#empty.json -> after.json', () => {
    expect(gendiff(file3, file2)).toBe(expected3);
  });
});

describe('diff in YAML', () => {
  const file1 = './__tests__/__fixtures__/before.yaml';
  const file2 = './__tests__/__fixtures__/after.yaml';
  const file3 = './__tests__/__fixtures__/empty.yaml';

  it('#before.yaml -> after.yaml', () => {
    expect(gendiff(file1, file2)).toBe(expected1);
  });

  it('#before.yaml -> empty.yaml', () => {
    expect(gendiff(file1, file3)).toBe(expected2);
  });

  it('#empty.yaml -> after.yaml', () => {
    expect(gendiff(file3, file2)).toBe(expected3);
  });
});

describe('diff in INI', () => {
  const file1 = './__tests__/__fixtures__/before.ini';
  const file2 = './__tests__/__fixtures__/after.ini';
  const file3 = './__tests__/__fixtures__/empty.ini';

  it('#before.ini -> after.ini', () => {
    expect(gendiff(file1, file2)).toBe(expected1);
  });

  it('#before.ini -> empty.ini', () => {
    expect(gendiff(file1, file3)).toBe(expected2);
  });

  it('#empty.ini -> after.ini', () => {
    expect(gendiff(file3, file2)).toBe(expected3);
  });
});
