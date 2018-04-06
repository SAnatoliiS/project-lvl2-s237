import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { safeLoad as parseYaml } from 'js-yaml';
import { decode as parseIni } from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yaml': parseYaml,
  '.yml': parseYaml,
  '.ini': parseIni,
};

const fileReader = filePath => fs.readFileSync(filePath, 'UTF-8');

const getParser = extractor => (config) => {
  const ext = path.extname(config);
  const configParsed = parsers[ext](extractor(config));
  if (!configParsed) throw new Error(`unkown format: ${ext}`);
  return configParsed;
};

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
  unchanged: (indent, key, firstVal) =>
    `\n${' '.repeat(indent)}${key}: ${firstVal}`,
  changed: (indent, key, firstVal, secondVal) =>
    `\n${' '.repeat(indent - (tab / 2))}+ ${key}: ${secondVal}\n${' '.repeat(indent - (tab / 2))}- ${key}: ${firstVal}`,
  delete: (indent, key, firstVal) =>
    `\n${' '.repeat(indent - (tab / 2))}- ${key}: ${firstVal}`,
  add: (indent, key, firstVal, secondVal) =>
    `\n${' '.repeat(indent - (tab / 2))}+ ${key}: ${secondVal}`,
};

const astBuilder = (beforeConfig, afterConfig) =>
  _.union(Object.keys(beforeConfig), Object.keys(afterConfig))
    .reduce((acc, key) => {
      const beforeValue = beforeConfig[key];
      const afterValue = afterConfig[key];
      if (_.has(beforeConfig, key)) {
        if (_.has(afterConfig, key)) {
          if (_.isObject(beforeValue) && _.isObject(afterValue)) {
            return { ...acc, [key]: astBuilder(beforeValue, afterValue) };
          } else if (beforeValue === afterValue) {
            return { ...acc, [key]: 'unchanged' };
          }
          return { ...acc, [key]: 'changed' };
        }
        return { ...acc, [key]: 'delete' };
      }
      return { ...acc, [key]: 'add' };
    }, {});

const renderer = (astConfigTree, beforeConfig, afterConfig, indent = tab) => {
  const preResult = Object.keys(astConfigTree).reduce((acc, key) => {
    const firstValue = beforeConfig[key];
    const secondValue = afterConfig[key];
    const astNode = astConfigTree[key];
    if (_.isObject(astNode)) {
      return `${acc}\n${' '.repeat(indent)}${key}: ${renderer(astNode, firstValue, secondValue, indent + tab)}`;
    }
    const activity = activities[astNode];
    if (_.isObject(firstValue)) {
      return `${acc}${activity(indent, key, stringify(firstValue, indent), secondValue)}`;
    }
    if (_.isObject(secondValue)) {
      return `${acc}${activity(indent, key, firstValue, stringify(secondValue, indent))}`;
    }
    return `${acc}${activity(indent, key, firstValue, secondValue)}`;
  }, '{');
  const result = `${preResult}\n${' '.repeat(indent - 4)}}`;
  return result;
};

export default function gendiff(firstConfig, secondConfig) {
  const parser = getParser(fileReader);

  const firstConfigParsed = parser(firstConfig);
  const secondConfigParsed = parser(secondConfig);

  const astDiff = astBuilder(firstConfigParsed, secondConfigParsed);
  console.log(astDiff.toString());
  const diff = renderer(astDiff, firstConfigParsed, secondConfigParsed);
  return diff;
}
