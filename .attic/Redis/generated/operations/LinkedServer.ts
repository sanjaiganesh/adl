import { RedisLinkedServerCreateParameters } from '../models/RedisLinkedServerCreateParameters';
import { RedisLinkedServerWithProperties } from '../models/RedisLinkedServerWithProperties';
import { RedisLinkedServerWithPropertiesList } from '../models/RedisLinkedServerWithPropertiesList';
export class LinkedServer {
  /**
   * Adds a linked server to the Redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter linkedServerName - The name of the linked server that is being added to the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Parameter required for creating a linked server to redis cache.
   */
  @HttpPut
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/linkedServers/{linkedServerName}')
  Create: (subscriptionId: string, resourceGroupName: string, name: string, linkedServerName: string, apiVersion: Query<string, 'api-version'>, parameters: Body<RedisLinkedServerCreateParameters, 'application/json'>) => 
    Response<200, RedisLinkedServerWithProperties, 'application/json'> |
    Response<201, RedisLinkedServerWithProperties, 'application/json'>;

  /**
   * Deletes the linked server from a redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the redis cache.
   * @parameter linkedServerName - The name of the linked server that is being added to the Redis cache.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpDelete
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/linkedServers/{linkedServerName}')
  Delete: (subscriptionId: string, resourceGroupName: string, name: string, linkedServerName: string, apiVersion: Query<string, 'api-version'>) => 
    Response<200>;

  /**
   * Gets the detailed information about a linked server of a redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the redis cache.
   * @parameter linkedServerName - The name of the linked server.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/linkedServers/{linkedServerName}')
  Get: (subscriptionId: string, resourceGroupName: string, name: string, linkedServerName: string, apiVersion: Query<string, 'api-version'>) => 
    Response<200, RedisLinkedServerWithProperties, 'application/json'>;

  /**
   * Gets the list of linked servers associated with this redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the redis cache.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/linkedServers')
  List: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>) => 
    Response<200, RedisLinkedServerWithPropertiesList, 'application/json'>;

}
