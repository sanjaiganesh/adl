import * as adlruntime from '@azure-tools/adl.runtime'
import * as adltypes from '@azure-tools/adl.types'
import { ApiTypePropertyModel, PropertyDataTypeKind, PropertyComplexDataType } from '@azure-tools/adl.runtime';
import * as swagger from './swaggerspec'
import * as constants from './../constants'
import { CONSTRAINT_NAME_APIVERSIONNAME } from '@azure-tools/adl.types';

// define types in ./swagger-generator-type.ts
// anything visible outside this module needs to be re-exported in ./module.ts
export class armSwaggerGenerator implements adlruntime.Generator{

    get description(): string{
        return "Generates ARM compliant swagger schema out of adl models";
    }

    private parseConfig(config: any): Map<string, string>{
        const configString = config as string;
        const values = new Map<string,string>();

        const parts = configString.split(",");
        for(const part of parts){
           const def = part.split("=");
           if(def.length != 2) throw new Error(`[armswaggergen] Configuration expected in form of 'key=val,key=val'`)
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
            throw new Error(`[armswaggergen] Expected configuration was not found`)
         }

        const configMap = this.parseConfig(config);

        // TODO: validate that you got minimum the mandotory keys you need

        // i can write to stderr from here using opts, which carries the same log level the user expects
        opts.logger.info(`[armswaggergen] Got configuration ${configMap}`);
        // use varios logger functions to write what you need it supports err, info, warn, verbose (which is good for debugging).
        // keep in mind user may choose to supress all by setting log level to non.
        // if you want to force a write then use opts.logger.info family of function(highly unrecommended, because we later on use customized cli printers for output).
        // You are free to write to stdout or file.
        // go..

        const apiModel = apiManager.getApiInfo("sample_rp");
        if (apiModel == undefined)
        {
          throw new Error(`[armswaggergen] Expected configuration was not found`)
        }

        const version = apiModel.getVersion("2020-09-09");
        if (version == undefined)
        {
          throw new Error(`[armswaggergen] Expected version was not found`);
        }

        opts.logger.info("[armswaggergen] sample RP version 2020-09-09 loaded");

        let spec = this.GetBaseSwaggerSpecification("sample_rp", "2020-09-09");
        spec.parameters = this.GetCommonParameters(/* includeSubscription */ true, /* includeResourceGroup */true);

        // let versionedModel = {} as adlruntime.VersionedApiTypeModel;
        // for (let type of version.VersionedTypes) {
        //   if (type.Name == "virtualmachine"){
        //     versionedModel = type;
        //   }
        // }

        const versionedModel = version.getVersionedType("virtualmachine") as adlruntime.VersionedApiTypeModel;
        opts.logger.info(`[armswaggergen] Processing the type ${versionedModel.Name} (normalized: ${versionedModel.NormalizedApiTypeName}).`);

        let apiTypeModelsProcessed = new Set<String>();
        let apiTypeModelsToProcess = new Array<adlruntime.ApiTypeModel>();
        apiTypeModelsToProcess.push(versionedModel);
        this.AddSwaggerPath(spec, apiModel.Name, versionedModel, opts, config);
        this.AddSpecParameter(
          /* parameters*/ spec.parameters,
          /* name */ `${versionedModel.Name}Name`,
          /* required */ true,
          /* location */ "path",
          /* description */ `${versionedModel.Name}Name parameter`,
          /* type */ "string");
        
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
          opts.logger.info(`[armswaggergen] Creating new definition for ${apiTypeModel.Name} with properties.`);
          definitions[definitionName] = this.BuildDefinition(apiTypeModel, apiTypeModelsToProcess, opts);
          apiTypeModelsProcessed.add(definitionName);
        }

        spec.definitions = definitions;

