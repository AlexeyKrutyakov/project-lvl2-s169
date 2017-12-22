import yaml from 'js-yaml';
import ini from 'ini';

const parseBy = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (rawData, extension) => parseBy[extension](rawData);
