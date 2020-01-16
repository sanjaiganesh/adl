import { CheckNameAvailabilityParameters } from '../models/CheckNameAvailabilityParameters';
import { NotificationListResponse } from '../models/NotificationListResponse';
import { RedisCreateParameters } from '../models/RedisCreateParameters';
import { RedisResource } from '../models/RedisResource';
import { RedisUpdateParameters } from '../models/RedisUpdateParameters';
import { RedisListResult } from '../models/RedisListResult';
import { RedisAccessKeys } from '../models/RedisAccessKeys';
import { RedisRegenerateKeyParameters } from '../models/RedisRegenerateKeyParameters';
import { RedisRebootParameters } from '../models/RedisRebootParameters';
import { RedisForceRebootResponse } from '../models/RedisForceRebootResponse';
import { ImportRdbParameters } from '../models/ImportRdbParameters';
import { ExportRdbParameters } from '../models/ExportRdbParameters';

export type Myresponse = JsonResponse<201>;

export class Redis {
  /**
   * Checks that the redis cache name is valid and is not already in use.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Parameters body to pass for resource name availability check.
   */
  @HttpPost
  @Path('/subscriptions/{subscriptionId}/providers/Microsoft.Cache/CheckNameAvailability')
  CheckNameAvailability: (subscriptionId: string, apiVersion: Query<string, 'api-version'>, parameters: Body<CheckNameAvailabilityParameters, 'application/json'>) =>
    Response<200>;

  /**
   * Gets any upgrade notifications for a Redis cache.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * @parameter history - how many minutes in past to look for upgrade notifications
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/listUpgradeNotifications')
  ListUpgradeNotifications: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>, history: Query<number & Format<'double'>>) =>
    Response<200, NotificationListResponse, 'application/json'>;

  /**
   * Create or replace (overwrite/recreate, with potential downtime) an existing Redis cache.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Parameters supplied to the Create Redis operation.
   */
  @HttpPut
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}')
  Create: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>, parameters: Body<RedisCreateParameters, 'application/json'>) =>
    Response<200, RedisResource, 'application/json'> |
    LongRunningResponse<201, RedisResource, 'application/json', LRO.Location> |
    LongRunningResponse<201, RedisResource, 'application/json', LRO.OriginalUri> |
    LongRunningResponse<201, RedisResource, 'application/json', LRO.AzureAsyncOperation> |

    Myresponse &
    JsonResponse<201> & LRO<RedisResource, Location> & MyHeaderCollection |
    Response<201, 'application/json'> & RedisResource & OriginalUri |
    Response<201, 'application/json'> & RedisResource & AzureAsyncOperation |



    Exception<Http4XX>


  /**
   * Update an existing Redis cache.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Parameters supplied to the Update Redis operation.
   */
  @HttpPatch
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}')
  Update: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>, parameters: Body<RedisUpdateParameters, 'application/json'>) =>
    Response<200, RedisResource, 'application/json'>;

  /**
   * Deletes a Redis cache.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpDelete
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}')
  Delete: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>) =>
    Response<200> |
    Response<202> |
    Response<204>;

  /**
   * Gets a Redis cache (resource description).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}')
  Get: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>) =>
    Response<200, RedisResource, 'application/json'>;

  /**
   * Lists all Redis caches in a resource group.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis')
  ListByResourceGroup: (subscriptionId: string, resourceGroupName: string, apiVersion: Query<string, 'api-version'>) =>
    Response<200, RedisListResult, 'application/json'>;

  /**
   * Gets all Redis caches in the specified subscription.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/providers/Microsoft.Cache/Redis')
  List: (subscriptionId: string, apiVersion: Query<string, 'api-version'>) =>
    Response<200, RedisListResult, 'application/json'>;

  /**
   * Retrieve a Redis cache's access keys. This operation requires write permission to the cache resource.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpPost
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/listKeys')
  ListKeys: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>) =>
    Response<200, RedisAccessKeys, 'application/json'>;

  /**
   * Regenerate Redis cache's access keys. This operation requires write permission to the cache resource.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Specifies which Redis access keys to reset.
   */
  @HttpPost
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/regenerateKey')
  RegenerateKey: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>, parameters: Body<RedisRegenerateKeyParameters, 'application/json'>) =>
    Response<200, RedisAccessKeys, 'application/json'>;

  /**
   * Reboot specified Redis node(s). This operation requires write permission to the cache resource. There can be potential data loss.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Specifies which Redis node(s) to reboot.
   */
  @HttpPost
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/forceReboot')
  ForceReboot: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>, parameters: Body<RedisRebootParameters, 'application/json'>) =>
    Response<200, RedisForceRebootResponse, 'application/json' | 'text/json'>;


  /**
   * Import data into Redis cache.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Parameters for Redis import operation.
   */
  @HttpPost
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/import')
  ImportData: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>, parameters: Body<ImportRdbParameters, 'application/json'>) =>
    Response<200> |
    Response<202> |
    Response<204>;

  /**
   * Export data from the redis cache to blobs in a container.
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Parameters for Redis export operation.
   */
  @HttpPost
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/export')
  ExportData: (subscriptionId: string, resourceGroupName: string, name: string, apiVersion: Query<string, 'api-version'>, parameters: Body<ExportRdbParameters, 'application/json'>) =>
    Response<200> |
    Response<202> |
    Response<204>;

}
