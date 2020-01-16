import { ProxyResource } from './ProxyResource';
import { ScheduleEntries } from './ScheduleEntries';
export type RedisPatchSchedule = internal.RedisPatchSchedule & ProxyResource;
namespace internal {
  /**
   * Response to put/get patch schedules for Redis cache.
   */
  export interface RedisPatchSchedule {
    /**
     * List of patch schedules for a Redis cache.
     */
    properties: ScheduleEntries;
  }
}
