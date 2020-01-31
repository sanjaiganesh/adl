/** Gets the base type of a literal type */
type TypeOf<T> =
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T extends undefined ? undefined :
  object;

/** Specifies the value a discriminator to identify this schema */
type Kind<V> = V & TypeOf<V>;

/** Declares the property is a polymorphic discriminator */
type Discriminator<V> = V;

/** Version Restriction */
type Version<low, high = any> = any;

/** an dictionary of key(string)/value pairs */
interface Dictionary<T> {
  [key: string]: T;
}

