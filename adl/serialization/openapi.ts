import * as OpenAPI from '@azure-tools/openapi';
import { Api } from '../model/api';

/** takes an openapi3 model, converts it into a ADL model, and returns that */
export function loadOpenApi(model: OpenAPI.Model) {
  const result = new Api();

  return result;
}