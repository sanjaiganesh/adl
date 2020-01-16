import { OperationDisplay } from './OperationDisplay';
/**
 * REST API operation
 */
export interface Operation {
  /**
   * Operation name: {provider}/{resource}/{operation}
   */
  name?: string;
  /**
   * The object that describes the operation.
   */
  display?: OperationDisplay;
}
