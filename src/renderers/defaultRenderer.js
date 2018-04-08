import _ from 'lodash';

const tab = 4;

const stringify = (obj, indent) => {
  const preResult = Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (_.isObject(value)) return stringify(value, indent + tab);
    return `${acc}\n${' '.repeat(indent + tab)}${key}: ${value}`;
  }, '{');
  return `${preResult}\n${' '.repeat(indent)}}`;
};

const activities = {
  complex: (indent, key) =>
    `${' '.repeat(indent)}${key}: {`,
  unchanged: (indent, key, firstVal) =>
    `${' '.repeat(indent)}${key}: ${firstVal}`,
  changed: (indent, key, firstVal, secondVal) =>
    [`${' '.repeat(indent - (tab / 2))}+ ${key}: ${secondVal}`,
      `${' '.repeat(indent - (tab / 2))}- ${key}: ${firstVal}`],
  deleted: (indent, key, firstVal) =>
    `${' '.repeat(indent - (tab / 2))}- ${key}: ${firstVal}`,
  added: (indent, key, firstVal, secondVal) =>
    `${' '.repeat(indent - (tab / 2))}+ ${key}: ${secondVal}`,
};

const render = (astConfigTree, indent) => {
  const difference = astConfigTree.map((node) => {
    const {
      key, type, beforeValue, afterValue, children,
    } = node;
    const activity = activities[type];
    if (type === 'complex') {
      const preRes = render(children, indent + tab);
      return _.concat(activity(indent, key), preRes, `${' '.repeat(indent)}}`);
    }
    const simpleBeforeValue = _.isObject(beforeValue) ?
      stringify(beforeValue, indent) : beforeValue;
    const simpleAfterValue = _.isObject(afterValue) ?
      stringify(afterValue, indent) : afterValue;
    return activity(indent, key, simpleBeforeValue, simpleAfterValue);
  });
  return _.flatten(difference);
};

export default astConfigTree => _.concat('{', render(astConfigTree, tab), '}').join('\n');

