import * as adlruntime from '@azure-tools/adl.runtime'
import * as adltypes from '@azure-tools/adl.types'
import { ApiTypePropertyModel, PropertyDataTypeKind, PropertyComplexDataType } from '@azure-tools/adl.runtime';
import * as swagger from './swaggerspec'
import * as constants from './../constants'

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

        let spec = {} as swagger.Spec;
        spec.parameters = this.GetCommonParameters();

        // let versionedModel = {} as adlruntime.VersionedApiTypeModel;
        // for (let type of version.VersionedTypes) {
        //   if (type.Name == "virtualmachine"){
        //     versionedModel = type;
        //   }
        // }

        const versionedModel = version.getVersionedType("virtualmachine") as adlruntime.VersionedApiTypeModel;
        console.log(`============= PRINT PATH, VERBS FOR ${versionedModel.Name} with normalized name ${versionedModel.NormalizedApiTypeName}. Response schema refers to the underlying ApiTypeModel`);

        let apiTypeModelsProcessed = new Set<String>();
        let apiTypeModelsToProcess = new Array<adlruntime.ApiTypeModel>();
        apiTypeModelsToProcess.push(versionedModel as adlruntime.ApiTypeModel);
        this.AddSwaggerPath(spec, apiModel.Name, versionedModel, opts, config);

        const definitions = {} as swagger.Definitions;
        while (apiTypeModelsToProcess.length > 0)
        {
          const apiTypeModel = apiTypeModelsToProcess.pop() as adlruntime.ApiTypeModel;
          const definitionName = apiTypeModel.Name;
          if (apiTypeModelsProcessed.has(definitionName)) // skip if already processed
          {
            continue;
          }

          let definition = {} as swagger.Schema;
          console.log(`====== Creating new definition for ${apiTypeModel.Name} with properties...==========`);
          definitions[definitionName] = this.BuildDefinition(apiTypeModel, apiTypeModelsToProcess);
          apiTypeModelsProcessed.add(definitionName);
        }

        spec.definitions = definitions;

        this.PrintSwaggerSpec(spec);
    }

    BuildDefinition(apiTypeModel: adlruntime.ApiTypeModel, apiTypeModelsToProcess: Array<adlruntime.ApiTypeModel>):swagger.Schema
    {
      let definition = {} as swagger.Schema;
      let properties = {} as swagger.Properties;
      definition.description  = (apiTypeModel.Docs != undefined)
        ? definition.description = apiTypeModel.Docs.text
        : `${apiTypeModel.Name} definition.`;

      // sanjai-todo: What are the type of constraints on apiTypeModel. Process them.

      let requiredProperties = new Array<string>();
      apiTypeModel.Properties.forEach(apiTypePropertyModel =>
        {
          if (apiTypePropertyModel.isRemoved)
          {
            console.log(`!!! Removed. skipping property. ${apiTypePropertyModel.Name}- data type name ${apiTypePropertyModel.DataTypeName}`);
          }

          if (apiTypePropertyModel.isOptional == false)
          {
            requiredProperties.push(apiTypePropertyModel.Name);
          }

          // Proces constraints in individual build methods sanjai-todo
          // getMapKeyDataTypeNameOrThrow(): string;
          // getMapValueDataTypeNameOrThrow():string;

          // getDefaultingConstraints(): Array<ConstraintModel>;
          // getValidationConstraints(): Array<ConstraintModel>;
          // getConversionConstraints(): Array<ConstraintModel>;
          // getComplexDataTypeOrThrow(): ApiTypeModel;

          if (adlruntime.isPropertyScalarDataType(apiTypePropertyModel.DataTypeModel))
          {
            console.log(`============= Adding property ${apiTypePropertyModel.Name} of type ${apiTypePropertyModel.DataTypeName} to the definition...==========`);
            properties[apiTypePropertyModel.Name] = this.BuildScalarProperty(apiTypePropertyModel);
          }
          else if (adlruntime.isPropertyComplexDataType(apiTypePropertyModel.DataTypeModel))
          {
            let property = {} as swagger.Schema;
            let apiTypeModelForComplexProperty = (apiTypePropertyModel.DataTypeModel as PropertyComplexDataType).ComplexDataTypeModel;
            console.log(`============= Add $ref property ${apiTypePropertyModel.Name} of type ${apiTypeModelForComplexProperty.Name}  to the definition and queue for further processing...==========`);
            property.$ref = `#/definitions/${apiTypeModelForComplexProperty.Name}`;
            properties[apiTypePropertyModel.Name] = property;

            apiTypeModelsToProcess.push(apiTypeModelForComplexProperty);
          }
          else
          {
            console.log(`============= Unsupported property (for now) ${apiTypePropertyModel.Name}  ...==========`);
          }
        });

      definition.required = requiredProperties.length > 0 ? requiredProperties : undefined;
      definition.properties = properties;
      return definition;
    }
    
    BuildScalarProperty(propertyModel: ApiTypePropertyModel): swagger.Schema
    {
      let property = {} as swagger.Schema;
      property.type = propertyModel.DataTypeName;
      // sanjai-todo process constraints
      this.SetConstraints(property, propertyModel);
      
      // sanjaiga-todo wth. why doesn't it work.?
      // if (propertyModel.Docs != undefined)
      // {
      //   property.description = propertyModel.Docs.text;
      // }

      return property;
    }

    SetConstraints(property: swagger.Schema, propertyModel: ApiTypePropertyModel): void
    {
      // sanjai-todo isAliasDataType and AliasDataTypeName
      if (propertyModel.isNullable)
      {
        this.SetCustomValues(property, "x-nullable", true);
      }
    }

    // Populates the path section of the spec. Curently it assumes the resource type is Tracked (ARM routing type = default)
    AddSwaggerPath(spec:swagger.Spec, providerName:string, apiTypeModel: adlruntime.ApiTypeModel, opts: adlruntime.apiProcessingOptions, config: any|undefined):void{
      const resourceTypeName = apiTypeModel.Name;
      const pathKey = `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/${providerName}/${resourceTypeName}s/${resourceTypeName}Name`;
      let pathObj = {} as swagger.Path;

      let tags = {} as string[] | undefined;
      if (apiTypeModel.Docs != undefined && apiTypeModel.Docs.tags != undefined) {
        tags = Array.from(apiTypeModel.Docs.tags.keys());
      }

      pathObj.put = this.BuildPutOperation(apiTypeModel, tags);
      pathObj.get = this.BuildGetOperation(apiTypeModel, tags);
      
      const paths: { [pathName: string]: swagger.Path } = {};
      paths[pathKey] = pathObj;
      spec.paths = paths;
    }

    private BuildGetOperation(apiTypeModel: adlruntime.ApiTypeModel, tags: string[] | undefined):swagger.Operation
    {
      const resourceTypeName = apiTypeModel.Name;
      let operation = {} as swagger.Operation;
      operation.operationId = `${resourceTypeName}s_Get`;
      operation.description = `Gets ${apiTypeModel.Name}`;
      operation.tags = tags;

      operation.parameters = {} as swagger.Parameter[];
      operation.parameters = this.GetCommonPathParameters();
      // sanjai-todo set resource name parameter
      
      // OK response
      const responses = {} as swagger.Responses;
      const okResponse = {} as swagger.Response;
      okResponse.description = "OK";
      okResponse.schema = {} as swagger.Schema;
      okResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}`;
      responses["200"] = okResponse;

      // sanjai-TODO: x-ms-examples
      operation.responses = responses;

      return operation;
    }

    private BuildPutOperation(apiTypeModel: adlruntime.ApiTypeModel, tags: string[] | undefined):swagger.Operation
    {
      const resourceTypeName = apiTypeModel.Name;
      let operation = {} as swagger.Operation;
      operation.operationId = `${resourceTypeName}s_CreateOrUpdate`;
      operation.description = `Creates or updates ${apiTypeModel.Name}`;
      operation.tags = tags;

      // sanjai-todo Set common parameters in seaprate method
      operation.parameters = {} as swagger.Parameter[];
      operation.parameters = this.GetCommonPathParameters();
      // sanjai-todo set resource name parameter
      // sanjai-todo set resource body parameter

      // OK response
      const responses = {} as swagger.Responses;
      const okResponse = {} as swagger.Response;
      okResponse.description = "Resource creation or update completed.";
      okResponse.schema = {} as swagger.Schema;
      okResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}`;
      responses["200"] = okResponse;

      // sanjai-todo
      // if (apiTypeModel.hasConstraintByName(constants.INTERFACE_NAME_LONGRUNNINGPUTCONSTRAINT))
      // {
      //   const asyncResponse = {} as swagger.Response;
      //   asyncResponse.description = "Resource is created.";
      //   asyncResponse.schema = {} as swagger.Schema;
      //   asyncResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}`;
      //   responses["201"] = asyncResponse;
      // }

      // sanjai-TODO: x-ms-examples
      operation.responses = responses;

      return operation;
    }

    private SetCustomValues(obj: any, key: string, value: any)
    {
      obj[key] = value;
    }

    private GetCommonParameters() {
      const parameters = {} as swagger.Parameters;
      
      const subscriptionIdParam = {} as swagger.PathParameter;
      subscriptionIdParam.description = "The subscription identifier";
      subscriptionIdParam.required = true;
      subscriptionIdParam.in = "path";
      subscriptionIdParam.name = "subscriptionId";
      subscriptionIdParam.type = "string";
      this.SetCustomValues(subscriptionIdParam, "x-ms-parameter-location", "client");
      parameters["SubscriptionIdParameter"] = subscriptionIdParam;

      const resourceGroupParam = {} as swagger.PathParameter;
      resourceGroupParam.description = "The resource group name";
      resourceGroupParam.required = true;
      resourceGroupParam.in = "path";
      resourceGroupParam.name = "resourceGroup";
      resourceGroupParam.type = "string";
      this.SetCustomValues(subscriptionIdParam, "x-ms-parameter-location", "client");
      parameters["ResourceGroupNameParameter"] = resourceGroupParam;

      const apiVersionParam = {} as swagger.QueryParameter;
      apiVersionParam.description = "The api vesrion";
      apiVersionParam.required = true;
      apiVersionParam.in = "query";
      apiVersionParam.name = "api-version";
      apiVersionParam.type = "string";
      this.SetCustomValues(subscriptionIdParam, "x-ms-parameter-location", "client");
      parameters["ApiVersionParameter"] = apiVersionParam;

      return parameters;
    }

    private GetCommonPathParameters(): swagger.Parameter[] {
      const parameters = new Array<swagger.Parameter>();
      
      const subscriptionIdParam = {} as swagger.PathParameter;
      subscriptionIdParam.$ref = "#/parameters/SubscriptionIdParameter";
      parameters.push(subscriptionIdParam);

      const resourceGroupParam = {} as swagger.Parameter;
      resourceGroupParam.$ref = "#/parameters/ResourceGroupNameParameter";
      parameters.push(resourceGroupParam);

      const apiVersionParam = {} as swagger.Parameter;
      apiVersionParam.$ref = "#/parameters/ApiVersionParameter";
      parameters.push(apiVersionParam);

      return parameters;
    }

    PrintSwaggerSpec(spec:swagger.Spec)
    {
      console.log(JSON.stringify(spec, null, 2));
    }
}
