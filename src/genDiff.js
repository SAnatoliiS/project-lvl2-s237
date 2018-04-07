import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { safeLoad as parseYaml } from 'js-yaml';
import { decode as parseIni } from 'ini';
import renderer from './renderers';

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

const astBuilder = (beforeConfig, afterConfig) =>
  _.union(Object.keys(beforeConfig), Object.keys(afterConfig))
    .reduce((acc, key) => {
      const beforeValue = beforeConfig[key];
      const afterValue = afterConfig[key];
      const child = {
        key,
        label: '',
        beforeValue,
        afterValue,
        children: [],
      };
      if (_.has(beforeConfig, key)) {
        if (_.has(afterConfig, key)) {
          if (_.isObject(beforeValue) && _.isObject(afterValue)) {
            child.label = 'complex';
            child.children = [...astBuilder(beforeValue, afterValue).children];
            return { ...acc, children: _.concat(acc.children, child) };
          } else if (beforeValue === afterValue) {
            child.label = 'unchanged';
            return { ...acc, children: _.concat(acc.children, child) };
          }
          child.label = 'changed';
          return { ...acc, children: _.concat(acc.children, child) };
        }
        child.label = 'deleted';
        return { ...acc, children: _.concat(acc.children, child) };
      }
      child.label = 'added';
      return { ...acc, children: _.concat(acc.children, child) };
    }, { label: 'head', children: [] });

export default function gendiff(firstConfig, secondConfig) {
  const parser = getParser(fileReader);

  const firstConfigParsed = parser(firstConfig);
  const secondConfigParsed = parser(secondConfig);

  const astDiff = astBuilder(firstConfigParsed, secondConfigParsed);
  const diff = renderer(astDiff);
  return diff;
}
