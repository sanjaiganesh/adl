/**
 * Properties of upgrade notification.
 */
export interface UpgradeNotification {
  /**
   * Name of upgrade notification.
   */
  readonly name?: string;
  /**
   * Timestamp when upgrade notification occurred.
   */
  readonly timestamp?: string & Format<'date-time'>;
  /**
   * Details about this upgrade notification
   */
  readonly upsellNotification?: AdditionalProperties<string>;
}
