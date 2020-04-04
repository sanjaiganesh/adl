/*
 *this is a typical version export file
 * for evey type/resource we need to spec:
 * - name
 * - reference to normalized version
 * - a convertor
 */

import * as adltypes from "@azure-tools/adl.types"; // core adl types
import * as armtypes from "@azure-tools/arm.adl"; // arm extentions to adl

// As an rp owner, these are my stuff

// Importing my version-ed types
import { VirtualMachineScaleSet20181001 } from "./vmscalesets";

// importing my normalized types
import * as core from "../normalized/module";

// vm scale set is a top level resource
// note: It does not require any special conversion logic so wre are composing it with  AutoVersioned<T>
// Auto converter can convert between versions based on field names.
export type vmscaleset_resource_20181001 = adltypes.ApiType<
  "vmscalesetnormalized",
  "vmscaleset20181001",
  core.VirtualMachineScaleSetNormalized,
  VirtualMachineScaleSet20181001
>;

// any imperative code needs to be exported at the package level
// export { ResourceFourVersioner_20200909 } from "./resource_four";
// export { ResourceTwo20200909 } from "./resource_two";
