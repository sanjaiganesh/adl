/**
 * The object that describes the operation.
 */
export interface OperationDisplay {
  /**
   * Friendly name of the resource provider
   */
  provider?: string;
  /**
   * Operation type: read, write, delete, listKeys/action, etc.
   */
  operation?: string;
  /**
   * Resource type on which the operation is performed.
   */
  resource?: string;
  /**
   * Friendly name of the operation
   */
  description?: string;
}
