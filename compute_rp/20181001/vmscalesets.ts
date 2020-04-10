import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalizedModule from "../normalized/module";
import * as version20180601 from '../20180601/vmscalesets'

/**
 * Describes a Virtual Machine Scale Set.
 */
export interface VirtualMachineScaleSet20181001Properties extends normalizedModule.VirtualMachineScaleSetBaseProperties {

  /**
   * The upgrade policy.
   */
  upgradePolicy?: UpgradePolicy; // Schema changed in this version

  automaticRepairsPolicy?: AutomaticRepairsPolicy; // New property
  doNotRunExtensionsOnOverprovisionedVMs?: boolean; // New property
}

export interface UpgradePolicy extends normalizedModule.UpgradePolicy {
	// Two properties in previous api version are merged into one and got renamed.
  automaticOSUpgrade?: boolean & adltypes.Removed;
	autoOSUpgradePolicy?: normalizedModule.AutoOSUpgradePolicy & adltypes.Removed;
  automaticOSUpgradePolicy?: AutomaticOSUpgradePolicy;
}

export interface AutomaticOSUpgradePolicy {
  enableAutomaticOSUpgrade?: boolean &
    adltypes.DefaultValue<false>;

  disableAutomaticRollback?: boolean &
    adltypes.DefaultValue<false>;
}

export interface AutomaticRepairsPolicy {
  enabled?: boolean &
    adltypes.DefaultValue<true>;

  /**
   * Duration in ISO 8601 format. Minimum & default is 30 minutes (PT30M).
	 * [sanjai-feature] How to represent minimum for a string based non-primitive type here.
   */ 
  gracePeriod?: adltypes.duration &
		adltypes.DefaultValue<"PT30M">;
		// adltypes.minimum<"PT30M">
}

// Versioner implementation
export class VirtualMachineScaleSet20181001Versioner implements
  adltypes.Versioner<
    armtypes.ArmNormalizedResource<normalizedModule.VirtualMachineScaleSetNormalizedProperties>,
    armtypes.ArmVersionedResource<VirtualMachineScaleSet20181001Properties>>{

		Normalize(versioned: armtypes.ArmVersionedResource<VirtualMachineScaleSet20181001Properties>,
			normalized: armtypes.ArmNormalizedResource<normalizedModule.VirtualMachineScaleSetNormalizedProperties>,
			errors: adltypes.errorList): void{

        // call arm versioner, since we expect it to also work on its envelop
        const armVersioner = new armtypes.ArmVersioner<normalizedModule.VirtualMachineScaleSetNormalizedProperties, VirtualMachineScaleSet20181001Properties>();
        armVersioner.Normalize(versioned, normalized, errors);
        if(errors.length >0) return;

        // Automatic OS upgrade policy conversion
        const versionedUpgradePolicy = versioned.properties.upgradePolicy;
        if (versionedUpgradePolicy && versionedUpgradePolicy.automaticOSUpgradePolicy)
        {
          const upgradePolicy = normalized.properties.upgradePolicy || {} as normalizedModule.UpgradePolicy;    
          upgradePolicy.automaticOSUpgrade = versionedUpgradePolicy.automaticOSUpgradePolicy.enableAutomaticOSUpgrade;

          // Disable rollback conversion
          upgradePolicy.autoOSUpgradePolicy = upgradePolicy.autoOSUpgradePolicy || {} as normalizedModule.AutoOSUpgradePolicy;
          upgradePolicy.autoOSUpgradePolicy.disableAutoRollback = versionedUpgradePolicy.automaticOSUpgradePolicy.disableAutomaticRollback;

          normalized.properties.upgradePolicy = upgradePolicy;
        }
    }

		Convert(normalized: armtypes.ArmNormalizedResource<normalizedModule.VirtualMachineScaleSetNormalizedProperties>,
			versioned: armtypes.ArmVersionedResource<VirtualMachineScaleSet20181001Properties>,
			errors: adltypes.errorList):void {
        
        // call arm versioner, since we expect it to also work on its envelop
        const armVersioner = new armtypes.ArmVersioner<normalizedModule.VirtualMachineScaleSetNormalizedProperties, VirtualMachineScaleSet20181001Properties>();
        armVersioner.Normalize(versioned, normalized, errors);
        if (errors.length >0) return;

        const upgradePolicy = normalized.properties.upgradePolicy;
        if (upgradePolicy)
        {
          const versionedUpgradePolicy = versioned.properties.upgradePolicy || {} as UpgradePolicy;

          // Ensure to use versionedUpgradePolicy.automaticOSUpgradePolicy if it is defaulted. if the versioned is defaulte
          versionedUpgradePolicy.automaticOSUpgradePolicy = versionedUpgradePolicy.automaticOSUpgradePolicy || {} as AutomaticOSUpgradePolicy;

          // For boolean values, explicitly check for undefined
          if (upgradePolicy.automaticOSUpgrade != undefined)
          {
            versionedUpgradePolicy.automaticOSUpgradePolicy.enableAutomaticOSUpgrade = upgradePolicy.automaticOSUpgrade;
          }

          if (upgradePolicy.autoOSUpgradePolicy)
          {
            versionedUpgradePolicy.automaticOSUpgradePolicy.disableAutomaticRollback = upgradePolicy.autoOSUpgradePolicy.disableAutoRollback;
          }

          versioned.properties.upgradePolicy = versionedUpgradePolicy;
        }
    }
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20181001 = armtypes.ArmVersionedResource<
	VirtualMachineScaleSet20181001Properties
>;