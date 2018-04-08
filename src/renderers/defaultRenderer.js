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
  complex: (acc, indent, key) =>
    `${acc}$\n${' '.repeat(indent)}${key}: {`,
  unchanged: (acc, indent, key, firstVal) =>
    `${acc}\n${' '.repeat(indent)}${key}: ${firstVal}`,
  changed: (acc, indent, key, firstVal, secondVal) =>
    `${acc}\n${' '.repeat(indent - (tab / 2))}+ ${key}: ${secondVal}\n${' '.repeat(indent - (tab / 2))}- ${key}: ${firstVal}`,
  deleted: (acc, indent, key, firstVal) =>
    `${acc}\n${' '.repeat(indent - (tab / 2))}- ${key}: ${firstVal}`,
  added: (acc, indent, key, firstVal, secondVal) =>
    `${acc}\n${' '.repeat(indent - (tab / 2))}+ ${key}: ${secondVal}`,
};

const defaultRender = (astConfigTree, indent = 0) => {
  const iter = (astTree, iterIndent, acc) => {
    const {
      key, type, beforeValue, afterValue, children,
    } = astTree;
    const activity = activities[type];
    if (type === 'head' || type === 'complex') {
      const newAcc = type === 'head' ? acc : activity(acc, iterIndent, key);
      const preRes = children
        .reduce((redAcc, child) => iter(child, iterIndent + tab, redAcc), newAcc);
      return `${preRes}\n${' '.repeat(iterIndent)}}`;
    }
    if (_.isObject(beforeValue)) {
      return activity(acc, iterIndent, key, stringify(beforeValue, iterIndent), afterValue);
    }
    if (_.isObject(afterValue)) {
      return activity(acc, iterIndent, key, beforeValue, stringify(afterValue, iterIndent));
    }
    return activity(acc, iterIndent, key, beforeValue, afterValue);
  };
  const result = iter(astConfigTree, indent, '{');
  return result;
};

export default defaultRender;
