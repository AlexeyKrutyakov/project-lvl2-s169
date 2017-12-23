import _ from 'lodash';

export default (ast) => {
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
