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
    `\n${' '.repeat(indent)}${key}: {`,
  unchanged: (indent, key, firstVal) =>
    `\n${' '.repeat(indent)}${key}: ${firstVal}`,
  changed: (indent, key, firstVal, secondVal) =>
    `\n${' '.repeat(indent - (tab / 2))}+ ${key}: ${secondVal}\n${' '.repeat(indent - (tab / 2))}- ${key}: ${firstVal}`,
  deleted: (indent, key, firstVal) =>
    `\n${' '.repeat(indent - (tab / 2))}- ${key}: ${firstVal}`,
  added: (indent, key, firstVal, secondVal) =>
    `\n${' '.repeat(indent - (tab / 2))}+ ${key}: ${secondVal}`,
};

const defaultRenderer = (astConfigTree, indent = 0) => {
  const iter = (astTree, iterIndent, acc) => {
    const {
      key, label, beforeValue, afterValue, children,
    } = astTree;
    const activity = activities[label];
    if (children.length > 0) {
      const newAcc = label === 'head' ? acc : `${acc}${activity(iterIndent, key)}`;
      const preRes = children
        .reduce((redAcc, child) => iter(child, iterIndent + tab, redAcc), newAcc);
      return `${preRes}\n${' '.repeat(iterIndent)}}`;
    }
    if (_.isObject(beforeValue)) {
      return `${acc}${activity(iterIndent, key, stringify(beforeValue, iterIndent), afterValue)}`;
    }
    if (_.isObject(afterValue)) {
      return `${acc}${activity(iterIndent, key, beforeValue, stringify(afterValue, iterIndent))}`;
    }
    return `${acc}${activity(iterIndent, key, beforeValue, afterValue)}`;
  };
  const result = iter(astConfigTree, indent, '{');
  return result;
};

export default defaultRenderer;
