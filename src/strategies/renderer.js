import _ from 'lodash';

const renderToTree = (ast, deepLvl) => {
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
    const { children } = node;
    const item = children || value;
    switch (type) {
      case 'nested':
        return `${' '.repeat(4 + addSpaces)}${key}: ${renderToTree(children, deepLvl + 1)}`;
      case 'unchanged':
        return `${' '.repeat(4 + addSpaces)}${key}: ${valueToString(item, deepLvl + 1)}`;
      case 'changed':
        return `${' '.repeat(2 + addSpaces)}- ${key}: ${children.old}\n${' '.repeat(2 +
          addSpaces)}+ ${key}: ${children.new}`;
      case 'deleted':
        return `${' '.repeat(2 + addSpaces)}- ${key}: ${valueToString(item, deepLvl + 1)}`;
      case 'added':
        return `${' '.repeat(2 + addSpaces)}+ ${key}: ${valueToString(item, deepLvl + 1)}`;
      default:
        throw new Error('Type of this property does not exist');
    }
  };

  const result = ast.reduce((acc, node) =>
    [...acc, `${nodeToString(node, deepLvl)}\n`].join(''), '');
  return `{\n${result}${' '.repeat(addSpaces)}}`;
};

const renderToPlain = (ast) => {
  const nodeToPlain = (node, parents = []) => {
    const { key, type, value } = node;
    const { children } = node;
    const item = children || value;
    const nodeName = [...parents, key].join('.');
    switch (type) {
      case 'nested':
        return item.map(child => nodeToPlain(child, [...parents, nodeName]))
          .filter(line => line).join('\n');
      case 'unchanged':
        return '';
      case 'changed':
        return `Property '${nodeName}' was updated. From '${children.old}' to '${children.new}'`;
      case 'deleted':
        return `Property '${nodeName}' was removed`;
      case 'added':
        return `Property '${nodeName}' was added with ${_.isObject(item) ?
          'complex value' : `'${item}'`}`;
      default:
        throw new Error('Type of this property does not exist');
    }
  };

  return ast.map(nodeToPlain).filter(line => line).join('\n');
};

const renderToJson = ast => JSON.stringify(ast);

const renderTypes = {
  tree: renderToTree,
  plain: renderToPlain,
  json: renderToJson,
};

export default (type) => {
  if (!renderTypes[type]) {
    throw new Error('You change not exists format of output! Try more with another.');
  }
  return renderTypes[type];
};
