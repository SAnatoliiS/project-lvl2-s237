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

export default function gendiff(firstConfig, secondConfig) {
  const parser = getParser(fileReader);

  const firstConfigParsed = parser(firstConfig);
  const secondConfigParsed = parser(secondConfig);

  const preResult = _.union(Object.keys(firstConfigParsed), Object.keys(secondConfigParsed))
    .reduce((acc, key) => {
      const firstValue = firstConfigParsed[key];
      const secondValue = secondConfigParsed[key];
      if (_.has(firstConfigParsed, key)) {
        if (_.has(secondConfigParsed, key)) {
          if (firstValue === secondValue) {
            return `${acc}\n    ${key}: ${firstValue}`;
          }
          return `${acc}\n  + ${key}: ${secondValue}\n  - ${key}: ${firstValue}`;
        }
        return `${acc}\n  - ${key}: ${firstValue}`;
      }
      return `${acc}\n  + ${key}: ${secondValue}`;
    }, '{');
  const result = `${preResult}\n}`;
  return result;
}
