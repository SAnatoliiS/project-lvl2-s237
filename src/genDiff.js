import _ from 'lodash';
import fs from 'fs';

function gendiff(firstConfig, secondConfig) {
  const firstConfigAsStr = fs.readFileSync(firstConfig, 'utf8');
  const secondConfigAsStr = fs.readFileSync(secondConfig);
  const firstConfigAsObj = JSON.parse(firstConfigAsStr);
  const secondConfigAsObj = JSON.parse(secondConfigAsStr);
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
export default gendiff;
