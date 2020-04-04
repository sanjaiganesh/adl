import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalized from "../normalized/module";

/**
 * Describes a Virtual Machine Scale Set.
 */
export interface VirtualMachineScaleSetProperties {
	sku?: normalized.Sku;
	plan?: normalized.Plan;
	upgradePolicy?: normalized.UpgradePolicy;
	virtualMachineProfile?: normalized.VirtualMachineScaleSetVMProfile;
	readonly provisioningState?: string;
	overprovision?: Boolean;
	readonly uniqueId?: string;
	singlePlacementGroup?: Boolean;
	zoneBalance?: Boolean;
	platformFaultDomainCount?: number;
	proximityPlacementGroup?: normalized.SubResource;
	identity?: normalized.VirtualMachineScaleSetIdentity;
	zones?: string[];
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20180601 = armtypes.ArmVersionedResource<
	VirtualMachineScaleSetProperties
>;
