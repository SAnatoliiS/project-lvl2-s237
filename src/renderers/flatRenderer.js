import _ from 'lodash';

const activities = {
  changed: (path, beforeValue, afterValue) => {
    const firstVal = _.isObject(beforeValue) ? 'complex value' : `${beforeValue}`;
    const secondVal = _.isObject(afterValue) ? 'complex value' : `${afterValue}`;
    return `Property '${path}' was updated. From '${firstVal}' to '${secondVal}'`;
  },
  deleted: path => `Property '${path}' was removed`,
  added: (path, beforeValue, afterValue) => {
    const secondVal = _.isObject(afterValue) ? 'complex value' : `value: ${afterValue}`;
    return `Property '${path}' was added with ${secondVal}`;
  },
};

const render = (astConfigTree, path) => {
  const difference = astConfigTree.filter(node => node.type !== 'unchanged').map((node) => {
    const {
      key, type, beforeValue, afterValue, children,
    } = node;
    const fullPath = path === '' ? key : `${path}.${key}`;
    if (type === 'complex') return render(children, fullPath);
    return activities[type](fullPath, beforeValue, afterValue);
  });
  return _.flatten(difference);
};

export default astConfigTree => render(astConfigTree, '').join('\n');
