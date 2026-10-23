import { Node } from './node.js';

export class LinkedList {
  #head = null;

  prepend(value) {
    const node = new Node();
    // Assign separately so explicit undefined survives Node's default parameter.
    node.value = value;
    node.nextNode = this.#head;
    this.#head = node;
  }

  append(value) {
    if (this.#head === null) {
      this.prepend(value);
      return;
    }
    let current = this.#head;
    while (current.nextNode !== null) current = current.nextNode;
    const node = new Node();
    node.value = value;
    current.nextNode = node;
  }

  size() {
    let count = 0;
    let current = this.#head;
    while (current !== null) {
      count += 1;
      current = current.nextNode;
    }
    return count;
  }

  head() {
    return this.#head === null ? undefined : this.#head.value;
  }

  tail() {
    if (this.#head === null) return undefined;
    let current = this.#head;
    while (current.nextNode !== null) current = current.nextNode;
    return current.value;
  }

  at(index) {
    if (!Number.isInteger(index) || index < 0) return undefined;
    let current = this.#head;
    for (let position = 0; current !== null && position < index; position += 1) {
      current = current.nextNode;
    }
    return current === null ? undefined : current.value;
  }

  pop() {
    if (this.#head === null) return undefined;
    const value = this.#head.value;
    this.#head = this.#head.nextNode;
    return value;
  }

  contains(value) {
    return this.findIndex(value) !== -1;
  }

  findIndex(value) {
    let current = this.#head;
    let index = 0;
    while (current !== null) {
      if (current.value === value) return index;
      current = current.nextNode;
      index += 1;
    }
    return -1;
  }

  toString() {
    const parts = [];
    let current = this.#head;
    while (current !== null) {
      parts.push(`( ${String(current.value)} )`);
      current = current.nextNode;
    }
    return parts.length === 0 ? '' : `${parts.join(' -> ')} -> null`;
  }

  insertAt(index, ...values) {
    this.#validateIndex(index, true);
    let previous = null;
    let current = this.#head;
    for (let position = 0; position < index; position += 1) {
      previous = current;
      current = current.nextNode;
    }
    for (const value of values) {
      const node = new Node();
      node.value = value;
      node.nextNode = current;
      if (previous === null) this.#head = node;
      else previous.nextNode = node;
      previous = node;
    }
  }

  removeAt(index) {
    this.#validateIndex(index, false);
    if (index === 0) {
      this.pop();
      return;
    }
    let previous = this.#head;
    for (let position = 0; position < index - 1; position += 1) {
      previous = previous.nextNode;
    }
    previous.nextNode = previous.nextNode.nextNode;
  }

  #validateIndex(index, allowEnd) {
    if (!Number.isInteger(index) || index < 0) {
      throw new RangeError('Index must be a nonnegative integer');
    }
    const length = this.size();
    if (index > length || (!allowEnd && index === length)) {
      throw new RangeError('Index is out of bounds');
    }
  }
}
