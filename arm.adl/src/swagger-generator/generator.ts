import * as adlruntime from '@azure-tools/adl.runtime'
import * as adltypes from '@azure-tools/adl.types'
import { ApiTypePropertyModel, PropertyDataTypeKind, PropertyComplexDataType, ApiJsDoc } from '@azure-tools/adl.runtime';
import * as swagger from './swaggerspec'
import * as constants from './../constants'
import { CONSTRAINT_NAME_APIVERSIONNAME } from '@azure-tools/adl.types';

// define types in ./swagger-generator-type.ts
// anything visible outside this module needs to be re-exported in ./module.ts
export class armOpenApiGenerator implements adlruntime.Generator{

    get description(): string{
        return "Generates ARM compliant Open Api schema out of adl models";
    }

    private parseConfig(config: any): Map<string, string>{
        const errorMessage = `[armOpenApiGenerator] Configuration expected in form of 'apimodel=sample_rp,version=2020-01-01,format=yaml'`;
        if(config == undefined){
          throw new Error(errorMessage);
        }
        
        const configString = config as string;
        const values = new Map<string,string>();

        const parts = configString.split(",");
        for(const part of parts){
          const def = part.split("=");
          if(def.length != 2){
            throw new Error(errorMessage);
          }
          
          values.set(def[0], def[1]);
        }

        return values;
    }

    // main entry point for generator. will be called when the user asks to run this specific generator either via cli=>runtime
    // or (whatever wraps runtime)=>runtime
    generate(apiManager:adlruntime.ApiManager, opts: adlruntime.apiProcessingOptions, config: any|undefined):void{
        // note the input is the entire api manager (not just one api-spec but all loaded in that manager)
        // that allows Open Api to generate multiple spec/cross spec/any funcky stuff we want to do.

        const configMap = this.parseConfig(config);
        opts.logger.info(`[armOpenApiGenerator] Got configuration ${configMap}`);

        if(apiManager.ApiModels == undefined){
          throw new Error(`[armOpenApiGenerator] No api model to process. Exiting.`)
        }

        const apiModelName = configMap.get("apimodel");
        if(apiModelName == undefined){
          throw new Error(`[armOpenApiGenerator] Invalid config. Api model must be specified, such as 'apimodel=sample_rp'`);
        }

        // Get the api model
        const apiModel = apiManager.getApiInfo(apiModelName);
        if(apiModel == undefined){
          throw new Error(`[armOpenApiGenerator] Failed to find requested api model.`);
        }

        const apiVersion = configMap.get("version");
        if( apiVersion == undefined){
          throw new Error(`[armOpenApiGenerator] Invalid config. Api version must be specified, such as 'version=2020-01-01'`);
        }

        // Get versioned model
        const apiVersionModel = apiModel.getVersion(apiVersion);
        if(apiVersionModel == undefined){
          throw new Error(`[armOpenApiGenerator] Failed to find requested version in the api model.`);
        }

        opts.logger.info(`[armOpenApiGenerator] Processing provider (api model) '${apiModel.Name}' of apiVersionModel '${apiVersionModel.Name}'`);

        let spec = this.GetBaseOpenApiSpecification(apiModel.Name, apiVersionModel.Name);
        spec.parameters = this.GetCommonParameters(/* includeSubscription */ true, /* includeResourceGroup */true);
        spec.definitions = {} as swagger.Definitions;
        spec.paths = {} as swagger.Paths;
        
        for(const versionedModel of apiVersionModel.VersionedTypes){
          opts.logger.info(`[armOpenApiGenerator] Processing the type ${versionedModel.Name} (normalized: ${versionedModel.NormalizedApiTypeName}).`);

          let apiTypeModelsProcessed = new Set<String>();
          let apiTypeModelsToProcess = new Array<adlruntime.ApiTypeModel>();
          apiTypeModelsToProcess.push(versionedModel);

          // Add resource type path parameter to parameter collection of the spec
          this.AddSpecParameter(
            /* parameters*/ spec.parameters,
            /* name */ `${versionedModel.Name}Name`,
            /* required */ true,
            /* location */ "path",
            /* description */ `${versionedModel.Name}Name parameter`,
            /* type */ "string");

          // Adds GET, PUT, PATCH & DELETE operations
          this.AddBasicCrudOperations(spec, apiModel.Name, versionedModel, opts, config);

          // Adds list operations. Curently it assumes it is resource group level resource.
          this.AddListOperation(
            /* spec */ spec,
            /* path */  `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/${apiModel.Name}/${versionedModel.Name}`,
            /* apiTypeModel */ versionedModel,
            /* operationId */ `${versionedModel.Name}_ListByResourceGroup`,
            /* description */ `Gets list of ${versionedModel.Name} resources for given resource group`,
            /* opts */ opts,
            /* config */ config);

          // Adds list operations. Curently it assumes it is resource group level resource.
          this.AddListOperation(
            /* spec */ spec,
            /* path */ `/subscriptions/{subscriptionId}/providers/${apiModel.Name}/${versionedModel.Name}`,
            /* apiTypeModel */ versionedModel,
            /* operationId */ `${versionedModel.Name}_ListBySubscription`,
            /* description */ `Gets list of ${versionedModel.Name} resources for given subscription`,
            /* opts */ opts,
            /* config */ config);
          
          while (apiTypeModelsToProcess.length > 0){
            const apiTypeModel = apiTypeModelsToProcess.pop() as adlruntime.ApiTypeModel;
            const definitionName = apiTypeModel.Name;
            if(apiTypeModelsProcessed.has(definitionName)){ // skip if already processed
              continue;
            }

            let definition = {} as swagger.Schema;
            opts.logger.verbose(`[armOpenApiGenerator] Creating new definition for ${apiTypeModel.Name} with properties.`);
            spec.definitions[definitionName] = this.BuildDefinition(apiTypeModel, apiTypeModelsToProcess, opts);
            apiTypeModelsProcessed.add(definitionName);
          }
          // list definition for currrent versioned model being processed
          spec.definitions[`${versionedModel.Name}List`] = this.BuildListDefinition(versionedModel.Name);
        };

        // Print the Open Api spec
        this.PrintOpenApiSpec(spec, configMap, opts);
    }

