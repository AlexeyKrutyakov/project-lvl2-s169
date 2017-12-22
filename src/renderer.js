import _ from 'lodash';

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
      case 'unchanged':
        return `${' '.repeat(4 + addSpaces)}${key}: ${valueToString(value, deepLvl + 1)}`;
      case 'changed':
        return `${' '.repeat(2 + addSpaces)}- ${key}: ${value.old}\n${' '.repeat(2 +
          addSpaces)}+ ${key}: ${value.new}`;
      case 'deleted':
        return `${' '.repeat(2 + addSpaces)}- ${key}: ${valueToString(value, deepLvl + 1)}`;
      case 'added':
        return `${' '.repeat(2 + addSpaces)}+ ${key}: ${valueToString(value, deepLvl + 1)}`;
      default:
        return 'unknown type';
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

export default astToString;
