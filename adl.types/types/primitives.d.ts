/** attributes to mark primitive types with purpose */
declare namespace Attributes {
  /** the accuracy in bits with which a number can be represented. */
  interface Precision<bits extends number> {
  }

  /** a whole number; a number that is not a fraction. */
  interface Integer {
  }

  /** a whole number; a number that is not a fraction. */
  interface FloatingPoint {
  }

  /** a value representing a Calendar date */
  interface Date {
  }

  /** a value representing a Time */
  interface Time {
  }

  /** A constraint is a declarative type used in intersection types to specify a run time value validation  */
  interface Constraint {
  }
}

/** Hints to express how to encode a given string value */
declare namespace Encoding {
  /** a value encoded as base64 */
  interface Base64 {
  }

  /** a value encoded as raw text (do not UriEncode for transport)  */
  interface Raw {
  }
}

/** an 8 bit integer value */
declare type int8 = number & Attributes.Integer & Attributes.Precision<8>;

/** an 8 bit integer value */
declare type byte = number & Attributes.Integer & Attributes.Precision<8>;

/** a 16 bit integer value */
declare type int16 = number & Attributes.Integer & Attributes.Precision<16>;

/** a 32 bit integer value */
declare type int32 = number & Attributes.Integer & Attributes.Precision<32>;

/** a 32 bit integer value */
declare type integer = number & Attributes.Integer & Attributes.Precision<32>;

/** a 64 bit integer value */
declare type int64 = number & Attributes.Integer & Attributes.Precision<64>;

/** a 64 bit integer value */
declare type long = number & Attributes.Integer & Attributes.Precision<64>;

/** a 32 bit floating point value */
declare type float = number & Attributes.FloatingPoint & Attributes.Precision<32>;

/** a 32 bit floating point value */
declare type float32 = number & Attributes.FloatingPoint & Attributes.Precision<32>;

/** a 64 bit floating point value */
declare type float64 = number & Attributes.FloatingPoint & Attributes.Precision<64>;

/** a 64 bit floating point value */
declare type double = number & Attributes.FloatingPoint & Attributes.Precision<64>;

/** the number of seconds that have passed since 00:00:00 UTC Thursday, 1 January 1970. */
declare type unixtime = number;

/** a single character  */
declare type char = string & MinLength<1> & MaxLength<1>;

/** an ISO 8601 Date format 
 * 
 * @todo - should this have a Pattern?
 */
declare type date = string & Attributes.Date;

/** an ISO 8601 DateTime format
 * 
 * @todo - should this have a Pattern?
 */
declare type datetime = string & Attributes.Date & Attributes.Time;

/** an RFC 1123 date time format 
 * 
 * @todo - should this have a Pattern?
*/
declare type datetimeRfc1123 = string & Attributes.Date & Attributes.Time;

/** a duration 
 * 
 * @todo - format?
*/
declare type duration = string;

/** a universally unique ID */
declare type uuid = string & Pattern<'^([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}$'>;

/** A Uniform Resource Identifier (URI) is a string of characters that unambiguously identifies a particular resource.  
 * 
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
*/
declare type uri = string & Pattern<'^[A-Za-z][A-Za-z0-9+\-.]*:.*^'>;