    /** Walks the types and creates Open Api definitions */
    BuildDefinition(apiTypeModel: adlruntime.ApiTypeModel, apiTypeModelsToProcess: Array<adlruntime.ApiTypeModel>, opts: adlruntime.apiProcessingOptions):swagger.Schema{
      let definition = {} as swagger.Schema;
      let properties = {} as swagger.Properties;
      definition.description  = (apiTypeModel.Docs != undefined)
        ? definition.description = apiTypeModel.Docs.text
        : `${apiTypeModel.Name} definition.`;

      let requiredProperties = new Array<string>();
      for(const apiTypePropertyModel of apiTypeModel.Properties){
          if(apiTypePropertyModel.isRemoved){
            opts.logger.verbose(`[armOpenApiGenerator] Removed from current version. Skipping property ${apiTypePropertyModel.Name} of type ${apiTypePropertyModel.DataTypeName}`);
            continue;
          }

          if(!apiTypePropertyModel.isOptional){
            requiredProperties.push(apiTypePropertyModel.Name);
          }

          if(adlruntime.isPropertyScalarDataType(apiTypePropertyModel.DataTypeModel) && !apiTypePropertyModel.isEnum){
            opts.logger.verbose(`[armOpenApiGenerator] Adding property ${apiTypePropertyModel.Name} of type ${apiTypePropertyModel.DataTypeName} to the definition.`);
            properties[apiTypePropertyModel.Name] = this.BuildBasicProperty(apiTypePropertyModel, opts);
          }
          else if(apiTypePropertyModel.isEnum){
            opts.logger.verbose(`[armOpenApiGenerator] Adding property ${apiTypePropertyModel.Name} of type enum to the definition.`);
            properties[apiTypePropertyModel.Name] = this.BuildEnumProperty(apiTypePropertyModel, opts);
          }
          else if(apiTypePropertyModel.DataTypeKind == PropertyDataTypeKind.Map){
            opts.logger.verbose(`[armOpenApiGenerator] Adding property ${apiTypePropertyModel.Name} of type Simple Map to the definition.`);
            properties[apiTypePropertyModel.Name] = this.BuildSimpleMapProperty(apiTypePropertyModel, opts);
          }
          else if(apiTypePropertyModel.DataTypeKind == PropertyDataTypeKind.ComplexMap){
            opts.logger.verbose(`[armOpenApiGenerator] Adding property ${apiTypePropertyModel.Name} of type Simple Map to the definition.`);
            properties[apiTypePropertyModel.Name] = this.BuildComplexMapProperty(apiTypePropertyModel, opts);
            const complexMapDataPropertyType = apiTypePropertyModel.DataTypeModel as adlruntime.PropertyComplexMapDataType;
            apiTypeModelsToProcess.push(complexMapDataPropertyType.ValueComplexDataTypeModel);
          }
          else if(apiTypePropertyModel.DataTypeKind == PropertyDataTypeKind.ScalarArray){
            opts.logger.verbose(`[armOpenApiGenerator] Adding property ${apiTypePropertyModel.Name} of type scalar array to the definition.`);
            properties[apiTypePropertyModel.Name] = this.BuildScalarArrayProperty(apiTypePropertyModel, opts);
          }
          else if(apiTypePropertyModel.DataTypeKind == PropertyDataTypeKind.ComplexArray){
            opts.logger.verbose(`[armOpenApiGenerator] Adding property ${apiTypePropertyModel.Name} of type complex array to the definition.`);
            properties[apiTypePropertyModel.Name] = this.BuildComplexArrayProperty(apiTypePropertyModel, opts);
            const complexArrayDataPropertyType = apiTypePropertyModel.DataTypeModel as adlruntime.PropertyComplexArrayDataType;
            apiTypeModelsToProcess.push(complexArrayDataPropertyType.ElementComplexDataTypeModel);
          }
          else if(adlruntime.isPropertyComplexDataType(apiTypePropertyModel.DataTypeModel)){
            let property = {} as swagger.Schema;
            let apiTypeModelForComplexProperty = (apiTypePropertyModel.DataTypeModel as PropertyComplexDataType).ComplexDataTypeModel;
            opts.logger.verbose(`[armOpenApiGenerator] Add $ref property ${apiTypePropertyModel.Name} of type ${apiTypeModelForComplexProperty.Name} to the definition and queue for further processing.`);
            property.$ref = `#/definitions/${apiTypeModelForComplexProperty.Name}`;
            properties[apiTypePropertyModel.Name] = property;

            apiTypeModelsToProcess.push(apiTypeModelForComplexProperty);
          }
          else{
            opts.logger.verbose(`[armOpenApiGenerator] Unsupported property (for now) ${apiTypePropertyModel.Name} with alias= ${apiTypePropertyModel.AliasDataTypeName} and kind=${apiTypePropertyModel.DataTypeKind}.  .`);
          }
        }

      definition.required = requiredProperties.length > 0 ? requiredProperties : undefined;
      definition.properties = properties;
      return definition;
    }
    
