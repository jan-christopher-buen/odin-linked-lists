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
}
