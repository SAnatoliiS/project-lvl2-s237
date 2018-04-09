import _ from 'lodash';

const stringify = (obj) => {
  const preResult = Object.keys(obj).map((key) => {
    const value = obj[key];
    if (_.isObject(value)) return `"${key}": ${stringify(value)}`;
    return `"${key}": "${value}"`;
  }).join(', ');
  return `{ ${preResult} }`;
};

const getSimpleValue = value =>
  (_.isObject(value) ? stringify(value) : `"${value}"`);

const render = (astConfigTree) => {
  const difference = astConfigTree.map((node) => {
    const {
      key, type, beforeValue, afterValue, children,
    } = node;
    const simpleBeforeValue = getSimpleValue(beforeValue);
    const simpleAfterValue = getSimpleValue(afterValue);
    //    const activity = activities[type];
    //    if (type === 'complex') return
    const preRes = [
      `"key": "${key}",`,
      `"type": "${type}",`,
      `"last value": ${simpleBeforeValue},`,
      `"new value": ${simpleAfterValue},`,
      `"children": ${type === 'complex' ? `[\n${render(children)}\n]` : '"[]"'}`,
    ].join('\n');
    return `{\n${preRes}\n}`;
  });
  return difference.join(',\n');
};

export default astConfigTree => `[\n${render(astConfigTree)}\n]`;
