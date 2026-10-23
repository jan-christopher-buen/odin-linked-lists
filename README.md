# Linked Lists

A singly linked list built with JavaScript classes and ES modules for
[The Odin Project's Linked Lists assignment](https://www.theodinproject.com/lessons/javascript-linked-lists),
including both extra-credit operations. This is a console project.

## Run

Install Node.js and npm. Verified locally in WSL2 using Node **v24.22.0** and
npm **11.19.1**. No external dependencies or package installation are needed.

```sh
npm start
npm test
```

The demo prints:

```text
( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> null
```

## Usage and API

```js
import { LinkedList } from './linked-list.js';

const list = new LinkedList();
list.append(1);
list.append(3);
list.insertAt(1, 2, 'extra');
list.removeAt(2);
console.log(list.toString()); // ( 1 ) -> ( 2 ) -> ( 3 ) -> null
console.log(list.pop()); // 1 (removes the head)
console.log(list.head()); // 2 (a value, not a Node)
```

`Node` is also a named export from `node.js`. Its constructor accepts
`value = null` and `nextNode = null`. Explicit `undefined` uses these constructor
defaults; list methods assign values separately so they can store `undefined`.

| Method | Behavior and return value | Empty list |
| --- | --- | --- |
| `append(value)` | Add at the end; return `undefined` | Create first node |
| `prepend(value)` | Add at the beginning; return `undefined` | Create first node |
| `size()` | Return node count | `0` |
| `head()` | Return first value | `undefined` |
| `tail()` | Return final value | `undefined` |
| `at(index)` | Return indexed value, or `undefined` for invalid/missing index | `undefined` |
| `pop()` | Remove **head** and return its value | `undefined` |
| `contains(value)` | Return whether a strict match exists | `false` |
| `findIndex(value)` | Return first matching index, or `-1` | `-1` |
| `toString()` | Format values with `String(value)` and end with ` -> null` | `""` |
| `insertAt(index, ...values)` | Insert before index in supplied order; return `undefined` | Only index `0` valid |
| `removeAt(index)` | Remove indexed node; return `undefined` | Throw `RangeError` |

Indexes are zero-based. Insertion accepts `0` through `size()` inclusive;
removal accepts `0` through `size() - 1`. Insertion at `size()` appends.
Zero inserted values is a no-op after validation. Invalid mutations throw
`RangeError` before changing links.

Project choices beyond the assignment's specified behavior:

- Indexes must be numbers and nonnegative integers. Strings, fractions, `NaN`,
  infinities, and other invalid indexes return `undefined` from `at`, or throw
  `RangeError` from indexed mutations.
- `append`, `prepend`, `insertAt`, and `removeAt` return `undefined`; no chaining.
- Searches use `===`: objects match by reference, `NaN` never matches itself,
  and `0` matches `-0`.

Stored values are unrestricted, including `null`, `undefined`, `false`, objects,
and symbols. An accessor returning `undefined` can mean a stored value or a
missing node; use `size()` and the index when that distinction matters.
`toString()` uses normal JavaScript conversion, so a value whose own string
conversion throws will propagate that error.

## How the links work

Each Node holds a value and a `nextNode` reference to the next object, ending
with `null`. Each list owns only a private `#head` reference; there is no array
backing store, cached size, or cached tail. Traversal follows references one
node at a time.

Prepending points the new node at the old head, then moves the head reference.
Popping moves the head to its successor. Indexed insertion tracks the previous
node and the existing successor, then links each new node between them in
order. Removal makes the previous node skip the removed node. Head mutations
update `#head` directly. Unreachable removed nodes can be garbage collected.

## Complexity

Let `n` be the existing node count, `i` the requested index, `k` the number of
inserted values, and `L` the formatted output length. Bounds below are worst
case for valid calls.

| Operation | Time | Auxiliary space |
| --- | --- | --- |
| `new Node`, `new LinkedList`, `head`, `prepend`, `pop` | O(1) | O(1) |
| `append`, `size`, `tail`, `contains`, `findIndex` | O(n) | O(1) |
| `at(i)` | O(min(i, n) + 1) | O(1) |
| `insertAt(i, ...values)` | O(n + i + k), equivalently O(n + k) | O(k) for rest arguments; adds k nodes |
| `removeAt(i)` | O(n + i), equivalently O(n) | O(1) |
| `toString()` | O(n + L) | O(n + L), including formatted parts and output |

Indexed mutations first traverse the list to validate against its size; even
inserting zero values or removing index zero therefore takes O(n). Insertion
then traverses to the index and links k nodes. The list itself occupies O(n)
space. Formatting bounds assume value conversion takes time proportional to
its result; custom conversion methods can add arbitrary work or throw.

## Files and verification

- `node.js`: node data and next reference.
- `linked-list.js`: all twelve list methods and private index validation.
- `main.js`: required six-animal console demo.
- `linked-list.test.js`: public-behavior tests using `node:test` and strict assertions.
- `package.json`: ES module configuration and scripts.
- `.gitignore`: dependencies, coverage, and logs.

The automated suite contains 15 tests covering constructor defaults, empty
and singleton lists, mutation order, strict equality, unrestricted values,
rejected indexes, independent lists, and mixed operations. Run `npm test` to
execute the suite. Run `npm start` to see the assignment demo shown above.
