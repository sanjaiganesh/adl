# Modeling Schemas 

TypeScript patterns for modeling schemas:

# Defining model types

ADL Model types declared as standard [TypeScript](https://www.typescriptlang.org/docs/handbook/interfaces.html) `interface` and `type` definitions.

> Note: ADL does not permit functions declarations in a schema definition. Schemas are intented to document the shape of data sent across the wire.

#### Interfaces with primitive properties

``` ts
export interface Pet {
  name: string;
  age: number;
}

```
#### Primitive Types
ADL includes the basic set of TypeScript primitive types:

|ADL Primitive Type| Description|
|--|--|
|`boolean`| The most basic datatype is the simple true/false value, which JavaScript and TypeScript call a boolean value |
|`number` | As in TypeScript, `number`s in ADL are floating point values. These floating point numbers get the type `number`. In addition to hexadecimal and decimal literals, ADL also supports binary and octal literals.
|`string`| As in other languages, we use the type `string` to refer to these textual datatypes |
|`Array<T>` or `T[]` | Array types can be written in one of two ways. <br>You may use a generic array type, `Array<elemType>`, <br>or use the type of the elements followed by `[]` to denote an array of that element type |
| `any` | some data isn't actually typed or supports literally any value. For this, use the `any` type (be forewarned, generating code against such properties is often less than satisfactory.) |
|`null`| `null` can be used as a type that literally represents the `null` value. Not so useful alone, but can be combined to with union types : `string | null` |
|`undefined`| represents the lack of a defined value. Again, not so useful alone, but can be combined to with union types : `string | undefined` -- essentially saying that it's optional |

#### Extended primitive types
ADL extends the set of primitives with some precision specific ones:

|ADL Primitive Type| Description|
|--|--|
|`byte` or `int8` | Integer with 8 bit-precision |
|`short` or `int16` | Integer with 16 bit-precision |
|`integer` or `int32` | Integer with 32 bit-precision |
|`long` or `int64` | Integer with 64 bit-precision |
|`float` or `float32`| 32-bit precision floating point number |
|`double` or `float64`| 64-bit precision floating point number |
|`unixtime`| Unix time date format |
|`char`| a single character |
|`date`| an ISO 8601 date string |
|`datetime`| an ISO 8601 Date time string |
|`datetimeRfc1123`| and RFC 1123 date time string |
|`duration`| a duration value |
|`uuid`| A UUID/GUID string |
|`uri`| and URI string |


#### Optional Properties
Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all. These optional properties are popular when creating patterns like “option bags” where you pass an object to a function that only has a couple of properties filled in.

Here’s an example of this pattern:

``` typescript
interface SquareConfig {
    color?: string; // the question mark indicates that the field is optional. ()
    width?: number;

    // also may be expressed like:

    borderWidth: number | undefined;
}
```

#### Readonly properties 

Some properties should only be modifiable when an object is first created. You can specify this by putting readonly before the name of the property:

``` typescript
interface Pet {
  readonly id: string; // a field marked as readonly would not be sent from the client to the service.
  name: string;
  age: number: 
}
```

#### Extending interfaces

Interfaces can extend other interfaces (and supports, if necessary multiple inheritance)

``` typescript
// Animal defines a species.
interface Animal { 
  species: string;
}

// A Pet is a kind of Animal
interface Pet extends Animal { 
  readonly: id: string;
  name: string;
  age: number:
}
```

#### Object properties

Interfaces can have properties that use interface types:

``` typescript
interface Address {
  number: string;
  street: string;
  city: string;
  postalCode: string;
}

interface Person {
  name: string;
  age: number
  home: Address; 
  work?: Address; // work address is optional.
}
```

### Union types
Occasionally, you’ll run into a case that expects a parameter to be either a `number` or a `string`. 

These can be constructed using the pipe `|`  character between the different permissble types.  

``` typescript
interface MyThing {
  value: string | number;
}
```

### Intersection types
Intersection types allow you to combine multiple types - in effect saying that the type is a merging of the specified types;

``` typescript
interface Cat { 
  whiskers: number;
}

interface Dog {
  woofVolume: number;
}

interface Person {
  myPet : Dog & Cat; // this is literally saying that the object is the combination of Dog and Cat
}
```

### Literal types 
Literal types allow you to specify a series of exact values. In practice string literal types combine nicely with union types, type guards, and type aliases. You can use these features together to get enum-like behavior with strings.

Literal types are specified with literal values separated with the pipe `|` character.

``` typescript
interface Vector {
  speed: number;
  direction: 'north' | 'south' | 'east' | 'west'; // must be exactly one of those values;
}

interface DiceValue {
  value: 1|2|3|4|5|6; // a value of 1-6 
}
```

### Discriminated Types
Discriminated types allow you to have an interface hierarchy and apply the shape according to a known value in the model.

Use `Discriminator<type>` in order to identify the discriminator property in the base interface.
Use `Kind<value>` to identify the value to match against the discriminator value;

``` typescript
interface Animal {
  species: Discriminator<string>;
}

interface Bird extends Animal {
  species: Kind<'bird'>; // when species is 'bird' we know it to be this shape (Bird)
  flightSpeed: number;
}

interface Fish extends Animal {
  species: Kind<'fish'>; // when species is 'fish' we know it to be this shape (Fish)
  swimSpeed: number;
}
```


### Dictionaries
In ADL, dictionaries always use a `string` value for the key, you need only specify the value type using `Dictionary<type>`:

``` typescript
interface OddsAndEnds {
  name: string;
  details: Dictionary<string>;  // a key-value dictionary of string :: string 
  bucket: Dictionary<integer>:  // a key-value dictionary of string :: integers
}
```

You can even extend your interfaces from dictionaries:

``` typescript
// this interface allows additional string properties by any name. 
interface HalfKnown extends Dictionary<string> {
  age: number;
  color: Color; 
}
```

### Enum types
Enum types can be used to give some formality around a collection of possible values:

``` typescript
enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
  Everyday = 'Everyday',
  PartyDay = 'Weekend' // note the name doesn't have to match the value
}

interface Calendar {
  dow: DayOfWeek; // must be one of the above values.
  anyday: DayOfWeek | string; // an extensible way of declaring that the value could be one of the enum or any other value. 
}
```

### Type aliases
Type aliases create a new name for a type. Type aliases are sometimes similar to interfaces, but can name primitives, unions, etc, and any other types that you’d otherwise have to write by hand.

``` typescript
type Color = 'red'|'green'|'blue'; 

type optionalNumber = number | undefined;

interface Square {
  color: Color; // red green or blue...
  foo: undefinedNumber;
}

type MyPetCar = Pet & Car;

```
### Documenting the schema types
Using JSDoc comments, we can provide very rich documentation on schema types.

``` typescript

/** Text that is here is the summary text.
 * 
 * @description - this is the description text. Ideally, it's longer that the text that you briefly describe the type with.
 * 
 * @since 2019-01-01 - this schema was added at this API version
 * @deprecated 2019-06-06  - it was deprecated at this API version
 * @deleted 2020-01-01 - This field should absolutely not be present past this version
 * 
 * @example {
 *   name: 'MyResource',
 *   description: 'The Big Resource',
 *   color: 'blue',
 *   borderColor: 'green',
 *   companyAddress: '...',
 * }
 */
export interface ResourceProperties {
  /** 
   * The resource name
   * 
   * @description The description can further explain what this does.
  */
  name: string;

  /** 
   * The resource description
   * 
   * @since 2019-06-06 - this is when this member was introduced
  */
  description: string;

  /** 
   * The resource color
   * 
   * @clientDefault 'green'
  */
  color?: ResourceColor;

  /** 
   * The resource border color
   * 
   * @default 'black'
  */
  borderColor?: ResourceColor;
}

```
Text before a @jsdoc tag is considered 'summary' text

It's ok to use any `@jsdoc` tags, but the ones that have significance on schema interfaces:

|JSDoc Tag|Purpose|
|--|--|
|`@description`| extended description information  |
|`@since`| the API version that this member or schema was added to the API |
|`@deprecated`| the API version that this member or schema was deprecated |
|`@deleted`| the API version that this member or schema was removed to the API |
|`@replacedBy`| the member that replaces this member when it is deleted or deprecated |
|`@default`| the literal value that will be assumed if a value is not passed from the client |
|`@clientDefault`| the value the client should use as a default value.  |
|`@example`| an example payload for this schema |

### Renaming a property between API versions
Rarely, a property in a schema needs to be renamed. This can be noted by marking the original property `@deleted` adding a `@replacedBy` 
that directs it to another property in the same schema. 

``` typescript

/** Text that is here is the summary text.
 * 
 * @description - this is the description text. Ideally, it's longer that the text that you briefly describe the type with.
  */
export interface ResourceProperties {
  /** 
   * The resource name
   * 
   * @description The description can further explain what this does.
  */
  name: string;

  /** A property we changed, because we're mean
   * 
   * @deleted 2020-01-01
   * @replacedBy companyAddress
   */
  address: string;

  /** The new property for the company address.
   * 
   * @since 2020-01-01
   */
  companyAddress: string;

  /** A new property for the home address.
   * 
   * @since 2020-01-01
   */
  homeAddress?: string;  // it's optional!
}

```


## Validation Constraints
ADL adds to TypeScript's __shape__ validation by providing valdiation constraints for delcaring additional   

Adding validation constraints to a member is done by adding validation constructs to the property types via intersection types.

ie:
``` typescript
// create type alias so we can reuse it. 
type Email = string & Pattern<'.*@.*\.\w*'>;

interface ContactInfo {
  email: Email;
  backupEmail?: Email; // optional, same validation

  phone: string & Pattern<'^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$'>;
  
  number: string;
  street: string;
  city: string;
  postalCode: string & MinLength<3> & MaxLength<10>;

  description: Array<string> & MinItems<1>
  
  password: Credential & WriteOnly;
}

```

The following are the currently supported validation constraints:

|JSDoc Tag|applies to|Descrpition | 
|--|--|--|
|`MultipleOf<number value>`|`number`/`float`/`integer` etc|Property must be a multiple of the given value|
|`Maximum<number value>`|`number`/`float`/`integer` etc|Property must be less than or equal to the given value|
|`ExclusiveMaximum<number value>`|`number`/`float`/`integer` etc  | Property must be less than to the given value |
|`Minimum<number value>`|`number`/`float`/`integer` etc  |Property must be greater than or equal to the given value  |
|`ExclusiveMinimum<number value`|`number`/`float`/`integer` etc  | Property must be greater than to the given value |
|`MaxLength<number value>`|`string`|The maximum string length|
|`MinLength<number value>`|`string`| The minimum string length |
|`Pattern<regex string>`|`string`|The string must match the regualar expression |
|`MaxItems<number value>`|`Array<T>`|The maximum number of items in the array   |
|`MinItems<number value>`| `Array<T>` |The minimum number of items in the array  |
|`Unique`| `Array<T>` | the items in the array must be unique |
|`WriteOnly` | anything| the property is only writable and will not be returned to the client |
|`Version<???>`|anything| constraint applies to the api version specified. |


### Constraints changing between versions
[Coming Soon]
