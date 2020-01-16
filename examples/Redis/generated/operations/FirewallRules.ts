import { RedisFirewallRuleListResult } from '../models/RedisFirewallRuleListResult';
import { RedisFirewallRuleCreateParameters } from '../models/RedisFirewallRuleCreateParameters';
import { RedisFirewallRule } from '../models/RedisFirewallRule';
export class FirewallRules {
  /**
   * Gets all firewall rules in the specified redis cache.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter cacheName - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{cacheName}/firewallRules')
  ListByRedisResource: (subscriptionId: string, resourceGroupName: string, cacheName: string, apiVersion: Query<string, 'api-version'>) => 
    Response<200, RedisFirewallRuleListResult, 'application/json'>;

  /**
   * Create or update a redis cache firewall rule
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter cacheName - The name of the Redis cache.
   * @parameter ruleName - The name of the firewall rule.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Parameters required for creating a firewall rule on redis cache.
   */
  @HttpPut
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{cacheName}/firewallRules/{ruleName}')
  CreateOrUpdate: (subscriptionId: string, resourceGroupName: string, cacheName: string, ruleName: string, apiVersion: Query<string, 'api-version'>, parameters: Body<RedisFirewallRuleCreateParameters, 'application/json'>) => 
    Response<200, RedisFirewallRule, 'application/json'> |
    Response<201, RedisFirewallRule, 'application/json'>;

  /**
   * Gets a single firewall rule in a specified redis cache.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter cacheName - The name of the Redis cache.
   * @parameter ruleName - The name of the firewall rule.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{cacheName}/firewallRules/{ruleName}')
  Get: (subscriptionId: string, resourceGroupName: string, cacheName: string, ruleName: string, apiVersion: Query<string, 'api-version'>) => 
    Response<200, RedisFirewallRule, 'application/json'>;

  /**
   * Deletes a single firewall rule in a specified redis cache.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter cacheName - The name of the Redis cache.
   * @parameter ruleName - The name of the firewall rule.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpDelete
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{cacheName}/firewallRules/{ruleName}')
  Delete: (subscriptionId: string, resourceGroupName: string, cacheName: string, ruleName: string, apiVersion: Query<string, 'api-version'>) => 
    Response<200> |
    Response<204>;

}
