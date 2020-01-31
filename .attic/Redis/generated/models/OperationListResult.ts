import { Operation } from './Operation';
/**
 * Result of the request to list REST API operations. It contains a list of operations and a URL nextLink to get the next set of results.
 */
export interface OperationListResult {
  /**
   * List of operations supported by the resource provider.
   */
  value?: Array<Operation>;
  /**
   * URL to get the next set of operation list results if there are any.
   */
  readonly nextLink?: string;
}
