/**
 * Redis cache access keys.
 */
export interface RedisAccessKeys {
  /**
   * The current primary key that clients can use to authenticate with Redis cache.
   */
  readonly primaryKey?: string;
  /**
   * The current secondary key that clients can use to authenticate with Redis cache.
   */
  readonly secondaryKey?: string;
}