        this.PrintSwaggerSpec(spec);
    }

    BuildDefinition(apiTypeModel: adlruntime.ApiTypeModel, apiTypeModelsToProcess: Array<adlruntime.ApiTypeModel>, opts: adlruntime.apiProcessingOptions):swagger.Schema
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
            opts.logger.info(`[armswaggergen] Removed from current version. Skipping property ${apiTypePropertyModel.Name} of type ${apiTypePropertyModel.DataTypeName}`);
          }

          if (apiTypePropertyModel.isOptional == false)
          {
            requiredProperties.push(apiTypePropertyModel.Name);
          }

          if (adlruntime.isPropertyScalarDataType(apiTypePropertyModel.DataTypeModel))
          {
            opts.logger.info(`[armswaggergen] Adding property ${apiTypePropertyModel.Name} of type ${apiTypePropertyModel.DataTypeName} to the definition.`);
            properties[apiTypePropertyModel.Name] = this.BuildScalarProperty(apiTypePropertyModel, opts);
          }
          else if (adlruntime.isPropertyComplexDataType(apiTypePropertyModel.DataTypeModel))
          {
            let property = {} as swagger.Schema;
            let apiTypeModelForComplexProperty = (apiTypePropertyModel.DataTypeModel as PropertyComplexDataType).ComplexDataTypeModel;
            opts.logger.info(`[armswaggergen] Add $ref property ${apiTypePropertyModel.Name} of type ${apiTypeModelForComplexProperty.Name} to the definition and queue for further processing.`);
            property.$ref = `#/definitions/${apiTypeModelForComplexProperty.Name}`;
            properties[apiTypePropertyModel.Name] = property;

            apiTypeModelsToProcess.push(apiTypeModelForComplexProperty);
          }
          else
          {
            opts.logger.info(`[armswaggergen] Unsupported property (for now) ${apiTypePropertyModel.Name}.`);
          }
        });

      definition.required = requiredProperties.length > 0 ? requiredProperties : undefined;
      definition.properties = properties;
      return definition;
    }
    
    BuildScalarProperty(propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): swagger.Schema
    {
      let property = {} as swagger.Schema;
      property.type = propertyModel.DataTypeName;

      this.ProcessConstraints(property, propertyModel, opts);
      
      // sanjai-todo why doesn't it work.?
      // if (propertyModel.Docs != undefined)
      // {
      //   property.description = propertyModel.Docs.text;
      // }

      return property;
    }

    ProcessConstraints(property: swagger.Schema, propertyModel: ApiTypePropertyModel, opts: adlruntime.apiProcessingOptions): void{
      opts.logger.info(`[armswaggergen] Processing constraints for ${propertyModel.Name}`);
      if (propertyModel.isNullable)
      {
        this.SetCustomProperty(property, "x-nullable", true);
      }

      let isSecret = false;
      let isMutabilitySet = false;
      propertyModel.Constraints.forEach(constraint =>{
        if (constraint.Name == adltypes.CONSTRAINT_NAME_READONLY)
        {
          // sanjai-feature move this validation into runtime
          if (!propertyModel.isOptional)
          {
            throw new Error("[armswaggergen] Read only properties cannot be marked as required by a schema.");
          }

          property.readOnly = true;
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_WRITEONLY)
        {
          this.SetCustomProperty(property, "x-ms-mutability", ["create", "update"]);
          isMutabilitySet = true;
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_IMMUTABLE)
        {
          this.SetCustomProperty(property, "x-ms-mutability", ["create"]);
          isMutabilitySet = true;
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_SECRET)
        {
          isSecret = true;
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_MUSTMATCH)
        {
          // sanjai-todo: pattern is case sensitive https://swagger.io/docs/specification/data-models/data-types/
          property.pattern = constraint.Arguments[0]
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_MINLENGTH)
        {
          property.minLength = Number.parseInt(constraint.Arguments[0]);
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_MAXLENGTH)
        {
          property.maxLength = Number.parseInt(constraint.Arguments[0]);
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_MINITEMS)
        {
          property.minItems = Number.parseInt(constraint.Arguments[0]);
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_MAXITEMS)
        {
          property.maxItems = Number.parseInt(constraint.Arguments[0]);
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_RANGE)
        {
          property.maximum = Number.parseInt(constraint.Arguments[0]);
          property.minimum = Number.parseInt(constraint.Arguments[1]);
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_MAXIMUM)
        {
          property.maximum = Number.parseInt(constraint.Arguments[0]);
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_MINIMUM)
        {
          property.minimum = Number.parseInt(constraint.Arguments[0]);
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_MULTIPLEOF)
        {
          property.multipleOf = Number.parseInt(constraint.Arguments[0]);
        }

        if (constraint.Name == adltypes.CONSTRAINT_NAME_DEFAULTVALUE)
        {
          if (propertyModel.DataTypeName == "number")
          {
            property.default = Number.parseInt(constraint.Arguments[0]);
          }
          else if(propertyModel.DataTypeName == "boolean")
          {
            property.default = JSON.parse(constraint.Arguments[0]);
          }
          else if(propertyModel.DataTypeName == "string")
          {
            property.default = constraint.Arguments[0];
          }
          else
          {
            throw new Error(`[armswaggergen] Defaulting is unsupported for type ${propertyModel.DataTypeName}`);
          }
        }
      });

      if (isSecret)
      {
          this.SetCustomProperty(property, "x-ms-secret", true);

          // Default behavior: Secrets must not be returned in GETs. RPs must explicitly add a POST /listKeys* action to return secrets.
          if (!property.readOnly && !isMutabilitySet)
          {
            this.SetCustomProperty(property, "x-ms-mutability", ["create", "update"]);
          }
          opts.logger.info('    # secret #');
      }

      opts.logger.info('[armswaggergen] Printing constraints ');
      let constraints = propertyModel.Constraints;
      this.PrintConstraints(constraints, opts);

      opts.logger.info('[armswaggergen] printing validation constraints ');
      let validationConstraints = propertyModel.getValidationConstraints();
      this.PrintConstraints(validationConstraints, opts);

      opts.logger.info('[armswaggergen] printing defaulting constraints ');
      let defaultingConstraints = propertyModel.getDefaultingConstraints();
      this.PrintConstraints(defaultingConstraints, opts);

      opts.logger.info('[armswaggergen] printing conversion constraints ');
      let conversionConstraints = propertyModel.getConversionConstraints();
      this.PrintConstraints(conversionConstraints, opts);

      if (propertyModel.isArray())
      {
        opts.logger.info('[armswaggergen] printing array elemement constraints ');
        let arrayElemConstraints = propertyModel.getArrayElementValidationConstraints();
        this.PrintConstraints(arrayElemConstraints, opts);
      }

      if (propertyModel.isMap())
      {
        opts.logger.info('[armswaggergen] printing map key constraints ');
        let mapKeyConstraints = propertyModel.MapKeyConstraints;
        this.PrintConstraints(mapKeyConstraints, opts);
        opts.logger.info('[armswaggergen] printing map value constraints ');
        let mapValueConstraints = propertyModel.MapValueConstraints;
        this.PrintConstraints(mapValueConstraints, opts);
      }
    }

    PrintConstraints(constraints: adlruntime.ConstraintModel[], opts: adlruntime.apiProcessingOptions): void{
      constraints.forEach(item =>{
        opts.logger.info(item.Name);
        if (item.Arguments.length > 0){opts.logger.info(item.Arguments.toString());}
      });
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

      pathObj.put = this.BuildPutOperation(spec, apiTypeModel, tags);
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

    /** Builds PUT operation */
    private BuildPutOperation(spec: swagger.Spec, apiTypeModel: adlruntime.ApiTypeModel, tags: string[] | undefined):swagger.Operation
    {
      if (spec.parameters == undefined)
      {
        throw new Error("[armswggergen] Spec parameters must be valid");
      }

      const resourceTypeName = apiTypeModel.Name;
      let operation = {} as swagger.Operation;
      operation.operationId = `${resourceTypeName}s_CreateOrUpdate`;
      operation.description = `Creates or updates ${apiTypeModel.Name}`;
      operation.tags = tags;

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

      // OK response
      const responses = {} as swagger.Responses;
      const okResponse = {} as swagger.Response;
      okResponse.description = "Resource creation or update completed.";
      okResponse.schema = {} as swagger.Schema;
      okResponse.schema.$ref = `#/definitions/${apiTypeModel.Name}`;
      responses["200"] = okResponse;

      // sanjai-feature: Express 201 or 202 or both (not ideal) and express final-state-via
      // armtypes.LongRunningPut<201, "azure-async-operation">
      if (apiTypeModel.hasConstraintByName(constants.INTERFACE_NAME_LONGRUNNINGPUTCONSTRAINT))
      {
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

    /** Used to set any custom x-ms-* properties */
    private SetCustomProperty(obj: any, key: string, value: any)
    {
      obj[key] = value;
    }

    /** Returns most common parameters */
    private GetCommonParameters(includeSubscription: boolean, includeResourceGroup: boolean):swagger.Parameters  {

      if (!includeSubscription && includeResourceGroup)
      {
        throw new Error("[armswaggergen] Resource group resource must have a subscription.")
      }

      const parameters = {} as swagger.Parameters;
      
      if (includeSubscription)
      {
        const subscriptionIdParam = {} as swagger.PathParameter;
        subscriptionIdParam.description = "The subscription identifier";
        subscriptionIdParam.required = true;
        subscriptionIdParam.in = "path";
        subscriptionIdParam.name = "subscriptionId";
        subscriptionIdParam.type = "string";
        this.SetCustomProperty(subscriptionIdParam, "x-ms-parameter-location", "client");
        parameters["SubscriptionIdParameter"] = subscriptionIdParam;
      }

      if (includeResourceGroup)
      {
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
       
      if (!includeSubscription && includeResourceGroup)
      {
        throw new Error("[armswaggergen] Resource group resource must have a subscription.")
      }

      const parameters = new Array<swagger.Parameter>();
      
      if (includeSubscription)
      {
        const subscriptionIdParam = {} as swagger.PathParameter;
        subscriptionIdParam.$ref = "#/parameters/SubscriptionIdParameter";
        parameters.push(subscriptionIdParam);
      }

      if (includeResourceGroup)
      {
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
    private AddSpecParameter(parameters: swagger.Parameters, name: string, required: boolean, location: string, description: string, type: string)  {
      const parameterKey = `${name}Parameter`;
      if (parameters[parameterKey] == undefined)
      {
        if (location == "path")
        {
        const param = this.BuildPathParameter(
          /* name */ name,
          /* required */ required,
          /* description */ description,
          /* type */ type);
          parameters[parameterKey] = param;
        }
        else if (location == "body")
        {
        const param = this.BuildBodyParameter(
          /* name */ name,
          /* required */ required,
          /* description */ description);
          parameters[parameterKey] = param;
        }
        else
        {
          throw new Error(`[armswaggergen] Unsupported parameter location type ${location}`)
        }
       
      }
    }

    /** Builds path parameter with given details */
    private BuildPathParameter(name: string, required: boolean, description: string, type: string): swagger.PathParameter {
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
    private BuildBodyParameter(name: string, required: boolean, description: string): swagger.BodyParameter {
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
    private SetPathParameter(parameters: swagger.Parameter[], name: string) {
      const param = {} as swagger.PathParameter;
      param.$ref = `#/parameters/${name}`;
      parameters.push(param);
    }

    /** Builds base swagger spec with common (to all specs) objects like info, security etc... */
    GetBaseSwaggerSpecification(clientName: string, apiVersion: string): swagger.Spec
    {
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

    PrintSwaggerSpec(spec:swagger.Spec)
    {
      console.log(JSON.stringify(spec, null, 2));
    }
}
