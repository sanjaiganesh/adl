import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalized from "../normalized/module";

export interface VirtualMachineScaleSetProperties extends
  VirtualMachineScaleSetBaseProperties,
  VirtualMachineScaleSet20180601Properties {
}
  
export interface VirtualMachineScaleSetBaseProperties {
	sku?: normalized.Sku;
	plan?: normalized.Plan;
	virtualMachineProfile?: normalized.VirtualMachineScaleSetVMProfile;
	readonly provisioningState?: string;
	overprovision?: boolean;
	readonly uniqueId?: string;
	singlePlacementGroup?: boolean;
	zoneBalance?: boolean;
	platformFaultDomainCount?: number;
	proximityPlacementGroup?: normalized.SubResource;
	identity?: normalized.VirtualMachineScaleSetIdentity;
	zones?: string[];
}

export interface VirtualMachineScaleSet20180601Properties {
	upgradePolicy?: normalized.UpgradePolicy;
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20180601 = armtypes.ArmVersionedResource<
	VirtualMachineScaleSetProperties
>;
