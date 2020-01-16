import { RedisFirewallRuleProperties } from './RedisFirewallRuleProperties';
/**
 * Parameters required for creating a firewall rule on redis cache.
 */
export interface RedisFirewallRuleCreateParameters {
  /**
   * Properties required to create a firewall rule .
   */
  properties: RedisFirewallRuleProperties;
}
