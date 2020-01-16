import { RedisLinkedServerCreateProperties } from './RedisLinkedServerCreateProperties';
/**
 * Parameter required for creating a linked server to redis cache.
 */
export interface RedisLinkedServerCreateParameters {
  /**
   * Properties required to create a linked server.
   */
  properties: RedisLinkedServerCreateProperties;
}
