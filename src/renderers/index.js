// @flow

import tree from './toTree';
import plain from './toPlain';
import json from './toJson';

const renderTypes = { tree, plain, json };

export default (type) => {
  if (!renderTypes[type]) {
    throw new Error('You change not exists format of output! Try more with another.');
  }
  return renderTypes[type];
};
