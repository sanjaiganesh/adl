import * as adltypes from "@azure-tools/adl.types";
import * as armtypes from "@azure-tools/arm.adl";
import * as normalizedModule from "../normalized/module";

export interface VirtualMachineScaleSet20180601Properties extends normalizedModule.VirtualMachineScaleSetBaseProperties {
	upgradePolicy?: normalizedModule.UpgradePolicy;
}

// Wrap in ARM envelope to make it an ARM resource
export type VirtualMachineScaleSet20180601 = armtypes.ArmVersionedResource<VirtualMachineScaleSet20180601Properties>;