import { UpgradeNotification } from './UpgradeNotification';
/**
 * The response of listUpgradeNotifications.
 */
export interface NotificationListResponse {
  /**
   * List of all notifications.
   */
  value?: Array<UpgradeNotification>;
  /**
   * Link for next set of notifications.
   */
  readonly nextLink?: string;
}
