import { TrackedResource } from './TrackedResource';
import { RedisProperties } from './RedisProperties';
export type RedisResource = internal.RedisResource & TrackedResource;
namespace internal {
  /**
   * A single Redis item in List or Get Operation.
   */
  export interface RedisResource {
    /**
     * Redis cache properties.
     */
    properties: RedisProperties;
    /**
     * A list of availability zones denoting where the resource needs to come from.
     */
    zones?: Array<string>;
  }
}
