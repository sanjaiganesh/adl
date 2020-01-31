/**
 * Fourth Resource Properties
 * 
 * @description the fourth resource has a name and a value. It's not complicated
 * 
 * @since 2019-02-12
 */
export interface FirstProperties {
  /** the name of this resource */
  name: string & MinLength<4> & MaxLength<99>;

  /** some value with some significance to the resource */
  value: int32;
}