// @flow
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import YAML from 'js-yaml';
import INI from 'ini';

const parseBy = {
  '.json': JSON.parse,
  '.yml': YAML.safeLoad,
  '.yaml': YAML.safeLoad,
  '.ini': INI.parse,
};

const parseData = (rawData, extension) => parseBy[extension](rawData);

const createObjFromFile = (filepath) => {
  const rawData = fs.readFileSync(filepath, 'utf-8');
  const fileExtension = path.parse(filepath).ext;
  return parseData(rawData, fileExtension);
};

const propertyActions = [
  {
    type: 'unchanged',
    check: (key, obj1, obj2) => (obj1[key] && obj2[key])
      && obj1[key] === obj2[key],
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) => (obj1[key] && obj2[key])
      && obj1[key] !== obj2[key],
  },
  {
    type: 'deleted',
    check: (key, obj1, obj2) => obj1[key] && !obj2[key],
  },
  {
    type: 'added',
    check: (key, obj1, obj2) => obj2[key] && !obj1[key],
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
  const obj1 = createObjFromFile(pathToFile1);
  const obj2 = createObjFromFile(pathToFile2);
  const keysSet = Object.keys(obj1).concat(Object.keys(obj2));
  const uniqueKeys = _.uniq(keysSet);
  const differences = uniqueKeys.reduce((acc, key) => {
    const { type } = getPropertyAction(key, obj1, obj2);
    return [...acc, `${propertyToString(type, key, obj1, obj2)}\n`].join('');
  }, '');
  return `{\n${differences}}`;
};

// {
//   type: 'nested',
//   check: (first, second, key) => (first[key] instanceof Object && second[key] instanceof Object)
//     && !(first[key] instanceof Array && second[key] instanceof Array),
//   process: (first, second, fun) => fun(first, second),
// },
// {
//   type: 'not changed',
//   check: (first, second, key) => (_.has(first, key) && _.has(second, key)
//     && (first[key] === second[key])),
//   process: first => _.identity(first),
// },
// {
//   type: 'changed',
//   check: (first, second, key) => (_.has(first, key) && _.has(second, key)
//     && (first[key] !== second[key])),
//   process: (first, second) => ({ old: first, new: second }),
// },
// {
//   type: 'deleted',
//   check: (first, second, key) => (_.has(first, key) && !_.has(second, key)),
//   process: first => _.identity(first),
// },
// {
//   type: 'inserted',
//   check: (first, second, key) => (!_.has(first, key) && _.has(second, key)),
//   process: (first, second) => _.identity(second),
// },
// ];

// const getAst = (firstConfig = {}, secondConfig = {}) => {
// const configsKeys = _.union(Object.keys(firstConfig), Object.keys(secondConfig));
// return configsKeys.map((key) => {
//   const { type, process } = _.find(keyTypes, item => item.check(firstConfig, secondConfig, key));
//   const value = process(firstConfig[key], secondConfig[key], getAst);
//   return { name: key, type, value };
