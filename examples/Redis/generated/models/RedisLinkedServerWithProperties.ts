import { ProxyResource } from './ProxyResource';
import { RedisLinkedServerProperties } from './RedisLinkedServerProperties';
export type RedisLinkedServerWithProperties = internal.RedisLinkedServerWithProperties & ProxyResource;
namespace internal {
  /**
   * Response to put/get linked server (with properties) for Redis cache.
   */
  export interface RedisLinkedServerWithProperties {
    /**
     * Properties of the linked server.
     */
    properties?: RedisLinkedServerProperties;
  }
}
