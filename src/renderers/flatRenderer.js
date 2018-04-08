import _ from 'lodash';

const activities = {
  changed: (acc, key, beforeValue, afterValue) => {
    const firstVal = _.isObject(beforeValue) ? 'complex value' : `${beforeValue}`;
    const secondVal = _.isObject(afterValue) ? 'complex value' : `${afterValue}`;
    return `${acc}Property '${key}' was updated. From '${firstVal}' to '${secondVal}'\n`;
  },
  deleted: (acc, key) =>
    `${acc}Property '${key}' was removed\n`,
  added: (acc, key, beforeValue, afterValue) => {
    const secondVal = _.isObject(afterValue) ? 'complex value' : `value: ${afterValue}`;
    return `${acc}Property '${key}' was added with ${secondVal}\n`;
  },
};

const flatRenderer = (astConfigTree) => {
  const iter = (astTree, acc, path = '') => {
    const {
      key, type, beforeValue, afterValue, children,
    } = astTree;
    const fullPath = path === '' ? key : `${path}.${key}`;
    if (type === 'complex' || type === 'head') return children.reduce((redAcc, child) => iter(child, redAcc, fullPath), acc);
    if (type === 'unchanged') return acc;
    return activities[type](acc, fullPath, beforeValue, afterValue);
  };
  return iter(astConfigTree, '');
};

export default flatRenderer;
