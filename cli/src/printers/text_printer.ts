import { printer } from './printer'

import * as adlruntime from '@azure-tools/adl.runtime'

export class textPrinter implements printer {
  private readonly _scope: string;
  private readonly _show_docs: boolean;
  private _prefix: string;

  public constructor(scope: string, showDocs: boolean) {
    this._scope = scope;
    this._show_docs = showDocs;
    this._prefix = "";
  }

  public printModel(model: adlruntime.ApiModel): void {
    // Print api model name
    this._prefix = "";
    console.log(`${this._prefix} Api Model: ${model.Name}`);

    if (this._scope == "all" || this._scope == "normalized") {
      this.printNormalizedTypes(model.NormalizedTypes);
    }

    if (this._scope == "all" || this._scope == "api-versions" || this._scope == "versioned") {
      this.printApiVersions(model.Versions);
    }
  }

  public flushOutput(): void {
    this._prefix = "";
    return;
  }

  /*
   * Private methods
   */

  private printNormalizedTypes(normalizedTypes: Iterable<adlruntime.NormalizedApiTypeModel>): void {
    this._prefix = "";
    // normalized types
    console.log(`${this._prefix} Normalized Types:`);
    for(const normalizedType of normalizedTypes){
        this._prefix = "  ";
        let constraintsAsText = "";
        for(const c of normalizedType.Constraints){
            constraintsAsText = constraintsAsText + c.Name + "\t"
        }
        if(constraintsAsText.length > 0){
            constraintsAsText = "> " + constraintsAsText;
        }
        console.log(`${this._prefix} + Type: ${normalizedType.Name} ${constraintsAsText}`);
        
        this.printDocs(normalizedType.Docs);
        
        this._prefix = "    ";
        
        this.printApiTypeModel(normalizedType);
    }
  }

  private printApiVersions(apiVersions: Iterable<adlruntime.ApiVersionModel>): void {
    if(this._scope != "all" && this._scope != "api-versions" && this._scope != "versioned") return;
    
    // api versions
    console.log(`${this._prefix} Versions:`);
    for(let apiVersion of apiVersions){
        this._prefix = "  ";
        console.log(`${this._prefix} + api-version: ${apiVersion.Name}`);
        this.printDocs(apiVersion.Docs);
        this.printVersionedTypes(apiVersion.VersionedTypes);
    }
  }

  private printDocs(docs: adlruntime.ApiJsDoc | undefined): void {
    if (!this._show_docs) return;
    if(docs == undefined) return;
    console.log(` ${this._prefix}docs:`)
    for(const l of docs.text.split("\n")) {
        console.log(`  ${this._prefix}${l}`);
    }

    console.log(` ${this._prefix}tags:`)
    for(const [k,v] of docs.tags){
        console.log(`  ${this._prefix}${k}: ${v}`)
    }
  }

  private printApiTypeModel(model:adlruntime.ApiTypeModel): void {
    for(const prop  of model.Properties){
      if(prop.isRemoved) return;
      console.log(`${this._prefix} Property:${prop.Name}(${prop.DataTypeName}/${prop.AliasDataTypeName}) ${this.getPropertiesConstraintsAsText(prop)}`);
      if(prop.DataTypeKind == adlruntime.PropertyDataTypeKind.Complex ||
          prop.DataTypeKind == adlruntime.PropertyDataTypeKind.ComplexArray ||
          prop.DataTypeKind == adlruntime.PropertyDataTypeKind.ComplexMap){
              this.printDocs(prop.Docs);
              this._prefix += " ";
              this.printApiTypeModel(prop.getComplexDataTypeOrThrow());
              this._prefix = this._prefix.slice(0, -1);
      }
      if(prop.isMap()){
          let constraintAsText = ""
          for(const c of prop.MapKeyConstraints){
              constraintAsText = constraintAsText + `${c.Name}(` + c.Arguments.join(",") +") | ";
          }

          if(constraintAsText.length > 0)
              console.log(`${this._prefix} * KeyConstraints: ${constraintAsText}`);

          constraintAsText = ""
          for(const c of prop.MapValueConstraints){
              constraintAsText = constraintAsText + `${c.Name}(` + c.Arguments.join(",") +") | ";
          }

          if(constraintAsText.length > 0)
              console.log(`${this._prefix} * ValueConstraints: ${constraintAsText}`);
      }
    }
  }

  private getPropertiesConstraintsAsText(p: adlruntime.ApiTypePropertyModel): string {
    let constraintsAsText = ""
    if(!p.isEnum){
        for(const c of p.Constraints){
            constraintsAsText = `${constraintsAsText} | ${c.Name}(${c.Arguments.join(",")})`;
        }
        return constraintsAsText;
    }
    constraintsAsText = `enum${p.EnumValues}`;
    return constraintsAsText;
  }

  private printVersionedTypes(versionedTypes: Iterable<adlruntime.VersionedApiTypeModel>): void {
    if(this._scope != "all" && this._scope != "versioned") return;
    
    this._prefix = "";

    // types in version    
    for(const versionedType of versionedTypes){
        this._prefix = "    ";
        let constraintsAsText = ""
        for(const c of versionedType.Constraints){
            constraintsAsText = constraintsAsText + c.Name + "\t"
        }

        if(constraintsAsText.length > 0){
            constraintsAsText = "> " + constraintsAsText;
        }

        console.log(`${this._prefix} Type:${versionedType.Name} ${constraintsAsText}`);
        this.printDocs(versionedType.Docs);
        this._prefix = "     ";
        this.printApiTypeModel(versionedType);
    }
  }
}