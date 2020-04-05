import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalizedModule from "../normalized/module";
import * as version20180601 from '../20180601/vmscalesets'

/**
 * Describes a Virtual Machine Scale Set.
 */
export interface VirtualMachineScaleSet20181001Properties extends version20180601.VirtualMachineScaleSetBaseProperties {

  // [sanjai-feature] I couldn't use adltypes.Removed, because the new version also has the property with the same name, but schema updated
  // upgradePolicy?: normalizedModule.UpgradePolicy &
  //   adltypes.Removed;
  upgradePolicy?: UpgradePolicy; // Schema changed in this version

  automaticRepairsPolicy?: AutomaticRepairsPolicy; // New property
  doNotRunExtensionsOnOverprovisionedVMs?: boolean; // New property
}

export interface UpgradePolicy {
  mode?: normalizedModule.UpgradeMode;
  rollingUpgradePolicy?: normalizedModule.RollingUpgradePolicy;
  automaticOSUpgradePolicy?: AutomaticOSUpgradePolicy;
}

// [sanjai-?] Any better alternative ?
class UpgradePolicyImpl implements UpgradePolicy{}

export interface AutomaticOSUpgradePolicy {
  enableAutomaticOSUpgrade?: boolean &
    adltypes.DefaultValue<false>;

  disableAutomaticRollback?: boolean &
    adltypes.DefaultValue<false>;
}

// [sanjai-?] Any better alternative ?
class AutomaticOSUpgradePolicyImpl implements AutomaticOSUpgradePolicy{}

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
        if (versioned.properties.upgradePolicy && versioned.properties.upgradePolicy.automaticOSUpgradePolicy)
        {
          normalized.properties.upgradePolicy = normalized.properties.upgradePolicy || new normalizedModule.Normalized_UpgradePolicyImpl();    
          normalized.properties.upgradePolicy.automaticOSUpgrade = versioned.properties.upgradePolicy.automaticOSUpgradePolicy.enableAutomaticOSUpgrade;

          // Disable rollback conversion
          if (versioned.properties.upgradePolicy.automaticOSUpgradePolicy.disableAutomaticRollback)
          {
            normalized.properties.upgradePolicy.autoOSUpgradePolicy = new normalizedModule.AutoOSUpgradePolicyImpl();
            normalized.properties.upgradePolicy.autoOSUpgradePolicy.disableAutoRollback = versioned.properties.upgradePolicy.automaticOSUpgradePolicy.disableAutomaticRollback;
          }
        }
    }

		Convert(normalized: armtypes.ArmNormalizedResource<normalizedModule.VirtualMachineScaleSetNormalizedProperties>,
			versioned: armtypes.ArmVersionedResource<VirtualMachineScaleSet20181001Properties>,
			errors: adltypes.errorList):void {
        
        // call arm versioner, since we expect it to also work on its envelop
        const armVersioner = new armtypes.ArmVersioner<normalizedModule.VirtualMachineScaleSetNormalizedProperties, VirtualMachineScaleSet20181001Properties>();
        armVersioner.Normalize(versioned, normalized, errors);
        if(errors.length >0) return;

        if (normalized.properties.upgradePolicy)
        {
          const  automaticOSUpgrade = normalized.properties.upgradePolicy.automaticOSUpgrade;
          const autoOSUpgradePolicy = normalized.properties.upgradePolicy.autoOSUpgradePolicy;
          if (automaticOSUpgrade || autoOSUpgradePolicy)
          {
            // sanjai-? why two constructors required ?
            versioned.properties.upgradePolicy = versioned.properties.upgradePolicy || new UpgradePolicyImpl();
            versioned.properties.upgradePolicy.automaticOSUpgradePolicy = new AutomaticOSUpgradePolicyImpl();
          
            versioned.properties.upgradePolicy.automaticOSUpgradePolicy.enableAutomaticOSUpgrade = automaticOSUpgrade;

            if (autoOSUpgradePolicy)
            {
              versioned.properties.upgradePolicy.automaticOSUpgradePolicy.disableAutomaticRollback = autoOSUpgradePolicy.disableAutoRollback;
            }
          }
        }
    }
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20181001 = armtypes.ArmVersionedResource<
	VirtualMachineScaleSet20181001Properties
>;