    BuildListDefinition(typeName: string): swagger.Schema{
      let listDefinition = {} as swagger.Schema;
      listDefinition.properties = {} as swagger.Properties;
      let value = {} as swagger.Schema;
      value.type = "array";
      value.items = {} as swagger.Schema;
      value.items.$ref = `#/definitions/${typeName}`
      value.description = `The list of ${typeName}`
      listDefinition.properties["value"] = value;
      let nextLink = {} as swagger.Schema;
      nextLink.type = "string";
      nextLink.description = `The uri to fetch the next set of items for ${typeName}`;
      listDefinition.properties["nextLink"] = nextLink;
      listDefinition.required = ["value"];
      return listDefinition;
    }

    BuildBasicProperty(propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): swagger.Schema{
      let property = {} as swagger.Schema;
      property.type = propertyModel.DataTypeName;

      this.ProcessConstraints(property, propertyModel, opts);
      
      // sanjai-todo why doesn't it work.?
      // if(propertyModel.Docs != undefined)
      // {
      //   property.description = propertyModel.Docs.text;
      // }

      return property;
    }

    /** Builds enum property */
    BuildEnumProperty(propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): swagger.Schema{
      let property = this.BuildBasicProperty(propertyModel, opts);
      property.enum = propertyModel.EnumValues;
      this.SetCustomProperty(property, "x-ms-enum", {"name": propertyModel.Name, "modelAsString": true })

      // Enumerate tags and add documentation under x-ms-enum
      // sanjai-bug same issue. Passes the check, but docs is still undefined.
      // if(propertyModel.Docs != undefined)
      // {
      //   var docs = propertyModel.Docs as ApiJsDoc;
      //   console.log(docs.text);
      //   console.log(docs.tags);
      // }

      return property;
    }

    /** Builds Map property */
    BuildSimpleMapProperty(propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): swagger.Schema{
      // sanjai-todo how to capture constraints on the keys?
      let property = this.BuildBasicProperty(propertyModel, opts);
      property.type = "object";
      const simpleMapDataPropertyType = propertyModel.DataTypeModel as adlruntime.PropertySimpleMapDataType;
      
      let additionalProperties = {} as swagger.Schema;
      additionalProperties.type = simpleMapDataPropertyType.ValueDataTypeName;
      property.additionalProperties = additionalProperties;
      return property;
    }

