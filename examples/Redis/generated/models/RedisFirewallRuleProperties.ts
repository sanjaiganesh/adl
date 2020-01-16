/**
 * Specifies a range of IP addresses permitted to connect to the cache
 */
export interface RedisFirewallRuleProperties {
  /**
   * lowest IP address included in the range
   */
  startIP: string;
  /**
   * highest IP address included in the range
   */
  endIP: string;
}
