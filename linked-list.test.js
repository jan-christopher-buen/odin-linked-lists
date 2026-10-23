import test from 'node:test';
import assert from 'node:assert/strict';
import { Node } from './node.js';
import { LinkedList } from './linked-list.js';

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

test('search handles empty lists, duplicates, and missing values', () => {
  const list = new LinkedList();
  assert.equal(list.contains('cat'), false);
  assert.equal(list.findIndex('cat'), -1);
  list.append('dog');
  list.append('cat');
  list.append('cat');
  assert.equal(list.contains('cat'), true);
  assert.equal(list.findIndex('cat'), 1);
  assert.equal(list.findIndex('dog'), 0);
  assert.equal(list.findIndex('bird'), -1);
});

test('search uses strict equality and object identity', () => {
  const list = new LinkedList();
  const object = { pet: 'cat' };
  for (const value of [object, 0, false, null, undefined, NaN]) list.append(value);
  assert.equal(list.contains(object), true);
  assert.equal(list.findIndex(object), 0);
  for (const value of [{ pet: 'cat' }, '0', NaN]) {
    assert.equal(list.contains(value), false);
    assert.equal(list.findIndex(value), -1);
  }
  assert.equal(list.findIndex(false), 2);
  assert.equal(list.findIndex(null), 3);
  assert.equal(list.findIndex(undefined), 4);
  assert.equal(list.findIndex(-0), 1);
});

test('toString formats empty, singleton, and unrestricted values exactly', () => {
  const list = new LinkedList();
  assert.equal(list.toString(), '');
  list.append('dog');
  assert.equal(list.toString(), '( dog ) -> null');
  list.append('cat');
  assert.equal(list.toString(), '( dog ) -> ( cat ) -> null');
  const values = new LinkedList();
  for (const value of [null, undefined, false, 0, Symbol('pet'), { toString: () => 'custom' }]) {
    values.append(value);
  }
  assert.equal(values.toString(), '( null ) -> ( undefined ) -> ( false ) -> ( 0 ) -> ( Symbol(pet) ) -> ( custom ) -> null');
});

test('insertAt handles empty, head, middle, and end while retaining value order', () => {
  const list = new LinkedList();
  assert.equal(list.insertAt(0, 2, 3), undefined);
  list.insertAt(0, 0, 1);
  list.insertAt(2, 'a', 'b');
  list.insertAt(6, 4, undefined);
  assert.equal(list.toString(), '( 0 ) -> ( 1 ) -> ( a ) -> ( b ) -> ( 2 ) -> ( 3 ) -> ( 4 ) -> ( undefined ) -> null');
  assert.equal(list.size(), 8);
  assert.equal(list.head(), 0);
  assert.equal(list.tail(), undefined);
  assert.equal(list.at(7), undefined);
  assert.equal(list.at(4), 2);
});

test('inserting no values validates the index and otherwise changes nothing', () => {
  const list = new LinkedList();
  assert.equal(list.insertAt(0), undefined);
  assert.equal(list.size(), 0);
  list.insertAt(0, 1, 2);
  for (const index of [0, 1, 2]) assert.equal(list.insertAt(index), undefined);
  assert.equal(list.toString(), '( 1 ) -> ( 2 ) -> null');
});

test('removeAt reconnects head, middle, tail, and singleton', () => {
  const list = new LinkedList();
  list.insertAt(0, 1, 2, 3, 4, 5);
  assert.equal(list.removeAt(0), undefined);
  assert.equal(list.head(), 2);
  list.removeAt(1);
  assert.equal(list.toString(), '( 2 ) -> ( 4 ) -> ( 5 ) -> null');
  list.removeAt(2);
  assert.equal(list.tail(), 4);
  list.removeAt(0);
  assert.equal(list.size(), 1);
  list.removeAt(0);
  assert.equal(list.size(), 0);
  assert.equal(list.head(), undefined);
  assert.equal(list.tail(), undefined);
  assert.equal(list.toString(), '');
});

test('invalid mutations throw RangeError before changing any links', () => {
  const list = new LinkedList();
  const invalid = [-1, 1.5, '0', null, undefined, NaN, Infinity, -Infinity, {}, 0n];
  for (const index of [...invalid, 1]) {
    assert.throws(() => list.insertAt(index, 'x'), RangeError);
    assert.throws(() => list.insertAt(index), RangeError);
    assert.throws(() => list.removeAt(index), RangeError);
    assert.equal(list.size(), 0);
  }
  assert.throws(() => list.removeAt(0), RangeError);
  list.insertAt(0, 1, 2, 3);
  for (const index of [...invalid, 4]) {
    assert.throws(() => list.insertAt(index, 'x', 'y'), RangeError);
    assert.throws(() => list.insertAt(index), RangeError);
    assert.throws(() => list.removeAt(index), RangeError);
    assert.equal(list.toString(), '( 1 ) -> ( 2 ) -> ( 3 ) -> null');
    assert.equal(list.size(), 3);
  }
  assert.throws(() => list.removeAt(3), RangeError);
  assert.equal(list.tail(), 3);
});

test('mixed mutations preserve links and independent instances', () => {
  const list = new LinkedList();
  const other = new LinkedList();
  other.append('separate');
  list.append(2);
  list.prepend(1);
  list.insertAt(1, false, null, undefined);
  list.removeAt(2);
  assert.equal(list.pop(), 1);
  list.append(3);
  list.removeAt(3);
  list.insertAt(3, 4, 5);
  assert.equal(list.toString(), '( false ) -> ( undefined ) -> ( 2 ) -> ( 4 ) -> ( 5 ) -> null');
  assert.equal(list.size(), 5);
  assert.equal(list.head(), false);
  assert.equal(list.tail(), 5);
  assert.equal(list.findIndex(undefined), 1);
  assert.equal(other.toString(), '( separate ) -> null');
});
