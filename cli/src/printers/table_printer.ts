import { printer } from './printer'

import * as adlruntime from '@azure-tools/adl.runtime'
import { int64 } from '@azure-tools/adl.types';

class tableRow implements Iterable<[number, string, string]> {
  constructor(
    public model: string,
    public version: string,
    public type: string,
    public property: string,
    public dataType: string,
    /*public constraints: string*/) {}
    
  *[Symbol.iterator](): Iterator<[number, string, string]> {
    yield [0, "model", this.model];
    yield [1, "version", this.version];
    yield [2, "type", this.type];
    yield [3, "property", this.property];
    yield [4, "dataType", this.dataType];
    //yield [5, "constraints", this.constraints];
  }
}

export class tablePrinter implements printer {
  private readonly _scope: string;
  private readonly _show_docs: boolean;

  private _model : string;
  private _output_cache : Array<tableRow>;

  public constructor(scope: string, showDocs: boolean) {
    this._scope = scope;
    this._show_docs = showDocs;

    this._output_cache = new Array<tableRow>();
  }

  public printModel(model: adlruntime.ApiModel): void {
    this._model = model.Name;

    // Normalized types
    if (this._scope == "all" || this._scope == "normalized") {
      for (const normalizedType of model.NormalizedTypes) {
        this.printApiTypeModel("normalized", normalizedType.Name, normalizedType, "$.");
      }
    }

    // Versioned types
    if (this._scope == "all" || this._scope == "api-versions" || this._scope == "versioned") {
      for (const apiVersion of model.Versions) {
        for (const versionedType of apiVersion.VersionedTypes) {
          this.printApiTypeModel(apiVersion.Name, versionedType.Name, versionedType, "$.");
        }
      }
    }

    return;
  }

  public flushOutput(): void {
    const header = new tableRow("model", "version", "type", "property", "dataType", /*"constraints"*/);

    let columnWidth = new Array<number>();
    for (const [index, key, value] of header) {
      columnWidth.push(value.length);
    }

    for (const row of this._output_cache) {
      for (const [index, key, value] of row) {
        columnWidth[index] = Math.max(columnWidth[index], value.length);
      }
    }

    let outputLine = "";
    for (const [index, key, value] of header) {
      outputLine += tablePrinter.padValue(value.length > 0 ? value : "null", columnWidth[index] + 4);
    }
    console.log(outputLine);

    for (const row of this._output_cache) {
      let outputLine = "";
      for (const [index, key, value] of row) {
        outputLine += tablePrinter.padValue(value.length > 0 ? value : "null", columnWidth[index] + 4);
      }
      console.log(outputLine);
    }

    this._output_cache = new Array<tableRow>();
  }

  /*
   * Private methods
   */

  private printApiTypeModel(version: string, type: string, model: adlruntime.ApiTypeModel, propertyPrefix: string): void {
    for (const prop of model.Properties) {
      if (prop.isRemoved) continue;

      this._output_cache.push(new tableRow(
        /* model */ this._model,
        /* version */ version,
        /* type */ type,
        /* property */ propertyPrefix + prop.Name,
        /* dataType */ `${prop.DataTypeName}/${prop.AliasDataTypeName}`,
        /* constraints */ /*this.getPropertiesConstraintsAsText(prop)*/));

      if(prop.DataTypeKind == adlruntime.PropertyDataTypeKind.Complex ||
        prop.DataTypeKind == adlruntime.PropertyDataTypeKind.ComplexArray ||
        prop.DataTypeKind == adlruntime.PropertyDataTypeKind.ComplexMap){
            this.printApiTypeModel(version, type, prop.getComplexDataTypeOrThrow(), propertyPrefix + prop.Name + '.');
      }
    }
  }

  private static padValue(value: string, padding: number): string {
    return value + " ".repeat(padding - value.length > 0 ? padding - value.length : 0);
  }
}
