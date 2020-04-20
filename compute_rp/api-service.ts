import * as adltypes from "@azure-tools/adl.types";

/* Here is the definition of a service
 * note there is no definition of "service" and its metadaa as
 * name, description, version etc. All of this is expected to be in meta api.
 */

//these are all the types involved in this service definition
export * from "./normalized/module";
export * from "./20180601/module";
export * from "./20181001/module";


  /**
   * Project Cairo supports documentation in various places, one of which is "api-version".
   * for examle we can use this to briefly describe the version, what is new in itt etc.
   * these docs can go into swagger/open-api or can be end user facing documentation.
   *
   * @brief: we also support tags.
   */
export type apiVersion_20180601 = adltypes.ApiVersion<"2018-06-01", "fancy-display-name"> & adltypes.ModuleName<"20180601">;
  /**
   * Project Cairo supports documentation in various places, one of which is "api-version".
   * for examle we can use this to briefly describe the version, what is new in itt etc.
   * these docs can go into swagger/open-api or can be end user facing documentation.
   *
   * @brief: we also support tags.
   */
export type apiVersion_20181001 = adltypes.ApiVersion<"2018-10-01", "fancy-display-name"> & adltypes.ModuleName<"20181001">;
