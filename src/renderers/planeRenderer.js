import _ from 'lodash';

const activities = {
  complex: (path, beforeValue, afterValue, render, children) => render(children, path),
  changed: (path, beforeValue, afterValue) =>
    `Property '${path}' was updated. From '${beforeValue}' to '${afterValue}'`,
  deleted: path => `Property '${path}' was removed`,
  added: (path, beforeValue, afterValue) => `Property '${path}' was added with value: ${afterValue}`,
};

const getSimpleValue = value => (_.isObject(value) ? 'complex value' : `${value}`);


const render = (astConfigTree, path) => {
  const difference = astConfigTree.filter(node => node.type !== 'unchanged').map((node) => {
    const {
      key, type, beforeValue, afterValue, children,
    } = node;
    const fullPath = path === '' ? key : `${path}.${key}`;
    const firstSimpleValue = getSimpleValue(beforeValue);
    const secondSimpleValue = getSimpleValue(afterValue);
    return activities[type](fullPath, firstSimpleValue, secondSimpleValue, render, children);
  });
  return _.flatten(difference);
};

export default astConfigTree => render(astConfigTree, '').join('\n');