    /** Builds complex Map property */
    BuildComplexMapProperty(propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): swagger.Schema{
      let property = this.BuildBasicProperty(propertyModel, opts);
      property.type = "object";
      const complexMapDataPropertyType = propertyModel.DataTypeModel as adlruntime.PropertyComplexMapDataType;
      
      let additionalProperties = {} as swagger.Schema;
      additionalProperties.$ref = `#/definitions/${complexMapDataPropertyType.ValueComplexDataTypeName}`;
      property.additionalProperties = additionalProperties;
      return property;
    }

    /** Builds scalar array property */
    BuildScalarArrayProperty(propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): swagger.Schema{
      let property = this.BuildBasicProperty(propertyModel, opts);
      property.type = "array";
      const scalarArrayDataPropertyType = propertyModel.DataTypeModel as adlruntime.PropertySimpleArrayDataType;
      let items = {} as swagger.Schema;
      items.type = scalarArrayDataPropertyType.ElementDataTypeName;
      this.ProcessBasicConstraints(items, scalarArrayDataPropertyType.ElementConstraints, opts);

      property.items = items;
      return property;
    }

    /** Builds complex array property */
    BuildComplexArrayProperty(propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): swagger.Schema{
      let property = this.BuildBasicProperty(propertyModel, opts);
      property.type = "array";
      const complexArrayDataPropertyType = propertyModel.DataTypeModel as adlruntime.PropertyComplexArrayDataType;
      
      let items = {} as swagger.Schema;
      items.$ref = `#/definitions/${complexArrayDataPropertyType.ElementComplexDataTypeName}`;
      property.items = items;
      return property;
    }
    
    ProcessBasicConstraints(property: swagger.Schema, constraints: adlruntime.ConstraintModel[], opts: adlruntime.apiProcessingOptions): void{
      constraints.forEach(constraint =>{
        if(constraint.Name == adltypes.CONSTRAINT_NAME_MUSTMATCH){
          // sanjai-todo: pattern is case sensitive https://swagger.io/docs/specification/data-models/data-types/
          property.pattern = constraint.Arguments[0];
        }

        if(constraint.Name == adltypes.CONSTRAINT_NAME_MINLENGTH){
          property.minLength = Number.parseInt(constraint.Arguments[0]);
        }

        if(constraint.Name == adltypes.CONSTRAINT_NAME_MAXLENGTH){
          property.maxLength = Number.parseInt(constraint.Arguments[0]);
        }

        if(constraint.Name == adltypes.CONSTRAINT_NAME_MINITEMS){
          property.minItems = Number.parseInt(constraint.Arguments[0]);
        }

        if(constraint.Name == adltypes.CONSTRAINT_NAME_MAXITEMS){
          property.maxItems = Number.parseInt(constraint.Arguments[0]);
        }

        if(constraint.Name == adltypes.CONSTRAINT_NAME_RANGE){
          property.maximum = Number.parseInt(constraint.Arguments[0]);
          property.minimum = Number.parseInt(constraint.Arguments[1]);
        }

        if(constraint.Name == adltypes.CONSTRAINT_NAME_MAXIMUM){
          property.maximum = Number.parseInt(constraint.Arguments[0]);
        }

        if(constraint.Name == adltypes.CONSTRAINT_NAME_MINIMUM){
          property.minimum = Number.parseInt(constraint.Arguments[0]);
        }

        if(constraint.Name == adltypes.CONSTRAINT_NAME_MULTIPLEOF){
          property.multipleOf = Number.parseInt(constraint.Arguments[0]);
        }
      });
    }

