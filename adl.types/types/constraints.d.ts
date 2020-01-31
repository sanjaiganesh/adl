
/** A valid regular expression to apply as a constraint on a value
 * 
 * @param T - the regular expression
*/
declare interface Pattern<T extends string> extends Attributes.Constraint {
}

/** The maximum length of a string value */
declare interface MaxLength<N extends number> extends Attributes.Constraint {
}

/** the minimum length of a string value */
declare interface MinLength<N extends number> extends Attributes.Constraint {
}

/** a number value that is a multiple of a given number */
declare interface MultipleOf<N extends number> extends Attributes.Constraint {
}

/** a maximum value */
declare interface Maximum<N extends number> extends Attributes.Constraint {
}

/** a minimum value */
declare interface Minimum<N extends number> extends Attributes.Constraint {
}

/** an exclusive maximum value (that is less than, not equal to) */
declare interface ExclusiveMaximum<N extends number> extends Attributes.Constraint {
}

/** an exclusive minimum value (that is greater than, not equal to) */
declare interface ExclusiveMinimum<N extends number> extends Attributes.Constraint {
}

/** the maximum number of items in an Array */
declare interface MaxItems<N extends number> extends Attributes.Constraint {
}

/** the minimum number of items in an Array */
declare interface MinItems<N extends number> extends Attributes.Constraint {
}

/** indicates that a property can be written to but not read */
declare interface WriteOnly extends Attributes.Constraint {
}

/** indicates the contents of the array must be unique items */
declare interface Unique extends Attributes.Constraint {
}

