/**
 * Which Redis node(s) to reboot. Depending on this value data loss is possible.
 */
export enum RebootType {
  PrimaryNode = 'PrimaryNode',
  SecondaryNode = 'SecondaryNode',
  AllNodes = 'AllNodes'
}