    ProcessConstraints(property: swagger.Schema, propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): void{
      opts.logger.verbose(`[armOpenApiGenerator] Processing constraints for ${propertyModel.Name}`);
      if(propertyModel.isNullable){
        this.SetCustomProperty(property, "x-nullable", true);
      }

      // Process some basic constratints
      this.ProcessBasicConstraints(property, propertyModel.Constraints, opts);

      let isSecret = false;
      let isMutabilitySet = false;
      propertyModel.Constraints.forEach(constraint =>{
        if(constraint.Name == adltypes.CONSTRAINT_NAME_READONLY){
          // sanjai-feature move this validation into runtime
          if(!propertyModel.isOptional){
            throw new Error("[armOpenApiGenerator] Read only properties cannot be marked as required by a schema.");
          }

          property.readOnly = true;
        }
        else if(constraint.Name == adltypes.CONSTRAINT_NAME_WRITEONLY){
          this.SetCustomProperty(property, "x-ms-mutability", ["create", "update"]);
          isMutabilitySet = true;
        }
        else if(constraint.Name == adltypes.CONSTRAINT_NAME_WRITEONCREATE){
          this.SetCustomProperty(property, "x-ms-mutability", ["create"]);
          isMutabilitySet = true;
        }

        else if(constraint.Name == adltypes.CONSTRAINT_NAME_SECRET){
          isSecret = true;
        }
        else if(constraint.Name == adltypes.CONSTRAINT_NAME_DEFAULTVALUE){
          if(propertyModel.DataTypeName == "number"){
            property.default = Number.parseInt(constraint.Arguments[0]);
          }
          else if(propertyModel.DataTypeName == "boolean"){
            property.default = JSON.parse(constraint.Arguments[0]);
          }
          else if(propertyModel.DataTypeName == "string"){
            property.default = constraint.Arguments[0];
          }
          else{
            throw new Error(`[armOpenApiGenerator] Defaulting is unsupported for type ${propertyModel.DataTypeName}`);
          }
        }
      });

      if(isSecret){
          this.SetCustomProperty(property, "x-ms-secret", true);

          // Default behavior: Secrets must not be returned in GETs. RPs must explicitly add a POST /listKeys* action to return secrets.
          if(!property.readOnly && !isMutabilitySet){
            this.SetCustomProperty(property, "x-ms-mutability", ["create", "update"]);
          }
      }

      opts.logger.verbose('[armOpenApiGenerator] Printing all constraints ');
      let constraints = propertyModel.Constraints;
      this.PrintConstraints(constraints, opts);

      opts.logger.verbose('[armOpenApiGenerator] printing validation constraints ');
      let validationConstraints = propertyModel.getValidationConstraints();
      this.PrintConstraints(validationConstraints, opts);

      opts.logger.verbose('[armOpenApiGenerator] printing defaulting constraints ');
      let defaultingConstraints = propertyModel.getDefaultingConstraints();
      this.PrintConstraints(defaultingConstraints, opts);

      opts.logger.verbose('[armOpenApiGenerator] printing conversion constraints ');
      let conversionConstraints = propertyModel.getConversionConstraints();
      this.PrintConstraints(conversionConstraints, opts);

      if(propertyModel.isArray()){
        opts.logger.verbose('[armOpenApiGenerator] printing array elemement constraints ');
        let arrayElemConstraints = propertyModel.getArrayElementValidationConstraints();
        this.PrintConstraints(arrayElemConstraints, opts);
      }

      if(propertyModel.isMap()){
        opts.logger.verbose('[armOpenApiGenerator] printing map key constraints ');
        let mapKeyConstraints = propertyModel.MapKeyConstraints;
        this.PrintConstraints(mapKeyConstraints, opts);
        opts.logger.verbose('[armOpenApiGenerator] printing map value constraints ');
        let mapValueConstraints = propertyModel.MapValueConstraints;
        this.PrintConstraints(mapValueConstraints, opts);
      }
    }

    PrintConstraints(constraints: adlruntime.ConstraintModel[], opts: adlruntime.apiProcessingOptions): void{
      constraints.forEach(item =>{
        opts.logger.verbose(item.Name);
        if(item.Arguments.length > 0){ opts.logger.verbose(item.Arguments.toString()); }
      });
    }

    // Adds basic crud operations (get, put, delete). Curently it assumes the resource type is Tracked (ARM routing type = default)
    AddBasicCrudOperations(spec:swagger.Spec, providerName:string, apiTypeModel: adlruntime.ApiTypeModel, opts: adlruntime.apiProcessingOptions, config: any|undefined):void{
      const resourceTypeName = apiTypeModel.Name;
      const pathKey = `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/${providerName}/${resourceTypeName}/${resourceTypeName}Name`;
      let pathObj = {} as swagger.Path;

      let tags = undefined;
      if(apiTypeModel.Docs != undefined && apiTypeModel.Docs.tags != undefined){
        tags = Array.from(apiTypeModel.Docs.tags.keys());
      }

      pathObj.put = this.BuildPutOperation(spec, apiTypeModel, tags);
      pathObj.get = this.BuildGetOperation(apiTypeModel, tags);
      pathObj.delete = this.BuildDeleteOperation(apiTypeModel, tags);
      
      spec.paths[pathKey] = pathObj;
    }

