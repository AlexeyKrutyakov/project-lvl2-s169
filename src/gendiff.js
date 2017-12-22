// @flow
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parseBy = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parseData = (rawData, extension) => parseBy[extension](rawData);

const createObjFromFile = (filepath) => {
  const rawData = fs.readFileSync(filepath, 'utf-8');
  const fileExtension = path.parse(filepath).ext;
  return parseData(rawData, fileExtension);
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
  const iter = (acc, restKeys) => {
    if (restKeys.length === 0) {
      return acc;
    }
    const key = restKeys[0];
    const { type, process } = getPropertyAction(key, obj1, obj2);
    return iter(
      [...acc,
        {
          type,
          key,
          value: process(obj1[key], obj2[key], buildAst),
        },
      ],
      restKeys.slice(1),
    );
  };
  return iter([], keys);
};

const astToString = (ast, deepLvl) => {
  const addSpaces = deepLvl * 4;

  const valueToString = (value, deep) => {
    const spaces = deep * 4;
    if (!_.isObject(value)) {
      return value;
    }
    const keys = _.keys(value);
    const result = keys.reduce((acc, key) => {
      if (!_.isObject(value[key])) {
        return [...acc, `${' '.repeat(4 + spaces)}${key}: ${value[key]}\n`];
      }
      return [...acc, `${' '.repeat(4 + spaces)}${key}: ${valueToString(value[key], deep + 1)}\n`];
    }, '');
    return `{\n${result.join('')}${' '.repeat(spaces)}}`;
  };

  const nodeToString = (node) => {
    const { type, key, value } = node;
    switch (type) {
      case 'nested':
        return `${' '.repeat(4 + addSpaces)}${key}: ${astToString(value, deepLvl + 1)}`;
      case 'changed':
        return `${' '.repeat(2 + addSpaces)}- ${key}: ${value.old}\n${' '.repeat(2 +
          addSpaces)}+ ${key}: ${value.new}`;
      case 'deleted':
        return `${' '.repeat(2 + addSpaces)}- ${key}: ${valueToString(value, deepLvl + 1)}`;
      case 'added':
        return `${' '.repeat(2 + addSpaces)}+ ${key}: ${valueToString(value, deepLvl + 1)}`;
      default:
        return `${' '.repeat(4 + addSpaces)}${key}: ${valueToString(value, deepLvl + 1)}`;
    }
  };

  const iter = (acc, restNodes) => {
    if (restNodes.length === 0) {
      return acc;
    }
    const node = restNodes[0];
    return iter([...acc, `${nodeToString(node, deepLvl)}\n`].join(''), restNodes.slice(1));
  };
  return `{\n${iter('', ast)}${' '.repeat(addSpaces)}}`;
};

export default (pathToFile1, pathToFile2) => {
  const obj1 = createObjFromFile(pathToFile1);
  const obj2 = createObjFromFile(pathToFile2);
  const ast = buildAst(obj1, obj2);
  return astToString(ast, 0);
};
