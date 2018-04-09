import _ from 'lodash';

const activities = {
  complex: (path, beforeValue, afterValue, render, children) => render(children, path),
  changed: (path, beforeValue, afterValue) =>
    `Property '${path}' was updated. From '${beforeValue}' to '${afterValue}'`,
  deleted: path => `Property '${path}' was removed`,
  added: (path, beforeValue, afterValue) => `Property '${path}' was added with value: ${afterValue}`,
};

const getStringValue = value => (_.isObject(value) ? 'complex value' : `${value}`);


const render = (astConfigTree, path) => {
  const difference = astConfigTree.filter(node => node.type !== 'unchanged').map((node) => {
    const {
      key, type, beforeValue, afterValue, children,
    } = node;
    const fullPath = path === '' ? key : `${path}.${key}`;
    const firstStringValue = getStringValue(beforeValue);
    const secondStringValue = getStringValue(afterValue);
    return activities[type](fullPath, firstStringValue, secondStringValue, render, children);
  });
  return _.flatten(difference);
};

export default astConfigTree => render(astConfigTree, '').join('\n');
