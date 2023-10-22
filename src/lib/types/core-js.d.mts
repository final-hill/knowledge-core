/*!
 * @license
 * Copyright (C) 2023 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

// polyfill types for core-js Iterator helpers

interface Iterator<T> {
    map<U>(callbackfn: (value: T, index: number) => U): Iterator<U>;
    filter<S extends T>(predicate: (value: T, index: number) => value is S): Iterator<S>;
    filter(predicate: (value: T, index: number) => unknown): Iterator<T>;
    take(limit: number): Iterator<T>;
    drop(limit: number): Iterator<T>;
    flatMap<U>(callbackfn: (value: T, index: number) => U): Iterator<U>;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T, initialValue?: T): T;
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
    toArray(): T[];
    forEach(callbackfn: (value: T, index: number) => void): void;
    every<S extends T>(predicate: (value: T, index: number) => value is S): this is Iterator<S>;
    every(predicate: (value: T, index: number) => unknown): boolean;
    some(predicate: (value: T, index: number) => unknown): boolean;
    find<S extends T>(predicate: (this: void, value: T, index: number) => value is S): S | undefined;
    find(predicate: (value: T, index: number) => unknown): T | undefined;
    from(iteratorLike: Iterable<T>): Iterator<T>;
}

interface IterableIterator<T> {
    map<U>(callbackfn: (value: T, index: number) => U): IterableIterator<U>;
    filter<S extends T>(predicate: (value: T, index: number) => value is S): IterableIterator<S>;
    filter(predicate: (value: T, index: number) => unknown): IterableIterator<T>;
    take(limit: number): IterableIterator<T>;
    drop(limit: number): IterableIterator<T>;
    flatMap<U>(callbackfn: (value: T, index: number) => U): IterableIterator<U>;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T, initialValue?: T): T;
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
    toArray(): T[];
    forEach(callbackfn: (value: T, index: number) => void): void;
    every<S extends T>(predicate: (value: T, index: number) => value is S): this is IterableIterator<S>;
    every(predicate: (value: T, index: number) => unknown): boolean;
    some(predicate: (value: T, index: number) => unknown): boolean;
    find<S extends T>(predicate: (this: void, value: T, index: number) => value is S): S | undefined;
    find(predicate: (value: T, index: number) => unknown): T | undefined;
    from(iteratorLike: Iterable<T>): IterableIterator<T>;
}