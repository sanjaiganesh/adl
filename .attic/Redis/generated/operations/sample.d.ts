import { OperationListResult } from '../models/OperationListResult';
export class Operationsx {
  /**
   * Lists all of the available REST API operations of the Microsoft.Cache provider.
   * @parameter apiVersion - Client Api Version.
   * 
   * @parameter foo
   * 
   * @protocol  http:{ GET, '/providers/Microsoft.Cache/operations' }
   */
  List(apiVersion: Query<string, 'api-version'>): Response<200, OperationListResult, 'application/json'>;
}
