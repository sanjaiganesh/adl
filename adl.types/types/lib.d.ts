interface Object {
}

interface Boolean { }
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
* Make all properties in T required
*/
type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
* Make all properties in T readonly
*/
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
* From T, pick a set of properties whose keys are in the union K
*/
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
* Construct a type with a set of properties K of type T
*/
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

/**
* Exclude from T those types that are assignable to U
*/
type Exclude<T, U> = T extends U ? never : T;

/**
* Extract from T those types that are assignable to U
*/
type Extract<T, U> = T extends U ? T : never;

/**
* Construct a type with the properties of T except for those in type K.
*/
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/**
* Exclude null and undefined from T
*/
type NonNullable<T> = T extends null | undefined ? never : T;

/**
* Obtain the parameters of a function type in a tuple
*/
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
* Obtain the parameters of a constructor function type in a tuple
*/
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

/**
* Obtain the return type of a function type
*/
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

/**
* Obtain the return type of a constructor function type
*/
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;

/**
* Marker for contextual 'this' type
*/
interface ThisType<T> { }

interface Iterable<T> {

}

interface TypedPropertyDescriptor<T> {
  enumerable?: boolean;
  configurable?: boolean;
  writable?: boolean;
  value?: T;
  get?: () => T;
  set?: (value: T) => void;
}

interface Array<T> { }
interface Function {
}

interface IArguments {
  [index: number]: any;
  length: number;
  callee: Function;
}

interface Number {
  /**
    * Returns a string representation of an object.
    * @param radix Specifies a radix for converting numeric values to strings. This value is only used for numbers.
    */
  toString(radix?: number): string;

  /**
    * Returns a string representing a number in fixed-point notation.
    * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
    */
  toFixed(fractionDigits?: number): string;

  /**
    * Returns a string containing a number represented in exponential notation.
    * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
    */
  toExponential(fractionDigits?: number): string;

  /**
    * Returns a string containing a number represented either in exponential or fixed-point notation with a specified number of digits.
    * @param precision Number of significant digits. Must be in the range 1 - 21, inclusive.
    */
  toPrecision(precision?: number): string;

  /** Returns the primitive value of the specified object. */
  valueOf(): number;
}

interface RegExp { }

interface String { }

interface Symbol {
  /** Returns a string representation of an object. */
  toString(): string;

  /** Returns the primitive value of the specified object. */
  valueOf(): symbol;
}
