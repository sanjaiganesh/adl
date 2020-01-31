import { RedisCommonProperties } from './RedisCommonProperties';
import { Sku } from './Sku';
export type RedisUpdateProperties = internal.RedisUpdateProperties & RedisCommonProperties;
namespace internal {
  /**
   * Patchable properties of the redis cache.
   */
  export interface RedisUpdateProperties {
    /**
     * The SKU of the Redis cache to deploy.
     */
    sku?: Sku;
  }
}
