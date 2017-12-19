// @flow
import fs from 'fs';
import _ from 'lodash';

const propertyActions = [
  {
    type: 'unchanged',
    check: (key, obj1, obj2) => {
      const result = (obj1[key] && obj2[key])
        && obj1[key] === obj2[key];
      return result;
    },
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) => {
      const result = (obj1[key] && obj2[key])
      && obj1[key] !== obj2[key];
      return result;
    },
  },
  {
    type: 'deleted',
    check: (key, obj1, obj2) => {
      const result = obj1[key] && !obj2[key];
      return result;
    },
  },
  {
    type: 'added',
    check: (key, obj1, obj2) => {
      const result = obj2[key] && !obj1[key];
      return result;
    },
  },
];

const propertyToString = (type, key, obj1, obj2) => {
  switch (type) {
    case 'unchanged':
      return `    ${key}: ${obj1[key]}`;
    case 'changed':
      return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
    case 'deleted':
      return `  - ${key}: ${obj1[key]}`;
    case 'added':
      return `  + ${key}: ${obj2[key]}`;
    default:
      return 'unknown type';
  }
};

const getPropertyAction = (key, obj1, obj2) =>
  _.find(propertyActions, ({ check }) => check(key, obj1, obj2));

export default (pathToFile1, pathToFile2) => {
  const obj1 = JSON.parse(fs.readFileSync(pathToFile1, 'utf-8'));
  const obj2 = JSON.parse(fs.readFileSync(pathToFile2, 'utf-8'));
  const keysSet = Object.keys(obj1).concat(Object.keys(obj2));
  const uniqueKeys = _.uniq(keysSet);
  const differences = uniqueKeys.reduce((acc, key) => {
    const { type } = getPropertyAction(key, obj1, obj2);
    return acc.concat(`${propertyToString(type, key, obj1, obj2)}\n`);
  }, '');
  return `{\n${differences}}`;
};
