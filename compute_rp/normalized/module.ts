// core adl type system
import * as adltypes from "@azure-tools/adl.types";

// my api defs.
import { VirtualMachineScaleSetNormalized } from "./vmscalesets";

// normalized resources
export type VirtualMachineScaleSet = adltypes.NormalizedApiType<
  "vmscalesetnormalized",
  VirtualMachineScaleSetNormalized
>;

// export properties so versioned decleration can see it
export * from "./vmscalesets";

// TODO: remove when loadable runtime feat is done
// we need that because the load logic verify that the library loaded has the
// versioner
export * from "@azure-tools/arm.adl";
