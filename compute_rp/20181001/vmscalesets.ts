import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalized from "../normalized/module";
import * as version20180601 from '../20180601/vmscalesets'

/**
 * Describes a Virtual Machine Scale Set.
 */
export interface VirtualMachineScaleSet20181001Properties extends version20180601.VirtualMachineScaleSetBaseProperties {

  // [sanjai-feature] I couldn't use adltypes.Removed, because the new version also has the property with the same name, but schema updated
  // upgradePolicy?: normalized.UpgradePolicy &
  //   adltypes.Removed;
  upgradePolicy?: UpgradePolicy; // Schema changed in this version

  automaticRepairsPolicy?: AutomaticRepairsPolicy; // New property
  doNotRunExtensionsOnOverprovisionedVMs?: boolean; // New property
}

export interface UpgradePolicy {
  mode?: normalized.UpgradeMode;
  rollingUpgradePolicy?: normalized.RollingUpgradePolicy;
  automaticOSUpgradePolicy?: AutomaticOSUpgradePolicy;
}

export interface AutomaticOSUpgradePolicy {
  enableAutomaticOSUpgrade?: boolean &
    adltypes.DefaultValue<"False">;

  disableAutomaticRollback?: boolean &
    adltypes.DefaultValue<"False">;
}

export interface AutomaticRepairsPolicy {
  enabled?: boolean &
    adltypes.DefaultValue<"True">;

  /**
   * Duration in ISO 8601 format. Minimum & default is 30 minutes (PT30M).
	 * [sanjai-feature] How to represent minimum for a string based non-primitive type here.
   */ 
  gracePeriod?: adltypes.duration &
		adltypes.DefaultValue<"PT30M">;
		// adltypes.minimum<"PT30M">
}

// Versioner implementation
export class VirtualMachineScaleSet20181001VersionerImpl implements
	adltypes.Versioner<normalized.VirtualMachineScaleSetNormalizedProperties, VirtualMachineScaleSet20181001Properties>{

		Normalize(versioned: VirtualMachineScaleSet20181001Properties,
			normalized: normalized.VirtualMachineScaleSetNormalizedProperties,
			errors: adltypes.errorList): void{
				if (normalized.upgradePolicy != undefined &&
					versioned.upgradePolicy != undefined && versioned.upgradePolicy.automaticOSUpgradePolicy != undefined)
					{
						normalized.upgradePolicy.automaticOSUpgrade = versioned.upgradePolicy.automaticOSUpgradePolicy.enableAutomaticOSUpgrade;
					}
    }

		Convert(normalized: normalized.VirtualMachineScaleSetNormalizedProperties,
			versioned:VirtualMachineScaleSet20181001Properties,
			errors: adltypes.errorList):void {
        
    }
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20181001 = armtypes.ArmVersionedResource<
	VirtualMachineScaleSet20181001Properties
>;

// ARM Versioner used by the runtime for normalization and conversion
// [sanjai-?] Even after exporting this, i get error E: VersionedApiTye: 2018-10-01/vmscaleset20181001 reference a non-exported versioner:ArmVersioner. versioner must be exported at package level
//  should we export VirtualMachineScaleSet20181001VersionerImpl instead. ? (adlType.Versioner<>)
export type VirtualMachineScaleSet20181001Versioner =
	armtypes.ArmVersioner<
		normalized.VirtualMachineScaleSetNormalizedProperties,
		VirtualMachineScaleSet20181001Properties,
		VirtualMachineScaleSet20181001VersionerImpl>
