import { RedisLinkedServerCreateProperties } from './RedisLinkedServerCreateProperties';
export type RedisLinkedServerProperties = internal.RedisLinkedServerProperties & RedisLinkedServerCreateProperties;
namespace internal {
  /**
   * Properties of a linked server to be returned in get/put response
   */
  export interface RedisLinkedServerProperties {
    /**
     * Terminal state of the link between primary and secondary redis cache.
     */
    readonly provisioningState?: string;
  }
}
