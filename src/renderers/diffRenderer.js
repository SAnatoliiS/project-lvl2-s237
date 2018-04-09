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

const getStringValue = (value, indent) => (_.isObject(value) ? stringify(value, indent) : value);

const activities = {
  complex: (indent, key, firstVal, secondVal, children, render) => {
    const preRes = render(children, indent + tab);
    const openedValue = `${' '.repeat(indent)}${key}: {`;
    const closedBrace = `${' '.repeat(indent)}}`;
    return [openedValue, ...preRes, closedBrace];
  },
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
    const stringBeforeValue = getStringValue(beforeValue, indent);
    const stringAfterValue = getStringValue(afterValue, indent);
    return activity(indent, key, stringBeforeValue, stringAfterValue, children, render);
  });
  return _.flatten(difference);
};

export default astConfigTree => _.concat('{', render(astConfigTree, tab), '}').join('\n');

