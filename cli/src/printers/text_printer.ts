import * as  cliprinter  from './printer_types'

import * as adlruntime from '@azure-tools/adl.runtime'

export class textPrinter implements cliprinter.printer {
  private _prefix: string;

  public constructor(private _scope: cliprinter.printerScope) {
    this._prefix = "";
  }

  public printModel(model: adlruntime.ApiModel): void {
    // Print api model name
    this._prefix = "";
    console.log(`${this._prefix} ${cliprinter.emphasis("Api Model:")} ${model.Name}`);

    this.printNormalizedTypes(model.NormalizedTypes);
    this.printApiVersions(model.Versions);
  }

  public flushOutput(): void {
    this._prefix = "";
    return;
  }

  /*
   * Private methods
   */

  private printNormalizedTypes(normalizedTypes: Iterable<adlruntime.NormalizedApiTypeModel>): void {
    if((this._scope & cliprinter.printerScope.normalized ) != cliprinter.printerScope.normalized) return;
    this._prefix = "";
    // normalized types
    console.log(`${this._prefix} ${cliprinter.emphasis("Normalized Types:")}`);
    for(const normalizedType of normalizedTypes){
        this._prefix = "  ";
        let constraintsAsText = "";
        for(const c of normalizedType.Constraints){
            constraintsAsText = constraintsAsText + c.Name + "\t"
        }

        if(constraintsAsText.length > 0){
            constraintsAsText = "> " + constraintsAsText;
        }

        console.log(`${this._prefix} + ${cliprinter.emphasis("Type:")} ${normalizedType.Name} ${constraintsAsText}`);
        this.printDocs(normalizedType.Docs);
        this._prefix = "    ";
        this.printApiTypeModel(normalizedType);
    }
  }

  private printApiVersions(apiVersions: Iterable<adlruntime.ApiVersionModel>): void {
    if((this._scope & cliprinter.printerScope.apiversions ) != cliprinter.printerScope.apiversions) return;

    // api versions
    console.log(`${this._prefix} ${cliprinter.emphasis("Versions:")}`);
    for(let apiVersion of apiVersions){
        this._prefix = "  ";
        console.log(`${this._prefix} + ${cliprinter.emphasis("api-version: ")}${apiVersion.Name}`);
        this.printDocs(apiVersion.Docs);

        if((this._scope & cliprinter.printerScope.versioned) != cliprinter.printerScope.versioned) continue;
        this.printVersionedTypes(apiVersion.VersionedTypes);
    }
  }

  private printDocs(docs: adlruntime.ApiJsDoc | undefined): void {
    if((this._scope & cliprinter.printerScope.docs ) != cliprinter.printerScope.docs) return;

    if(docs == undefined) return;
    console.log(` ${this._prefix}${cliprinter.emphasis("docs:")}`)
    for(const l of docs.text.split("\n")) {
        console.log(`  ${this._prefix}${l}`);
    }

    if(docs.tags.keys.length == 0) return; // no tags
    console.log(` ${this._prefix}${cliprinter.emphasis("tags:")}`)
    for(const [k,v] of docs.tags){
        console.log(`  ${this._prefix}${k}: ${v}`)
    }
  }

  private printApiTypeModel(model:adlruntime.ApiTypeModel): void {
    if(( this._scope & cliprinter.printerScope.properties) != cliprinter.printerScope.properties) return;

    for(const prop  of model.Properties){
      if(prop.isRemoved) return;
      let dataTypeName = prop.DataTypeName;
      if(prop.isAliasDataType) 
        dataTypeName = `(${dataTypeName}/${prop.AliasDataTypeName})` 
      else
        dataTypeName = `(${dataTypeName})`


      console.log(`${this._prefix} ${cliprinter.emphasis("Property:")} ${prop.Name}${dataTypeName}`);
      if(( this._scope & cliprinter.printerScope.constraints) ==  cliprinter.printerScope.constraints){
        console.log(`${this._prefix} ${cliprinter.emphasis("Constraints:")} ${this.getPropertiesConstraintsAsText(prop)}`);
      }

      if(prop.DataTypeKind == adlruntime.PropertyDataTypeKind.Complex ||
          prop.DataTypeKind == adlruntime.PropertyDataTypeKind.ComplexArray ||
          prop.DataTypeKind == adlruntime.PropertyDataTypeKind.ComplexMap){
              this.printDocs(prop.Docs);
              this._prefix += " ";
              console.log(`${this._prefix}${cliprinter.emphasis("Complex Datatype:")} ${prop.DataTypeName}`);
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
              constraintAsText = constraintAsText + `${c.Name}(` + c.Arguments.join(", ") +") | ";
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
            if(constraintsAsText.length == 0)
                constraintsAsText =  `${c.Name}(${c.Arguments.join(",")})`;
            else
                constraintsAsText =  `${constraintsAsText} | ${c.Name}(${c.Arguments.join(", ")})`;
        }

        if(constraintsAsText.length == 0 ) return "NONE";
        return constraintsAsText;
    }
    constraintsAsText = `enum: ${p.EnumValues.join(",")}`;
    return constraintsAsText;
  }

  private printVersionedTypes(versionedTypes: Iterable<adlruntime.VersionedApiTypeModel>): void {
    if((this._scope & cliprinter.printerScope.versioned ) != cliprinter.printerScope.versioned) return;

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

        console.log(`${this._prefix} ${cliprinter.emphasis("Type:")}${versionedType.Name} ${constraintsAsText}`);
        this.printDocs(versionedType.Docs);
        this._prefix = "     ";
        this.printApiTypeModel(versionedType);
    }
  }
}
