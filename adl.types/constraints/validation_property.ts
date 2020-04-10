/*
 * validation constraints spec how a property will be validated
 */

import { PropertyConstraint, ValidationConstraint } from './types'



/** property is required */
export interface Required extends PropertyConstraint{}

/** property is immutable */
export interface Immutable extends PropertyConstraint {}

/** The maximum length of a string value */
export interface MaxLength<N extends number> extends ValidationConstraint {}

/** the minimum length of a string value */
export interface MinLength<N extends number> extends ValidationConstraint {}
/** a maximum value */
export interface Maximum<N extends number> extends ValidationConstraint {}
/** a minimum value */
export interface Minimum<N extends number> extends ValidationConstraint {}
/** range **/
export interface Range<L extends number, H extends number> extends ValidationConstraint{}


/** A valid regular expression to apply as a constraint on a value
 *
 * @param T - the regular expression
*/
export interface MustMatch<doubleEscapedRE extends string, ignoreCase extends boolean> extends ValidationConstraint{}


/** a number value that is a multiple of a given number */
export interface MultipleOf<N extends number> extends ValidationConstraint {}


/** the maximum number of items in an Array */
export interface MaxItems<N extends number> extends PropertyConstraint {}

/** the minimum number of items in an Array */
export interface MinItems<N extends number> extends PropertyConstraint {}

/** indicates that a property can be written to but not read */
export interface WriteOnly extends PropertyConstraint {}

/** indicates that a property can be read to but not written */
export interface ReadOnly extends PropertyConstraint {}

/** indicates the contents of the array must be of unique items */
export interface Unique extends PropertyConstraint {}

/** indicates this property value is only valid if it is one of these values  */
export interface OneOf<v extends any[]> extends PropertyConstraint {}

/** indicates this property is a secret */
export interface Secret extends PropertyConstraint{};