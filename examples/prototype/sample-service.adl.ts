import { FirstProperties } from './schemas/firstProperties.adl';
import { SecondProperties } from './schemas/secondProperties.adl';
import { ThirdProperties } from './schemas/thirdProperties.adl';

/**
 * Resources for SampleService
 * 
 * @description My Sample Service, which is the very nicest service provides resources for my clients
 * 
 * @note order of versions significant
 * 
 * @version 2018-03-01
 * @version 2019-02-12
 * @version 2019-05-06
 * 
 */
export namespace SampleService {
  /** the first resource 
   * 
   * @remarks - the resource fully complies with 
   *            the ARM Resource definition and needs no special treatment.
   */
  type FirstResource = ARM.TrackedEntityResource<'Microsoft.Sample', 'First', FirstProperties>;

  /** 
   * the second resource 
   * 
   * @remarks - this will be a parent resource
  */
  type SecondResource = ARM.TrackedEntityResource<'Microsoft.Sample', 'Second', SecondProperties>;

  /**
   * the third resource
   * 
   * @remarks - this is a subresource under the Second Resource
   */
  type ThirdResource = ARM.TrackedEntitySubResource<SecondResource, 'Third', ThirdProperties>;

  /**
   * the fourth resource
   * 
   * @remarks - this is a new resource.
   * 
   * @since 2019-02-12
   */
  type FourthResource = ARM.TrackedEntityResource<'Microsoft.Sample', 'Fourth', FourthResource>;
}
