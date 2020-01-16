import { RedisPatchSchedule } from './RedisPatchSchedule';
/**
 * The response of list patch schedules Redis operation.
 */
export interface RedisPatchScheduleListResult {
  /**
   * Results of the list patch schedules operation.
   */
  value?: Array<RedisPatchSchedule>;
  /**
   * Link for next page of results.
   */
  readonly nextLink?: string;
}
