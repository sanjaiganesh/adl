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
import { VirtualMachineScaleSet20181001, VirtualMachineScaleSet20181001Versioner } from "./vmscalesets";

// importing my normalized types
import * as core from "../normalized/module";

// Uses custom versioner for converting one of the properties.
export type vmscaleset_resource_20181001 = adltypes.CustomApiType<
  "vmscalesetnormalized",
  "virtualMachineScaleSets",
  core.VirtualMachineScaleSetNormalized,
  VirtualMachineScaleSet20181001,
  VirtualMachineScaleSet20181001Versioner
>;

// any imperative code needs to be exported at the package level
export { VirtualMachineScaleSet20181001, VirtualMachineScaleSet20181001Versioner } from './vmscalesets'