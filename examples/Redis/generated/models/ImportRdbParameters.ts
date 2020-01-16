/**
 * Parameters for Redis import operation.
 */
export interface ImportRdbParameters {
  /**
   * File format.
   */
  format?: string;
  /**
   * files to import.
   */
  files: Array<string>;
}
