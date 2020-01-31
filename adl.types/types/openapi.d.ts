declare namespace OpenAPI {

  class Constant<value extends (string | number)>{ }





  function extensions(...p: Array<any>);
  function mutability(...p: Array<any>);


  //  function Query (target: any, propertyKey: string | symbol, parameterIndex: number) ;
  //  function Body (target: any, propertyKey: string | symbol, parameterIndex: number) ;
  //  function version(...p: Array<any>);
  //  function MediaTypes(...p: Array<any>);
  //  function orHigher(s: string);


  /* Parameter Declarations */

  /** Indicates a Request Body for an HTTP call */
  type Body<ParameterType, MediaType extends string = 'any'> = Parameter<'body', ParameterType, MediaType>;

  /** Indicates a Path parameter for an HTTP call. The parameter may not be optional. */
  type Path<ParameterType, serializedName extends string = undefined> = Parameter<'path', ParameterType, serializedName>;

  /** Indicates a Query parameter for an HTTP call */
  type Query<ParameterType, serializedName extends string = undefined> = Parameter<'query', ParameterType, serializedName>;

  /** Indicates a Header parameter for an HTTP call */
  type Header<ParameterType, serializedName extends string = undefined> = Parameter<'header', ParameterType, serializedName>;

  /** Indicates a Cookie parameter for an HTTP call */
  type Cookie<ParameterType, serializedName extends string = undefined> = Parameter<'cookie', ParameterType, serializedName>;

  /** Parameter Locations */
  type ParameterLocation = 'query' | 'path' | 'cookie' | 'header' | 'body';


  /** A parameter for an HTTP call
   * @argument Location - Location where the parameter is sent. Must be one of type @see ParameterLocation
   * @argument ParameterType - the schema/type of the parameter. 
   * @argument SerializedName - the actual wire name, when different from the d parameter name
    */
  class Parameter<Location extends ParameterLocation, ParameterType, SerializedName extends string = undefined> {
    style: Location;
    type: ParameterType;
    serializedName: SerializedName
  }

  /** Marks an object as having an arbitrary set of additional unnamed properties */
  interface AdditionalProperties<T> {
    [key: string]: T;
  }

  type none = undefined;

  /** an HTTP Response declaration
   * @argument Status - the HTTP Status code to match
   * @argument Type - the body response type
   * @argument MediaType - the media type returned in the 'Content-Type' HTTP Header
   */
  class Response<Status extends Http.StatusCode, Type = undefined, MediaType = any> {
    status: Status;
    type: Type;
    mediaType: MediaType;
  }

  class Exception<Status extends Http.StatusCode, Type = undefined, MediaType = any> {
    status: Status;
    type: Type;
    mediaType: MediaType;
  }

  type JsonResponse<Status extends Http.StatusCode> = Response<Status, 'application/json'>;



  namespace MediaType {
    type ApplicationJson = 'application/json';
    type TextJson = 'text/json';
    type ApplicationXml = 'application/xml';
    type TextXml = 'text/xml';
    type OctetBinary = 'octet/binary'
    const ApplicationJson = 'application/json';
  }

  type TextJson = 'text/json';
  type TextXML = 'text/xml';

}