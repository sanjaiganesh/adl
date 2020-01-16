import { RedisResource } from './RedisResource';
/**
 * The response of list Redis operation.
 */
export interface RedisListResult {
  /**
   * List of Redis cache instances.
   */
  value?: Array<RedisResource>;
  /**
   * Link for next page of results.
   */
  readonly nextLink?: string;
}
