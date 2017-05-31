/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as marked from "marked";
import * as chalk from "chalk";
import * as moment from "moment";
import { argv as cli } from "yargs";

const markedTerminal = require("marked-terminal");

marked.setOptions({
  renderer: new markedTerminal({
    heading: chalk.green.bold,
    firstHeading: chalk.green.bold,
    showSectionPrefix: false,
    strong: chalk.bold.cyan,
    em: chalk.underline,
    blockquote: chalk.dim.gray,
    tab: 2
  })
});

(<any>global).enabled = false;

export function enable(): boolean {
  if (!(<any>global).enabled) {
    const log = console.log;
    const error = console.error;
    const warn = console.warn;
    const info = console.info;
    const debug = console.debug;
    const trace = console.trace;

    console.log = (message?: any, ...optionalParams: any[]) => {
      if (!cli.quiet) {
        log(marked(`${message}`.trim()).trim());
      }
    };

    console.info = (message?: any, ...optionalParams: any[]) => {
      if (cli.verbose) {
        info(chalk.bold.magenta(`[${Timestamp}] `) + marked(`${message}`.trim()).trim());
      }
    };

    console.debug = (message?: any, ...optionalParams: any[]) => {
      if (cli.debug) {
        debug(chalk.bold.yellow(`[${Timestamp}] `) + marked(`${message}`.trim()).trim());
      }
    };

    console.error = (message?: any, ...optionalParams: any[]) => {
      error(chalk.bold.red(`${message}`.trim()).trim());
    };

    console.trace = (message?: any, ...optionalParams: any[]) => {
      if (cli.debug) {
        trace(chalk.bold.yellow(`[${Timestamp}] `) + marked(`${message}`.trim()).trim());
      }
    };

    console.warn = (message?: any, ...optionalParams: any[]) => {
      if (!cli.quiet) {
        warn(chalk.bold.yellow(`[${Timestamp}] `) + marked(`${message}`.trim()).trim());
      }
    }

    (<any>global).enabled = true;
  }
  return true;
}

export const enabled = enable()

export function Timestamp(): string {
  const m = new Date();
  const hh = `${m.getHours()}`;
  const mm = `${m.getMinutes()}`;
  const ss = `${m.getSeconds()}`;

  return chalk.red(`${chalk.gray(hh)}:${chalk.gray(mm)}:${chalk.gray(ss)}`);
}