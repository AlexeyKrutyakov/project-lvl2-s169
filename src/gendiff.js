// @flow
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parser';
import render from './renderer';

const createObjFromFile = (filepath) => {
  const rawData = fs.readFileSync(filepath, 'utf-8');
  const fileExtension = path.parse(filepath).ext;
  return parse(rawData, fileExtension);
};

const propertyTypes = [
  {
    type: 'nested',
    check: (key, obj1, obj2) => _.isObject(obj1[key]) && _.isObject(obj2[key]),
    process: (obj1, obj2, func) => func(obj1, obj2),
  },
  {
    type: 'unchanged',
    check: (key, obj1, obj2) => (_.has(obj1, key) && _.has(obj2, key))
      && obj1[key] === obj2[key],
    process: obj1 => _.identity(obj1),
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) => (_.has(obj1, key) && _.has(obj2, key))
      && obj1[key] !== obj2[key],
    process: (obj1, obj2) => ({ old: obj1, new: obj2 }),
  },
  {
    type: 'deleted',
    check: (key, obj1, obj2) => _.has(obj1, key) && !_.has(obj2, key),
    process: obj1 => _.identity(obj1),
  },
  {
    type: 'added',
    check: (key, obj1, obj2) => !_.has(obj1, key) && _.has(obj2, key),
    process: (obj1, obj2) => _.identity(obj2),
  },
];

const getPropertyAction = (key, obj1, obj2) =>
  _.find(propertyTypes, ({ check }) => check(key, obj1, obj2));

const buildAst = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  return keys.map((key) => {
    const { type, process } = getPropertyAction(key, obj1, obj2);
    const value = process(obj1[key], obj2[key], buildAst);
    if (_.isObject(value)) {
      return { type, key, children: value };
    }
    return { type, key, value };
  });
};

export default (pathToFile1, pathToFile2, format = 'tree') => {
  const obj1 = createObjFromFile(pathToFile1);
  const obj2 = createObjFromFile(pathToFile2);
  const ast = buildAst(obj1, obj2);
  return render(format)(ast, 0);
};