    // Adds list operation for given scope
    AddListOperation(spec: swagger.Spec, path: string, apiTypeModel: adlruntime.ApiTypeModel, operationId:string, description: string, opts: adlruntime.apiProcessingOptions, config: any|undefined):void{
      let pathObj = {} as swagger.Path;

      let tags = undefined;
      if(apiTypeModel.Docs != undefined && apiTypeModel.Docs.tags != undefined){
        tags = Array.from(apiTypeModel.Docs.tags.keys());
      }

      pathObj.get = this.BuildListOperation(
        /* apiTypeModel */ apiTypeModel,
        /* operationId */ operationId,
        /* description */ description,
        /* tags */ tags);
      spec.paths[path] = pathObj;
    }

    private BuildGetOperation(apiTypeModel: adlruntime.ApiTypeModel, tags: string[] | undefined):swagger.Operation{
      const resourceTypeName = apiTypeModel.Name;
      let operation = {} as swagger.Operation;
      operation.operationId = `${resourceTypeName}_Get`;
      operation.description = `Gets ${apiTypeModel.Name}`;
      if(tags != undefined){
        operation.tags = tags;
      }

      operation.parameters = {} as swagger.Parameter[];
      operation.parameters = this.GetCommonPathParameters(/* includeSubscription */ true, /* includeResourceGroup */true);
      this.SetPathParameter(operation.parameters, `${apiTypeModel.Name}NameParameter`);
      
      // OK response
      const responses = {} as swagger.Responses;
      const okResponse = {} as swagger.Response;
      okResponse.description = "OK";
      okResponse.schema = {} as swagger.Schema;
      okResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}`;
      responses["200"] = okResponse;

      operation.responses = responses;

      return operation;
    }

    /** Builds a list operation for given scope */
    private BuildListOperation(apiTypeModel: adlruntime.ApiTypeModel, operationId:string, description: string, tags: string[] | undefined):swagger.Operation{
      const resourceTypeName = apiTypeModel.Name;
      let operation = {} as swagger.Operation;
      operation.operationId = operationId;
      operation.description = description;
      if(tags != undefined){
        operation.tags = tags;
      }

      operation.parameters = {} as swagger.Parameter[];
      operation.parameters = this.GetCommonPathParameters(/* includeSubscription */ true, /* includeResourceGroup */true);
      
      // OK response
      const responses = {} as swagger.Responses;
      const okResponse = {} as swagger.Response;
      okResponse.description = "OK";
      okResponse.schema = {} as swagger.Schema;
      okResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}List`;
      responses["200"] = okResponse;
      this.SetCustomProperty(operation, "x-ms-pageable", { "nextLinkName": "nextLink" });

      operation.responses = responses;

