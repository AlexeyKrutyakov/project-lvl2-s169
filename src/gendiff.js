// @flow
import fs from 'fs';
import _ from 'lodash';

const propertyActions = [
  {
    type: 'unchanged',
    toString: (key, obj) => `    ${key}: ${obj[key]}`,
    check: (key, obj1, obj2) => {
      const result = (obj1[key] && obj2[key])
        && obj1[key] === obj2[key];
      return result;
    },
  },
  {
    type: 'changed',
    toString: (key, obj1, obj2) =>
      `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`,
    check: (key, obj1, obj2) => {
      const result = (obj1[key] && obj2[key])
      && obj1[key] !== obj2[key];
      return result;
    },
  },
  {
    type: 'deleted',
    toString: (key, obj) => `  - ${key}: ${obj[key]}`,
    check: (key, obj1, obj2) => {
      const result = obj1[key] && !obj2[key];
      return result;
    },
  },
  {
    type: 'added',
    toString: (key, obj1, obj2) => `  + ${key}: ${obj2[key]}`,
    check: (key, obj1, obj2) => {
      const result = obj2[key] && !obj1[key];
      return result;
    },
  },
];

const getPropertyAction = (key, object1, object2) =>
  _.find(propertyActions, ({ check }) => check(key, object1, object2));

export default (pathToFile1, pathToFile2) => {
  const data1 = JSON.parse(fs.readFileSync(pathToFile1, 'utf-8'));
  const data2 = JSON.parse(fs.readFileSync(pathToFile2, 'utf-8'));
  const keysSet = Object.keys(data1).concat(Object.keys(data2));
  const filteredKeysSet = keysSet.reduce((acc, key) => {
    const result = acc.includes(key) ? acc : acc.concat(key);
    return result;
  }, []);
  const differences = filteredKeysSet.reduce((acc, key) => {
    const { toString } = getPropertyAction(key, data1, data2);
    return acc.concat(`${toString(key, data1, data2)}\n`);
  }, '');
  return `{\n${differences}}`;
};
