import { Api } from '../model/api';

export function loadADL(path: string) {
  // nothing
  const result = new Api();
  result.load(path);

  return result;
}