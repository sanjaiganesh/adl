import { ApiVersion } from '../operations/Parameters';


/*
 * Virtual Disk
 * 
 * @version 2020-02-02
 */
export interface VirtualDisk {
  /**
   * File format.
   */
  format?: string;

  /**
   * size of the disk
   * 
   */
  size: number &
  (Version<'2019-01-01'> |
    (Version<'2020-02-02'> & Minimum<1024>));

  /**
   * name of the disk
   */
  name?: string;

  /**
 * name of the disk
 */
  name2: (
    (Version<'2019-01-01'> & (string | undefined)) |
    (Version<'2019-01-01'> & string)
  );


}

/**
 * Virtual Machine 
 */
export interface VirtualMachine {
  /**
   * 
   */
  disk: VirtualDisk2;
}

/** 
 * @template V - ApiVersion
 * @template T - Type Constraint
 */

const q: VirtualMachine = {
  disk: {
    format: 'hello',
    size: 100,
    name: 'happy'
  }
};