      return operation;
    }

    /** Builds PUT operation */
    private BuildPutOperation(spec: swagger.Spec, apiTypeModel: adlruntime.ApiTypeModel, tags: string[] | undefined):swagger.Operation{
      if(spec.parameters == undefined){
        throw new Error("[armswggergen] Spec parameters must be valid");
      }

      const resourceTypeName = apiTypeModel.Name;
      let operation = {} as swagger.Operation;
      operation.operationId = `${resourceTypeName}_CreateOrUpdate`;
      operation.description = `Creates or updates ${apiTypeModel.Name}`;
      if(tags != undefined){
        operation.tags = tags;
      }

      operation.parameters = {} as swagger.Parameter[];
      operation.parameters = this.GetCommonPathParameters(/* includeSubscription */ true, /* includeResourceGroup */true);
      this.SetPathParameter(operation.parameters, `${apiTypeModel.Name}NameParameter`);
      this.AddSpecParameter(
          /* parameters*/ spec.parameters,
          /* name */ apiTypeModel.Name,
          /* required */ true,
          /* location */ "body",
          /* description */ `${apiTypeModel.Name} definition parameter`,
          /* type */ "<unused for body param>");
      this.SetPathParameter(operation.parameters, `${apiTypeModel.Name}Parameter`);

      const responses = {} as swagger.Responses;

      // OK response
      const okResponse = {} as swagger.Response;
      okResponse.description = "Resource creation or update completed.";
      okResponse.schema = {} as swagger.Schema;
      okResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}`;
      responses["200"] = okResponse;

      // sanjai-feature: Express 201 or 202 or both (not ideal) and express final-state-via
      // armtypes.LongRunningPut<201, "azure-async-operation">
      if(apiTypeModel.hasConstraintByName(constants.INTERFACE_NAME_LONGRUNNINGPUTCONSTRAINT)){
        const asyncResponse = {} as swagger.Response;
        asyncResponse.description = "Resource is created.";
        asyncResponse.schema = {} as swagger.Schema;
        asyncResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}`;
        responses["201"] = asyncResponse;

        this.SetCustomProperty(operation, "x-ms-long-running-operation", true);
        this.SetCustomProperty(operation, "x-ms-long-running-operation-options", {
          "final-state-via": "azure-async-operation"
        });
      }

      operation.responses = responses;
      return operation;
    }

    private BuildDeleteOperation(apiTypeModel: adlruntime.ApiTypeModel, tags: string[] | undefined):swagger.Operation{
      const resourceTypeName = apiTypeModel.Name;
      let operation = {} as swagger.Operation;
      operation.operationId = `${resourceTypeName}_Delete`;
      operation.description = `Deletes ${apiTypeModel.Name}`;
      if(tags != undefined){
        operation.tags = tags;
      }

      operation.parameters = {} as swagger.Parameter[];
      operation.parameters = this.GetCommonPathParameters(/* includeSubscription */ true, /* includeResourceGroup */true);
      this.SetPathParameter(operation.parameters, `${apiTypeModel.Name}NameParameter`);
      
      const responses = {} as swagger.Responses;

      // OK response
      const okResponse = {} as swagger.Response;
      okResponse.description = "OK";
      responses["200"] = okResponse;

      // 204 response
      const noContentResponse = {} as swagger.Response;
      noContentResponse.description = "No content";
      responses["204"] = noContentResponse;

      // sanjai-feature: armtypes.LongRunningDelete
      if(apiTypeModel.hasConstraintByName(constants.INTERFACE_NAME_LONGRUNNINGDELETECONSTRAINT)){
        const asyncResponse = {} as swagger.Response;
        asyncResponse.description = "Resource deletion accepted.";
        asyncResponse.schema = {} as swagger.Schema;
        asyncResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}`;
        responses["202"] = asyncResponse;

        this.SetCustomProperty(operation, "x-ms-long-running-operation", true);
        this.SetCustomProperty(operation, "x-ms-long-running-operation-options", {
          "final-state-via": "location"
        });
      }

      operation.responses = responses;

      return operation;
    }

    /** Used to set any custom x-ms-* properties */
    private SetCustomProperty(obj: any, key: string, value: any){
      obj[key] = value;
    }

    /** Returns most common parameters */
    private GetCommonParameters(includeSubscription: boolean, includeResourceGroup: boolean):swagger.Parameters{

      if(!includeSubscription && includeResourceGroup){
        throw new Error("[armOpenApiGenerator] Resource group resource must have a subscription.")
      }

      const parameters = {} as swagger.Parameters;
      
      if(includeSubscription){
        const subscriptionIdParam = {} as swagger.PathParameter;
        subscriptionIdParam.description = "The subscription identifier";
        subscriptionIdParam.required = true;
        subscriptionIdParam.in = "path";
        subscriptionIdParam.name = "subscriptionId";
        subscriptionIdParam.type = "string";
        this.SetCustomProperty(subscriptionIdParam, "x-ms-parameter-location", "client");
        parameters["SubscriptionIdParameter"] = subscriptionIdParam;
      }

      if(includeResourceGroup){
        const resourceGroupParam = {} as swagger.PathParameter;
        resourceGroupParam.description = "The resource group name";
        resourceGroupParam.required = true;
        resourceGroupParam.in = "path";
        resourceGroupParam.name = "resourceGroup";
        resourceGroupParam.type = "string";
        this.SetCustomProperty(resourceGroupParam, "x-ms-parameter-location", "client");
        parameters["ResourceGroupNameParameter"] = resourceGroupParam;
      }

      const apiVersionParam = {} as swagger.QueryParameter;
      apiVersionParam.description = "The api vesrion";
      apiVersionParam.required = true;
      apiVersionParam.in = "query";
      apiVersionParam.name = "api-version";
      apiVersionParam.type = "string";
      this.SetCustomProperty(apiVersionParam, "x-ms-parameter-location", "client");
      parameters["ApiVersionParameter"] = apiVersionParam;

      return parameters;
    }

    /** Returns most common path parameters */
    private GetCommonPathParameters(includeSubscription: boolean, includeResourceGroup: boolean): swagger.Parameter[] {
       
      if(!includeSubscription && includeResourceGroup){
        throw new Error("[armOpenApiGenerator] Resource group resource must have a subscription.")
      }

      const parameters = new Array<swagger.Parameter>();
      
      if(includeSubscription){
        const subscriptionIdParam = {} as swagger.PathParameter;
        subscriptionIdParam.$ref = "#/parameters/SubscriptionIdParameter";
        parameters.push(subscriptionIdParam);
      }

      if(includeResourceGroup){
        const resourceGroupParam = {} as swagger.Parameter;
        resourceGroupParam.$ref = "#/parameters/ResourceGroupNameParameter";
        parameters.push(resourceGroupParam);
      }

      const apiVersionParam = {} as swagger.Parameter;
      apiVersionParam.$ref = "#/parameters/ApiVersionParameter";
      parameters.push(apiVersionParam);

      return parameters;
    }

    /** Adds a spec parameter */
    private AddSpecParameter(parameters: swagger.Parameters, name: string, required: boolean, location: string, description: string, type: string){
      const parameterKey = `${name}Parameter`;
      if(parameters[parameterKey] == undefined){
        if(location == "path"){
        const param = this.BuildPathParameter(
          /* name */ name,
          /* required */ required,
          /* description */ description,
          /* type */ type);
          parameters[parameterKey] = param;
        }
        else if(location == "body"){
        const param = this.BuildBodyParameter(
          /* name */ name,
          /* required */ required,
          /* description */ description);
          parameters[parameterKey] = param;
        }
        else{
          throw new Error(`[armOpenApiGenerator] Unsupported parameter location type ${location}`)
        }
       
      }
    }

    /** Builds path parameter with given details */
    private BuildPathParameter(name: string, required: boolean, description: string, type: string): swagger.PathParameter{
      const param = {} as swagger.PathParameter;
      param.description = description;
      param.required = required;
      param.in = "path";
      param.name = name;
      param.type = type;
      this.SetCustomProperty(param, "x-ms-parameter-location", "method"); // default is method

      return param;
    }

    /** Builds body parameter with given details */
    private BuildBodyParameter(name: string, required: boolean, description: string): swagger.BodyParameter{
      const param = {} as swagger.BodyParameter;
      param.description = description;
      param.required = required;
      param.in = "body";
      param.name = name;
      param.schema = {} as swagger.Schema;
      param.schema.$ref = `#/definitions/${name}`;
      return param;
    }

    /** Sets the given path parameter */
    private SetPathParameter(parameters: swagger.Parameter[], name: string){
      const param = {} as swagger.PathParameter;
      param.$ref = `#/parameters/${name}`;
      parameters.push(param);
    }

    /** Builds base Open Api spec with common (to all specs) objects like info, security etc... */
    GetBaseOpenApiSpecification(clientName: string, apiVersion: string): swagger.Spec{
      let spec = {} as swagger.Spec;
      spec.swagger = "2.0";
      spec.info = {} as swagger.Info;
      spec.info.title = `${clientName}ManagementClient`;
      spec.info.description = `The ${clientName} Management Client.`;
      spec.info.version = apiVersion;

      spec.host = "management.azure.com";
      spec.schemes = ["https"];
      spec.produces = ["application/json"];
      spec.consumes = ["application/json"];
      spec.security = [
          {
            "azure_auth": [
              "user_impersonation"
            ]
          }
        ];
      spec.securityDefinitions =  {
          "azure_auth": {
            "type": "oauth2",
            "description": "Azure Active Directory OAuth2 Flow",
            "flow": "implicit",
            "authorizationUrl": "https://login.microsoftonline.com/common/oauth2/authorize",
            "scopes": {
              "user_impersonation": "impersonate your user account"
            }
          }
        };

      return spec;
    }

    PrintOpenApiSpec(spec:swagger.Spec, configMap: Map<string, string>, opts: adlruntime.apiProcessingOptions){
      let yamlFormat = false;
      const format = configMap.get("format");
      if( format != undefined){
        yamlFormat = (format == "yaml");
        if(format != "yaml" && format != "json"){
          throw new Error(`[armOpenApiGenerator] Invalid format specified in the config: ${format}. Must be either 'yaml' or 'json' `);
        }
      }

      if(yamlFormat){
        var YAML = require('yamljs');
        opts.logger.info(YAML.stringify(spec, 4).replace(/\\\\/g,'\\'));
      }
      else{
        opts.logger.info(JSON.stringify(spec, null, 2).replace(/\\\\/g,'\\'));
      }
    }
}