import { OperationListResult } from '../models/OperationListResult';
export class Operations {
  /**
   * Lists all of the available REST API operations of the Microsoft.Cache provider.
   * @parameter apiVersion - Client Api Version.
   * 
   * @parameter foo
   * 
   */
  @HttpGet
  @Path('/providers/Microsoft.Cache/operations')
  List: (apiVersion: Query<string, 'api-version'>) =>
    Response<200, OperationListResult, 'application/json'>;

}
