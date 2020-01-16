import { TlsVersion } from '../enums/TlsVersion';
/**
 * Create/Update/Get common properties of the redis cache.
 */
export interface RedisCommonProperties {
  /**
   * All Redis Settings. Few possible keys: rdb-backup-enabled,rdb-storage-connection-string,rdb-backup-frequency,maxmemory-delta,maxmemory-policy,notify-keyspace-events,maxmemory-samples,slowlog-log-slower-than,slowlog-max-len,list-max-ziplist-entries,list-max-ziplist-value,hash-max-ziplist-entries,hash-max-ziplist-value,set-max-intset-entries,zset-max-ziplist-entries,zset-max-ziplist-value etc.
   */
  redisConfiguration?: AdditionalProperties<string>;
  /**
   * Specifies whether the non-ssl Redis server port (6379) is enabled.
   */
  enableNonSslPort?: boolean;
  /**
   * A dictionary of tenant settings
   */
  tenantSettings?: AdditionalProperties<string>;
  /**
   * The number of shards to be created on a Premium Cluster Cache.
   */
  shardCount?: number & Format<'int32'>;
  /**
   * Optional: requires clients to use a specified TLS version (or higher) to connect (e,g, '1.0', '1.1', '1.2')
   */
  minimumTlsVersion?: TlsVersion;
}
