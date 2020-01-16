import { RedisPatchScheduleListResult } from '../models/RedisPatchScheduleListResult';
import { RedisPatchSchedule } from '../models/RedisPatchSchedule';

type something = Deprecated<'2018-01-10', Header<string>>

@ContentType(MediaType.ApplicationJson, MediaType.ApplicationJson)
export class PatchSchedules {
  /**
   * Gets all patch schedules in the specified redis cache (there is only one).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter cacheName - The name of the Redis cache.
   * @parameter apiVersion - Client Api Version.
   * 
   * @returns 200 - RedisPatchScheduleListResult 
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{cacheName}/patchSchedules')
  ListByRedisResource: (
    subscriptionId: string,
    resourceGroupName: string,
    cacheName: string,
    apiVersion: Query<string, 'api-version'>) =>
    Response<200, RedisPatchScheduleListResult, 'application/json'>;

  /**
   * Create or replace the patching schedule for Redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group for this thing.
   * @parameter name - The name of the Redis cache.
   * @parameter Default - Default string modeled as parameter for auto generation to work correctly.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Response to put/get patch schedules for Redis cache.
   * 
   * @version 2018-01-01+
   * @deprecated 2019-01-01+
   */
  @HttpPut
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/patchSchedules/{default}')
  @Name('CreateOrUpdate')
  CreateOrUpdate: (
    subscriptionId: string,
    resourceGroupName: string,
    name: string,
    $default: Path<Constant<'default'>, 'default'>,
    apiVersion: Query<string, 'api-version'>,
    parameters: Body<RedisPatchSchedule, 'application/json'>,
    foo?: ,
    headers?: Headers<CommonHeaders>,
    cookies?: Cookies<{}>, query?: Queries<{}>) =>
    Response<Default, 'application/json'> & RedisPatchSchedule & MyHeaders |
    Response<200, RedisPatchSchedule, 'application/json'> & Header<{}> |
    Response<201, RedisPatchSchedule, 'application/json'>;


  /**
   * Create or replace the patching schedule for Redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the Redis cache.
   * @parameter Default - Default string modeled as parameter for auto generation to work correctly.
   * @parameter apiVersion - Client Api Version.
   * @parameter parameters - Response to put/get patch schedules for Redis cache
   * 
   * @added 2019-01-01
   * @deprecated 2019-06-06 
   * @deleted 2020-01-01
   * 
   */
  @HttpPut('application/json', '')
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/patchSchedules/{default}')
  @Name('CreateOrUpdate') // used to override the name when overloads are necessary.
  CreateOrUpdate$2: (
    subscriptionId: string,
    resourceGroupName: string,
    name: string,
    $default: Path<Constant<'default'>, 'default'>,
    apiVersion: Query<string, 'api-version'>,
    parameters: Body<RedisPatchSchedule>,
    headers?: Headers<{ 'x-ms-foo': string; 'cache-until': Duration }>,
    cookies?: Cookies<{}>, query?: Queries<{}>)
    =>
    Response<OK, 'application/json'> & RedisPatchSchedule |
    Response<200, RedisPatchSchedule, 'application/json'> & Header<AdditionalProperties<string>> |
    Response<201, RedisPatchSchedule, 'application/json'>;



  /**
   * Deletes the patching schedule of a redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the redis cache.
   * @parameter Default - Default string modeled as parameter for auto generation to work correctly.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpDelete
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/patchSchedules/{default}')
  Delete: (subscriptionId: string, resourceGroupName: string, name: string, Default: Path<'default', 'default'>, apiVersion: Query<string, 'api-version'>) =>
    Response<200> |
    Response<204>;

  /**
   * Gets the patching schedule of a redis cache (requires Premium SKU).
   * @parameter subscriptionId - Gets subscription credentials which uniquely identify the Microsoft Azure subscription. The subscription ID forms part of the URI for every service call.
   * @parameter resourceGroupName - The name of the resource group.
   * @parameter name - The name of the redis cache.
   * @parameter Default - Default string modeled as parameter for auto generation to work correctly.
   * @parameter apiVersion - Client Api Version.
   */
  @HttpGet
  @Path('/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Cache/Redis/{name}/patchSchedules/{default}')
  Get: (subscriptionId: string, resourceGroupName: string, name: string, Default: Path<'default', 'default'>, apiVersion: Query<string, 'api-version'>) =>
    Response<200, RedisPatchSchedule, 'application/json'>;

}
