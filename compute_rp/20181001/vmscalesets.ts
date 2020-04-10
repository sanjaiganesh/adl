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

  /**
   * Policy for automatic repairs.
   */
  automaticRepairsPolicy?: AutomaticRepairsPolicy; // New property
  /**
   * When Overprovision is enabled, extensions are launched only on the requested number of VMs
   * which are finally kept. This property will hence ensure that the extensions do not run on the
   * extra overprovisioned VMs.
   */
  doNotRunExtensionsOnOverprovisionedVMs?: boolean; // New property
}

export interface UpgradePolicy extends normalizedModule.UpgradePolicy {
	/**
   * Whether OS upgrades should automatically be applied to scale set instances in a rolling
   * fashion when a newer version of the image becomes available.
   */
  automaticOSUpgrade?: boolean & adltypes.Removed;
	/**
   * Configuration parameters used for performing automatic OS Upgrade.
   */
  autoOSUpgradePolicy?: normalizedModule.AutoOSUpgradePolicy & adltypes.Removed;
  /**
   * Configuration parameters used for performing automatic OS Upgrade.
   */
  automaticOSUpgradePolicy?: AutomaticOSUpgradePolicy;
}

export interface AutomaticOSUpgradePolicy {
  /**
   * Indicates whether OS upgrades should automatically be applied to scale set instances in a
   * rolling fashion when a newer version of the OS image becomes available. Default value is
   * false. If this is set to true for Windows based scale sets, recommendation is to set
   * [enableAutomaticUpdates](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.compute.models.windowsconfiguration.enableautomaticupdates?view=azure-dotnet)
   * to false.
   */
  enableAutomaticOSUpgrade?: boolean &
    adltypes.DefaultValue<false>;

  /**
   * Whether OS image rollback feature should be disabled. Default value is false.
   */
  disableAutomaticRollback?: boolean &
    adltypes.DefaultValue<false>;
}

export interface AutomaticRepairsPolicy {
  /**
   * Specifies whether automatic repairs should be enabled on the virtual machine scale set. The
   * default value is false.
   */
  enabled?: boolean &
    adltypes.DefaultValue<true>;

  /**
   * The amount of time for which automatic repairs are suspended due to a state change on VM. The
   * grace time starts after the state change has completed. This helps avoid premature or
   * accidental repairs. The time duration should be specified in ISO 8601 format. The minimum
   * allowed grace period is 30 minutes (PT30M), which is also the default value.
   */
  gracePeriod?: adltypes.duration &
		adltypes.DefaultValue<"PT30M">;
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