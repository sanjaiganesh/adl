import { ReplicationRole } from '../enums/ReplicationRole';
/**
 * Create properties for a linked server
 */
export interface RedisLinkedServerCreateProperties {
  /**
   * Fully qualified resourceId of the linked redis cache.
   */
  linkedRedisCacheId: string;
  /**
   * Location of the linked redis cache.
   */
  linkedRedisCacheLocation: string;
  /**
   * Role of the linked server.
   */
  serverRole: ReplicationRole;
}
