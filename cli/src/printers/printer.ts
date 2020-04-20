import * as adlruntime from '@azure-tools/adl.runtime'

export interface printer {
  printModel(model: adlruntime.ApiModel): void;
  flushOutput(): void;
}