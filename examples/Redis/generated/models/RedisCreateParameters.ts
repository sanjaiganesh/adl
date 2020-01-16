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
   * 
   * @deleted 2019-01-01+
   * @replacedBy aZones
   */
  zones?: Array<string>;

  /**
   * 
   * @version 2019-01-01+
   */
  aZones?: Array<string>;

  /**
   *
   * @version 2019-01-01+
   */
  bZones?: Array<string>;
  /**
   * The geo-location where the resource lives
   */
  location: string;

  /**
   * Resource tags.
   */
  tags?: AdditionalProperties<string>;
}
