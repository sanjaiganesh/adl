import { ProxyResource } from './ProxyResource';
import { RedisFirewallRuleProperties } from './RedisFirewallRuleProperties';
export type RedisFirewallRule = internal.RedisFirewallRule & ProxyResource;
namespace internal {
  /**
   * A firewall rule on a redis cache has a name, and describes a contiguous range of IP addresses permitted to connect
   * 
   * @resourceName FireWallRule
   * @description  FireWall Rule
   */
  export interface RedisFirewallRule {
    /**
     * redis cache firewall rule properties
     */
    properties: RedisFirewallRuleProperties;
  }
}
