

declare class Constant<value extends (string | number)>{ }





declare function extensions(...p: Array<any>);
declare function mutability(...p: Array<any>);


// declare function Query (target: any, propertyKey: string | symbol, parameterIndex: number) ;
// declare function Body (target: any, propertyKey: string | symbol, parameterIndex: number) ;
// declare function version(...p: Array<any>);
// declare function MediaTypes(...p: Array<any>);
// declare function orHigher(s: string);


/* Parameter Declarations */

/** Indicates a Request Body for an HTTP call */
declare type Body<ParameterType, MediaType extends string = 'any'> = Parameter<'body', ParameterType, MediaType>;

/** Indicates a Path parameter for an HTTP call. The parameter may not be optional. */
declare type Path<ParameterType, serializedName extends string = undefined> = Parameter<'path', ParameterType, serializedName>;

/** Indicates a Query parameter for an HTTP call */
declare type Query<ParameterType, serializedName extends string = undefined> = Parameter<'query', ParameterType, serializedName>;

/** Indicates a Header parameter for an HTTP call */
declare type Header<ParameterType, serializedName extends string = undefined> = Parameter<'header', ParameterType, serializedName>;

/** Indicates a Cookie parameter for an HTTP call */
declare type Cookie<ParameterType, serializedName extends string = undefined> = Parameter<'cookie', ParameterType, serializedName>;

/** Parameter Locations */
type ParameterLocation = 'query' | 'path' | 'cookie' | 'header' | 'body';


// declare type OneOf<T,T2 = void ,T3 = void ,T4 = void,T5 = void,T6 = void,T7 = void, T8=void, T9 = void, T10 = void> = T | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10;





/** A parameter for an HTTP call
 * @argument Location - Location where the parameter is sent. Must be one of type @see ParameterLocation
 * @argument ParameterType - the schema/type of the parameter. 
 * @argument SerializedName - the actual wire name, when different from the declared parameter name
  */
declare class Parameter<Location extends ParameterLocation, ParameterType, SerializedName extends string = undefined> {
  style: Location;
  type: ParameterType;
  serializedName: SerializedName
}

/** Marks an object as having an arbitrary set of additional unnamed properties */
declare interface AdditionalProperties<T> {
  [key: string]: T;
}

declare type none = undefined;

/** an HTTP Response declaration
 * @argument Status - the HTTP Status code to match
 * @argument Type - the body response type
 * @argument MediaType - the media type returned in the 'Content-Type' HTTP Header
 */
declare class Response<Status extends HttpStatusCode, Type = undefined, MediaType = any> {
  status: Status;
  type: Type;
  mediaType: MediaType;
}

declare type JsonResponse<Status extends HttpStatusCode> = Response<Status, 'application/json'>;

declare class Format<T> {
}
declare class Pattern<t> {
}
declare class MaxLength<N extends number> {
}
declare class MinLength<N extends number> {
}
declare class MultipleOf<N extends number>{
}
declare class Maximum<N extends number> {
}
declare class Minimum<N extends number> {
}
declare class ExclusiveMaximum<N extends number> {
}
declare class ExclusiveMinimum<N extends number> {
}
declare class MaxItems<N extends number> {
}
declare class MinItems<N extends number> {
}
declare type ByteArray = 'ByteArray'

declare type Stream = 'stream' | 'Stream'
declare type Char = 'char' | 'Char'
declare type Date = 'date' | 'Date'
declare type DateTime = 'date-time' | 'datetime' | 'DateTime'
declare type Duration = 'duration' | 'Duration'
declare type UUID = 'uuid' | 'guid'
declare type Url = 'url' | 'URL' | 'Url'
declare type Password = 'password' | 'Password'
declare type Int32 = 'int32' | 'Int32' | 'Integer' | 'integer' | 'int' | 'Int'
declare type Int64 = 'int64' | 'Int64'
declare type Byte = 'int8' | 'Byte' | 'byte'

declare namespace MediaType {
  type ApplicationJson = 'application/json';
  type TextJson = 'text/json';
  type ApplicationXml = 'application/xml';
  type TextXml = 'text/xml';
  type OctetBinary = 'octet/binary'
  const ApplicationJson = 'application/json';
}

declare type TextJson = 'text/json';
declare type TextXML = 'text/xml';

//declare type HttpStatusCode = 100 | 101 | 200 | 201 | 202 |203 | 204 | 205 | 206 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 426 | 500 | 501 | 502 | 503 | 504 | 505 | 'default' | '2xx' | '3xx' | '4xx' | '5xx'; 




