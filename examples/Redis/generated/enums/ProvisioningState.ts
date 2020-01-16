/**
 * Redis instance provisioning status.
 */
export enum ProvisioningState {
  Creating = 'Creating',
  Deleting = 'Deleting',
  Disabled = 'Disabled',
  Failed = 'Failed',
  Linking = 'Linking',
  Provisioning = 'Provisioning',
  RecoveringScaleFailure = 'RecoveringScaleFailure',
  Scaling = 'Scaling',
  Succeeded = 'Succeeded',
  Unlinking = 'Unlinking',
  Unprovisioning = 'Unprovisioning',
  Updating = 'Updating'
}
