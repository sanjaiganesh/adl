import { RedisUpdateProperties } from './RedisUpdateProperties';
/**
 * Parameters supplied to the Update Redis operation.
 */
export interface RedisUpdateParameters {
  /**
   * Redis cache properties.
   */
  properties?: RedisUpdateProperties;
  /**
   * Resource tags.
   */
  tags?: AdditionalProperties<string>;
}
