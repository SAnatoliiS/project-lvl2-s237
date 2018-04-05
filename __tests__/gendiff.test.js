import fs from 'fs';
import gendiff from '../src';


const example = fs.readFileSync('./__tests__/__fixtures__/result', 'utf-8');

test('gendiff(JSON)', () => {
  expect(gendiff(
    './__tests__/__fixtures__/before.json',
    './__tests__/__fixtures__/after.json',
  )).toBe(example);
});

test('gendiff(YAML)', () => {
  expect(gendiff(
    './__tests__/__fixtures__/before.yaml',
    './__tests__/__fixtures__/after.yaml',
  )).toBe(example);
});
