import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalized from "../normalized/module";
import * as version20180601 from '../20180601/vmscalesets'

/**
 * Describes a Virtual Machine Scale Set.
 */
export interface VirtualMachineScaleSetProperties extends version20180601.VirtualMachineScaleSetBaseProperties {

  // [sanjai-feature] I couldn't use adltypes.Removed, because the new version also has the property with the same name, but schema updated
  // upgradePolicy?: normalized.UpgradePolicy &
  //   adltypes.Removed;
  upgradePolicy?: UpgradePolicy; // Schema changed in this version

  automaticRepairsPolicy?: AutomaticRepairsPolicy; // New property
  doNotRunExtensionsOnOverprovisionedVMs?: normalized.Boolean; // New property
}

export interface UpgradePolicy {
  mode?: normalized.UpgradeMode;
  rollingUpgradePolicy?: normalized.RollingUpgradePolicy;
  automaticOSUpgradePolicy?: AutomaticOSUpgradePolicy;
}

export interface AutomaticOSUpgradePolicy {
  enableAutomaticOSUpgrade?: normalized.Boolean &
    adltypes.DefaultValue<"False">;

  disableAutomaticRollback?: normalized.Boolean &
    adltypes.DefaultValue<"False">;
}

export interface AutomaticRepairsPolicy {
  enabled?: normalized.Boolean &
    adltypes.DefaultValue<"True">;

  /**
   * Duration in ISO 8601 format. Minimum & default is 30 minutes (PT30M).
	 * [sanjai-feature] How to represent minimum for a string based non-primitive type here.
   */ 
  gracePeriod?: adltypes.duration &
		adltypes.DefaultValue<"PT30M">;
		// adltypes.minimum<"PT30M">
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20181001 = armtypes.ArmVersionedResource<
	VirtualMachineScaleSetProperties
>;
