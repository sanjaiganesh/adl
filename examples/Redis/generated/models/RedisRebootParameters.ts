import { RebootType } from '../enums/RebootType';
/**
 * Specifies which Redis node(s) to reboot.
 */
export interface RedisRebootParameters {
  /**
   * Which Redis node(s) to reboot. Depending on this value data loss is possible.
   */
  rebootType: RebootType;
  /**
   * If clustering is enabled, the ID of the shard to be rebooted.
   */
  shardId?: number & Format<'int32'>;
}
