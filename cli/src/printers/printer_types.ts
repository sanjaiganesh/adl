import * as adlruntime from '@azure-tools/adl.runtime'

export interface printer {
  printModel(model: adlruntime.ApiModel): void;
  flushOutput(): void;
}


export enum printerScope{
  apiversions =  1 << 1,
  normalized  =  1 << 2,
  versioned   =  1 << 3 | apiversions,
  types       =  1 << 4 | normalized | versioned,
  properties  =  1 << 5 | types,
  docs        =  1 << 6 | properties | types,
  constraints =  1 << 7 | properties | types,
  all = apiversions | normalized | versioned | properties | constraints
}

export const Reset:string = "\x1b[0m"
export const FgYellow:string = "\x1b[33m"
export const Bright:string = "\x1b[1m"
export function emphasis(s:string): string{
    return `${Bright}${FgYellow}${s}${Reset}`
}

