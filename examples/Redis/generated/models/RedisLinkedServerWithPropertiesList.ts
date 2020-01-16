import { RedisLinkedServerWithProperties } from './RedisLinkedServerWithProperties';
/**
 * List of linked servers (with properties) of a Redis cache.
 * 
 */
export interface RedisLinkedServerWithPropertiesList {
  /**
   * List of linked servers (with properties) of a Redis cache.
   */
  value?: Array<RedisLinkedServerWithProperties>;
  /**
   * Link for next set.
   */
  readonly nextLink?: string;
}
