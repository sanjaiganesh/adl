import { Resource } from './Resource';
export type TrackedResource = internal.TrackedResource & Resource;
namespace internal {
  /**
   * The resource model definition for a ARM tracked top level resource
   */
  export interface TrackedResource {
    /**
     * Resource tags.
     */
    tags?: AdditionalProperties<string>;
    /**
     * The geo-location where the resource lives
     */
    location: string;
  }
}
