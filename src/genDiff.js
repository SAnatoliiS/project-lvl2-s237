import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { safeLoad } from 'js-yaml';
import ini from 'ini';
import render from './renderers';

const parsers = {
  '.json': JSON.parse,
  '.yaml': safeLoad,
  '.yml': safeLoad,
  '.ini': ini.parse,
};

const readConfig = filePath => fs.readFileSync(filePath, 'UTF-8');

const getParser = extractor => (config) => {
  const ext = path.extname(config);
  const configParsed = parsers[ext](extractor(config));
  if (!configParsed) throw new Error(`unkown format: ${ext}`);
  return configParsed;
};

const buildAst = (beforeConfig, afterConfig) =>
  _.union(Object.keys(beforeConfig), Object.keys(afterConfig))
    .reduce((acc, key) => {
      const beforeValue = beforeConfig[key];
      const afterValue = afterConfig[key];
      const child = {
        key,
        type: '',
        beforeValue,
        afterValue,
        children: [],
      };
      if (_.has(beforeConfig, key)) {
        if (_.has(afterConfig, key)) {
          if (_.isObject(beforeValue) && _.isObject(afterValue)) {
            const newChild = {
              ...child,
              type: 'complex',
              children: buildAst(beforeValue, afterValue),
            };
            return [...acc, newChild];
          } else if (beforeValue === afterValue) {
            const newChild = {
              ...child,
              type: 'unchanged',
            };
            return [...acc, newChild];
          }
          const newChild = {
            ...child,
            type: 'changed',
          };
          return [...acc, newChild];
        }
        const newChild = {
          ...child,
          type: 'deleted',
        };
        return [...acc, newChild];
      }
      const newChild = {
        ...child,
        type: 'added',
      };
      return [...acc, newChild];
    }, []);

export default function gendiff(firstConfig, secondConfig, formatType = 'default') {
  const parse = getParser(readConfig);

  const firstConfigParsed = parse(firstConfig);
  const secondConfigParsed = parse(secondConfig);

  const astDiff = buildAst(firstConfigParsed, secondConfigParsed);
  const diff = render(astDiff, formatType);
  return diff;
}
