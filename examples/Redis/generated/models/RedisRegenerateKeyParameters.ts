import { RedisKeyType } from '../enums/RedisKeyType';
/**
 * Specifies which Redis access keys to reset.
 */
export interface RedisRegenerateKeyParameters {
  /**
   * The Redis access key to regenerate.
   */
  keyType: RedisKeyType;
}
