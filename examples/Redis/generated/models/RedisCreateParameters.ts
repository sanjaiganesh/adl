import { RedisCreateProperties } from './RedisCreateProperties';
/**
 * Parameters supplied to the Create Redis operation.
 */
export interface RedisCreateParameters {
  /**
   * Redis cache properties.
   */
  properties: RedisCreateProperties;
  /**
   * A list of availability zones denoting where the resource needs to come from.
   */
  zones?: Array<string>;
  /**
   * The geo-location where the resource lives
   */
  location: string;
  /**
   * Resource tags.
   */
  tags?: AdditionalProperties<string>;
}
