import fs from 'fs';
import gendiff from '../src';


const example = fs.readFileSync('./__tests__/__fixtures__/result', 'utf-8');

test('gendiff', () => {
  expect(gendiff(
    '/home/anatolii/Project2/__tests__/__fixtures__/before.json',
    '/home/anatolii/Project2/__tests__/__fixtures__/after.json',
  )).toBe(example);
});