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

import { LinkedList } from './linked-list.js';

test('empty list accessors and pop return undefined', () => {
  const list = new LinkedList();
  assert.equal(list.size(), 0);
  assert.equal(list.head(), undefined);
  assert.equal(list.tail(), undefined);
  assert.equal(list.at(0), undefined);
  assert.equal(list.pop(), undefined);
});

test('append and prepend maintain order and return undefined', () => {
  const list = new LinkedList();
  assert.equal(list.append('cat'), undefined);
  assert.equal(list.prepend('dog'), undefined);
  list.append('bird');
  assert.equal(list.size(), 3);
  assert.equal(list.head(), 'dog');
  assert.equal(list.at(1), 'cat');
  assert.equal(list.tail(), 'bird');
  assert.equal(list.at(3), undefined);
});

test('pop removes the head through singleton and empty states', () => {
  const list = new LinkedList();
  list.prepend(2);
  list.prepend(1);
  assert.equal(list.pop(), 1);
  assert.equal(list.size(), 1);
  assert.equal(list.head(), 2);
  assert.equal(list.tail(), 2);
  assert.equal(list.pop(), 2);
  assert.equal(list.pop(), undefined);
  assert.equal(list.size(), 0);
  assert.equal(list.tail(), undefined);
  list.append(3);
  assert.equal(list.head(), 3);
});

test('at rejects invalid indexes without coercion', () => {
  const list = new LinkedList();
  list.append('a');
  for (const index of [-1, 0.5, '0', null, undefined, NaN, Infinity, -Infinity, {}, 0n]) {
    assert.equal(list.at(index), undefined);
  }
  assert.equal(list.at(0), 'a');
});

test('instances are independent and values include explicit undefined', () => {
  const first = new LinkedList();
  const second = new LinkedList();
  first.append(undefined);
  first.append(null);
  first.append(false);
  first.append(0);
  first.prepend(undefined);
  assert.equal(first.size(), 5);
  assert.equal(first.pop(), undefined);
  assert.equal(first.at(0), undefined);
  assert.equal(first.at(1), null);
  assert.equal(first.at(2), false);
  assert.equal(first.at(3), 0);
  assert.equal(second.size(), 0);
});
