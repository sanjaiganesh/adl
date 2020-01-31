import { DayOfWeek } from '../enums/DayOfWeek';
/**
 * Patch schedule entry for a Premium Redis Cache.
 */
export interface ScheduleEntry {
  /**
   * Day of the week when a cache can be patched.
   */
  dayOfWeek: DayOfWeek;
  /**
   * Start hour after which cache patching can start.
   */
  startHourUtc: number & Format<'int32'>;
  /**
   * ISO8601 timespan specifying how much time cache patching can take.
   */
  maintenanceWindow?: string & Format<'duration'>;
}
