import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { safeLoad } from 'js-yaml';

const parsers = {
  '.json': JSON.parse,
  '.yaml': safeLoad,
  '.yml': safeLoad,
};

const getObject = (config) => {
  const ext = path.extname(config);
  const configAsObj = parsers[ext](fs.readFileSync(config));
  if (!configAsObj) throw new Error(`unkown format: ${ext}`);
  return configAsObj;
};

export default function gendiff(firstConfig, secondConfig) {
  const firstConfigAsObj = getObject(firstConfig);
  const secondConfigAsObj = getObject(secondConfig);

  const preResult = Object.keys(firstConfigAsObj).reduce((acc, key) => {
    const firstValue = firstConfigAsObj[key];
    const secondValue = secondConfigAsObj[key];
    if (_.has(secondConfigAsObj, key)) {
      if (firstValue === secondValue) {
        return `${acc}\n    ${key}: ${firstValue}`;
      }
      return `${acc}\n  + ${key}: ${secondValue}\n  - ${key}: ${firstValue}`;
    }
    return `${acc}\n  - ${key}: ${firstValue}`;
  }, '{');
  const result = Object.keys(secondConfigAsObj).reduce((acc, key) => {
    if (_.has(firstConfigAsObj, key)) return acc;
    return `${acc}\n  + ${key}: ${secondConfigAsObj[key]}`;
  }, preResult);
  return `${result}\n}`;
}
