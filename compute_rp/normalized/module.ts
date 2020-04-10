// core adl type system
import * as adltypes from "@azure-tools/adl.types";

// my api defs.
import { VirtualMachineScaleSetNormalized, VirtualMachineScaleSetNormalizer } from "./vmscalesets";

// normalized resources
export type VirtualMachineScaleSet = adltypes.CustomNormalizedApiType<
  "vmscalesetnormalized",
  VirtualMachineScaleSetNormalized,
  VirtualMachineScaleSetNormalizer
>;

// export properties so versioned decleration can see it
export * from "./vmscalesets";

// TODO: remove when loadable runtime feat is done
// we need that because the load logic verify that the library loaded has the
// versioner
export * from "@azure-tools/arm.adl";
