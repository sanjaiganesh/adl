import { RedisFirewallRule } from './RedisFirewallRule';
/**
 * The response of list firewall rules Redis operation.
 */
export interface RedisFirewallRuleListResult {
  /**
   * Results of the list firewall rules operation.
   */
  value?: Array<RedisFirewallRule>;
  /**
   * Link for next page of results.
   */
  readonly nextLink?: string;
}
