/**
 * First Resource Properties
 * 
 * @description the first resource has a name and a value. It's not complicated
 */
export interface FirstProperties {
  /** the name of this resource */
  name: string & MinLength<1> & MaxLength<99>;

  /** some value with some significance to the resource */
  value: int32;

  /** any other values are strings */
  morestuff: Dictionary<string>;

  /** even weird names are ok
   * 
   * @clientName WeirdName
   */
  'weird-name': string;
}