import * as adlruntime from '@azure-tools/adl.runtime'
import * as adltypes from '@azure-tools/adl.types'
import { ApiTypePropertyModel, PropertyDataTypeKind, PropertyComplexDataType } from '@azure-tools/adl.runtime';

// define types in ./swagger-generator-type.ts
// anything visible outside this module needs to be re-exported in ./module.ts
export class armSwaggerGenerator implements adlruntime.Generator{

    get description(): string{
        return "generates arm compliant swagger schema out of adl models";
    }

    private parseConfig(config: any): Map<string, string>{
        const configString = config as string;
        const values = new Map<string,string>();

        const parts = configString.split(",");
        for(const part of parts){
           const def = part.split("=");
           if(def.length != 2) throw new Error(`armSwaggerGenerator failed, configuration expected in form of 'key=val,key=val'`)
            values.set(def[0], def[1]);
        }

        return values;

    }
    // main entry point for generator. will be called when the user asks to run this specific generator either via cli=>runtime
    // or (whatever wraps runtime)=>runtime
    generate(apiManager:adlruntime.ApiManager, opts: adlruntime.apiProcessingOptions, config: any|undefined):void{
        // note the input is the entire api manager (not just one api-spec but all loaded in that manager)
        // that allows swagger to generate multiple spec/cross spec/any funcky stuff we want to do.
        // What can i do here?
        // answer: anything
        // config is passed in from cli (or whatever wrapps the runtime)
        // for example in our demo we are using x=y,a=c, etc..

         // first we validate that we can work with configuration
         if(config == undefined){
            throw new Error(`armSwaggerGenerator failed, expected configuration was not found`)
         }

        const configMap = this.parseConfig(config);

        // TODO: validate that you got minimum the mandotory keys you need

        // i can write to stderr from here using opts, which carries the same log level the user expects
        opts.logger.info(`armSwaggerGenerator got configuration ${configMap}`);
        // use varios logger functions to write what you need it supports err, info, warn, verbose (which is good for debugging).
        // keep in mind user may choose to supress all by setting log level to non.
        // if you want to force a write then use console.log family of function(highly unrecommended, because we later on use customized cli printers for output).
        // You are free to write to stdout or file.
        // go..
        console.log("ran arm swagger generator");

        const apiModel = apiManager.getApiInfo("sample_rp");
        if (apiModel == undefined)
        {
          throw new Error(`armSwaggerGenerator failed, expected configuration was not found`)
        }
        console.log("sample RP api model loaded");

        const version = apiModel.getVersion("2020-09-09");
        if (version == undefined)
        {
          throw new Error(`armSwaggerGenerator failed, expected configuration was not found`);
        }
        console.log("sample RP version 2020-09-09 loaded");

        if (version.Docs != undefined)
        {
          console.log(version.Docs.text);
        }

        console.log(version.ModuleName);
        console.log(version.Name);
        console.log("printing types")
        // for (let type of version.VersionedTypes)
        // {
        //   console.log(type.Name);
        // }
      
        // const p = version. as ApiTypePropertyModel;
        // const docs = p.Docs;
        // if (docs != undefined)
        // {
          
        // }

        // const dataTypeModel = p.DataTypeModel;
        // if (adlruntime.isPropertyComplexDataType(dataTypeModel))
        // {
        //   dataTypeModel.
        // }
        // if (p.DataTypeKind == PropertyDataTypeKind.Complex)
        // {
        //   const dataTypeModel = p.DataTypeModel as PropertyComplexDataType;

        // }

        const versionedModel = version.getVersionedType("virtualmachine") as adlruntime.VersionedApiTypeModel;
        console.log(`============= PRINT PATH, VERBS FOR ${versionedModel.Name} with normalized name ${versionedModel.NormalizedApiTypeName}. Response schema refers to the underlying ApiTypeModel`);
        let apiTypeModelToProcess = new Array<adlruntime.ApiTypeModel>();
        apiTypeModelToProcess.push(versionedModel as adlruntime.ApiTypeModel);
        while (apiTypeModelToProcess.length > 0)
        {
          const apiTypeModel = apiTypeModelToProcess.pop() as adlruntime.ApiTypeModel;
          console.log(`====== Create new definition for ${apiTypeModel.Name} with properties...==========`);
          apiTypeModel.Properties.forEach(apiTypePropertyModel =>
            {
              if (adlruntime.isPropertyScalarDataType(apiTypePropertyModel.DataTypeModel))
              {
                console.log(`============= Add property ${apiTypePropertyModel.Name}  to the definition...==========`);
              }
              else if (adlruntime.isPropertyComplexDataType(apiTypePropertyModel.DataTypeModel))
              {
                console.log(`============= Add $ref property ${apiTypePropertyModel.Name}  to the definition and queue for further processing...==========`);
                apiTypeModelToProcess.push((apiTypePropertyModel.DataTypeModel as PropertyComplexDataType).ComplexDataTypeModel);
              }
              else
              {
                console.log(`============= Unsupported property (for now) ${apiTypePropertyModel.Name}  ...==========`);
              }
            });
        }
     }
}
