/* eslint-disable no-use-before-define */
export type Value = string | boolean | undefined | null;
export type Mapping = Record<string, any>;
export type ArgumentArray = Array<Argument>;
export type ReadonlyArgumentArray = ReadonlyArray<Argument>;
export type Argument = Value | Mapping | ArgumentArray | ReadonlyArgumentArray;

function parseValue(arg: Argument): string {
  if (typeof arg === 'string') {
    return arg;
  }

  if (typeof arg !== 'object' || arg === null) {
    return '';
  }

  if (Array.isArray(arg)) {
    return classNames(arg);
  }

  if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
    return arg.toString();
  }

  let classes = '';

  for (const key in arg) {
    if (Object.prototype.hasOwnProperty.call(arg, key)) {
      const value = (arg as Mapping)[key];
      if (value) {
        classes = appendClass(classes, key);
      }
    }
  }

  return classes;
}

function appendClass(value: string, newClass: string): string {
  if (!newClass) {
    return value;
  }

  return value ? `${value} ${newClass}` : newClass;
}

/**
 * A simple JavaScript utility for conditionally joining classNames together.
 * Handles strings, arrays, and objects.
 * For objects, keys are added as classes if their corresponding values are truthy (specifically boolean true).
 * String values within objects are also added as classes.
 */
export function classNames(...args: ArgumentArray): string {
  let classes = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg) {
      classes = appendClass(classes, parseValue(arg));
    }
  }

  return classes;
}
