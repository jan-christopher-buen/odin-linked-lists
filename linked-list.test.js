import test from 'node:test';
import assert from 'node:assert/strict';
import { Node } from './node.js';

test('Node defaults both properties to null, including explicit undefined', () => {
  for (const node of [new Node(), new Node(undefined, undefined)]) {
    assert.equal(node.value, null);
    assert.equal(node.nextNode, null);
  }
});

test('Node retains the supplied value and next node reference', () => {
  const next = new Node('tail');
  const value = { name: 'head' };
  const node = new Node(value, next);
  assert.equal(node.value, value);
  assert.equal(node.nextNode, next);
});
