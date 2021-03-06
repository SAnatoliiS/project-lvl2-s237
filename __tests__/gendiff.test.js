import fs from 'fs';
import gendiff from '../src';


test('gendiff(JSON)', () => {
  const example = fs.readFileSync('./__tests__/__fixtures__/diffResult', 'utf-8');
  expect(gendiff(
    './__tests__/__fixtures__/before.json',
    './__tests__/__fixtures__/after.json',
  )).toBe(example);
});

test('planeDiff(JSON)', () => {
  const example = fs.readFileSync('./__tests__/__fixtures__/flatResult', 'utf-8');
  expect(gendiff(
    './__tests__/__fixtures__/before.json',
    './__tests__/__fixtures__/after.json',
    'plane',
  )).toBe(example);
});

test('jsonDiff(JSON)', () => {
  const example = fs.readFileSync('./__tests__/__fixtures__/jsonResult.json', 'utf-8');
  expect(gendiff(
    './__tests__/__fixtures__/before.json',
    './__tests__/__fixtures__/after.json',
    'json',
  )).toBe(example);
});

test('gendiff(YAML)', () => {
  const example = fs.readFileSync('./__tests__/__fixtures__/flatSimpleResult', 'utf-8');
  expect(gendiff(
    './__tests__/__fixtures__/before.yaml',
    './__tests__/__fixtures__/after.yaml',
    'plane',
  )).toBe(example);
});

test('gendiff(INI)', () => {
  const example = fs.readFileSync('./__tests__/__fixtures__/flatSimpleResult', 'utf-8');
  expect(gendiff(
    './__tests__/__fixtures__/before.ini',
    './__tests__/__fixtures__/after.ini',
    'plane',
  )).toBe(example);
});

