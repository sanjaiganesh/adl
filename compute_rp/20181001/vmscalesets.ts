import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalized from "../normalized/module";
import * as version20180601 from '../20180601/vmscalesets'

/**
 * Describes a Virtual Machine Scale Set.
 */
export interface VirtualMachineScaleSetProperties extends version20180601.VirtualMachineScaleSetProperties {
  automaticRepairsPolicy?: AutomaticRepairsPolicy;
  doNotRunExtensionsOnOverprovisionedVMs?: normalized.Boolean;
  // Sanjai-TODO automaticOSUpgradePolicy?: AutomaticOSUpgradePolicy;
}

export interface AutomaticRepairsPolicy {
  enabled?: normalized.Boolean &
    adltypes.DefaultValue<"True">;

  /**
   * Duration in ISO 8601 format. Minimum & default is 30 minutes (PT30M).
   */
  gracePeriod?: adltypes.duration &
    adltypes.DefaultValue<"PT30M">;
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20181001 = armtypes.ArmVersionedResource<
	VirtualMachineScaleSetProperties
>;
