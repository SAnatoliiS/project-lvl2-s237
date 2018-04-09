import _ from 'lodash';

const tab = 2;

const addTab = indent => `${' '.repeat(indent + tab)}`;

const stringify = (obj, indent) => {
  const preResult = Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (_.isObject(value)) return stringify(value, indent + tab);
    return `${acc}\n${' '.repeat(indent + (tab * 2))}"${key}": "${value}"`;
  }, '{');
  return `${preResult}\n${addTab(indent)}}`;
};

const getSimpleValue = (value, indent) =>
  (_.isObject(value) ? stringify(value, indent) : `"${value}"`);

const getOpenedKey = (indent, key) => `${' '.repeat(indent)}"${key}": {`;
const getClosedBrace = indent => `${' '.repeat(indent)}}`;

const activities = {
  complex: (indent, key, firstVal, secondVal, children, render) =>
    [
      getOpenedKey(indent, key),
      render(children, indent + tab),
      getClosedBrace(indent),
    ].join('\n'),
  unchanged: (indent, key, firstVal) =>
    [
      getOpenedKey(indent, key),
      `${addTab(indent)}"type": "unchanged",`,
      `${addTab(indent)}"value": ${firstVal}`,
      getClosedBrace(indent),
    ].join('\n'),
  changed: (indent, key, firstVal, secondVal) =>
    [
      getOpenedKey(indent, key),
      `${addTab(indent)}"type": "changed",`,
      `${addTab(indent)}"last value": ${firstVal},`,
      `${addTab(indent)}"value": ${secondVal}`,
      getClosedBrace(indent),
    ].join('\n'),
  deleted: (indent, key) =>
    [
      `${' '.repeat(indent)}"${key}": "deleted"`,
    ],
  added: (indent, key, firstVal, secondVal) =>
    [
      getOpenedKey(indent, key),
      `${addTab(indent)}"type": "added",`,
      `${addTab(indent)}"value": ${secondVal}`,
      getClosedBrace(indent),
    ].join('\n'),
};

const render = (astConfigTree, indent) => {
  const difference = astConfigTree.map((node) => {
    const {
      key, type, beforeValue, afterValue, children,
    } = node;
    const simpleBeforeValue = getSimpleValue(beforeValue, indent);
    const simpleAfterValue = getSimpleValue(afterValue, indent);
    const activity = activities[type];
    return activity(indent, key, simpleBeforeValue, simpleAfterValue, children, render);
  });
  return difference.join(',\n');
};

export default astConfigTree => `{\n${render(astConfigTree, tab)}\n}`;
