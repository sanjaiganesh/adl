import { SkuName } from '../enums/SkuName';
import { SkuFamily } from '../enums/SkuFamily';
/**
 * SKU parameters supplied to the create Redis operation.
 */
export interface Sku {
  /**
   * The type of Redis cache to deploy. Valid values: (Basic, Standard, Premium)
   */
  name: SkuName;
  /**
   * The SKU family to use. Valid values: (C, P). (C = Basic/Standard, P = Premium).
   */
  family: SkuFamily;
  /**
   * The size of the Redis cache to deploy. Valid values: for C (Basic/Standard) family (0, 1, 2, 3, 4, 5, 6), for P (Premium) family (1, 2, 3, 4).
   */
  capacity: number & Format<'int32'>;
}
