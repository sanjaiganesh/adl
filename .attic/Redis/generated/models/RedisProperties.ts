import { RedisCreateProperties } from './RedisCreateProperties';
import { ProvisioningState } from '../enums/ProvisioningState';
import { RedisAccessKeys } from './RedisAccessKeys';
import { RedisLinkedServer } from './RedisLinkedServer';
export type RedisProperties = internal.RedisProperties & RedisCreateProperties;
namespace internal {
  /**
   * Properties of the redis cache.
   */
  export interface RedisProperties {
    /**
     * Redis version.
     */
    readonly redisVersion?: string;
    /**
     * Redis instance provisioning status.
     */
    readonly provisioningState?: ProvisioningState;
    /**
     * Redis host name.
     */
    readonly hostName?: string;
    /**
     * Redis non-SSL port.
     */
    readonly port?: number & Format<'int32'>;
    /**
     * Redis SSL port.
     */
    readonly sslPort?: number & Format<'int32'>;
    /**
     * The keys of the Redis cache - not set if this object is not the response to Create or Update redis cache
     */
    accessKeys?: RedisAccessKeys;
    /**
     * List of the linked servers associated with the cache
     */
    readonly linkedServers?: Array<RedisLinkedServer>;
  }
}
