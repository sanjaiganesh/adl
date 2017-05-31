/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as con from "./lib/console"

import * as yargs from 'yargs';
import * as os from 'os';

export const enabled = con.enabled

export const cli = yargs
  .usage('Usage: $0 <command> [options]')

  .help('h')
  .alias('h', 'help')
  .wrap(0)
  .epilog('Copyright 2017')
