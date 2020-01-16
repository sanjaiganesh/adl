/**
 * Parameters body to pass for resource name availability check.
 */
export interface CheckNameAvailabilityParameters {
  /**
   * Resource name.
   */
  name: string;
  /**
   * Resource type. The only legal value of this property for checking redis cache name availability is 'Microsoft.Cache/redis'.
   */
  type: string;
}
