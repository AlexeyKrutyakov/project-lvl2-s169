import gendiff from '../src/..';

describe('gendiff', () => {
  const file1 = './__tests__/__fixtures__/before.json';
  const file2 = './__tests__/__fixtures__/after.json';
  const file3 = './__tests__/__fixtures__/empty.json';

  it('#before.json -> after.json', () => {
    const expected1 = '{\n' +
      '    host: hexlet.io\n' +
      '  - timeout: 50\n' +
      '  + timeout: 20\n' +
      '  - proxy: 123.234.53.22\n' +
      '  + verbose: true\n}';
    expect(gendiff(file1, file2)).toBe(expected1);
  });

  it('#before.json -> empty.json', () => {
    const expected2 = '{\n' +
      '  - host: hexlet.io\n' +
      '  - timeout: 50\n' +
      '  - proxy: 123.234.53.22\n}';
    expect(gendiff(file1, file3)).toBe(expected2);
  });

  it('#empty.json -> after.json', () => {
    const expected3 = '{\n' +
    '  + timeout: 20\n' +
    '  + verbose: true\n' +
    '  + host: hexlet.io\n}';
    expect(gendiff(file3, file2)).toBe(expected3);
  });
});
