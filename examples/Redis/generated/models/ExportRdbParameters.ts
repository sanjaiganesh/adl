/**
 * Parameters for Redis export operation.
 */
export interface ExportRdbParameters {
  /**
   * File format.
   */
  format?: string;
  /**
   * Prefix to use for exported files.
   */
  prefix: string;
  /**
   * Container name to export to.
   */
  container: string;
}
