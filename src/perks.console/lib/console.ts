/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as marked from "marked";
import * as chalk from "chalk";
import * as moment from "moment";
import * as yargs from 'yargs';

const markedTerminal = require("marked-terminal");

marked.setOptions({
  renderer: new markedTerminal({
    heading: chalk.green.bold,
    firstHeading: chalk.green.bold.underline,
    showSectionPrefix: false,
    strong: chalk.bold.cyan,
    em: chalk.underline,
    blockquote: chalk.reset.gray,
    code: chalk.reset.cyan,
    codespan: chalk.reset.bold.gray,
    tableOptions: {
      chars: {
        'top': '', 'top-mid': '', 'top-left': '', 'top-right': ''
        , 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
        , 'left': '', 'left-mid': '', 'mid': '', 'mid-mid': ''
        , 'right': '', 'right-mid': '', 'middle': ''
      }
    },
    tab: 2
  })
});

(<any>global).console_monkeypatched = false;

export function enable(): boolean {

  if (!(<any>global).console_monkeypatched) {
    const log = console.log;
    const error = console.error;
    const warn = console.warn;
    const info = console.info;
    const debug = console.debug;
    const trace = console.trace;

    const _quiet = yargs.argv.quiet;
    const _verbose = yargs.argv.verbose;
    const _debug = yargs.argv.debug;


    console.log = (message?: any, ...optionalParams: any[]) => {
      if (!_quiet) {
        process.stdout.write(marked(`${message}`.trim()).trim() + '\n');
      }
    };

    console.info = (message?: any, ...optionalParams: any[]) => {
      if (_verbose) {
        process.stdout.write(chalk.bold.magenta(`[${Timestamp}] `) + marked(`${message}`.trim()).trim() + '\n');
      }
    };

    console.debug = (message?: any, ...optionalParams: any[]) => {
      if (_debug) {
        process.stdout.write(chalk.bold.yellow(`[${Timestamp}] `) + marked(`${message}`.trim()).trim() + '\n');
      }
    };

    console.error = (message?: any, ...optionalParams: any[]) => {
      process.stderr.write(chalk.bold.red(`${message}`.trim()).trim() + '\n');
    };

    console.trace = (message?: any, ...optionalParams: any[]) => {
      if (_debug) {
        process.stdout.write(chalk.bold.yellow(`[${Timestamp}] `) + marked(`${message}`.trim()).trim() + '\n');
      }
    };

    console.warn = (message?: any, ...optionalParams: any[]) => {
      if (!_quiet) {
        process.stdout.write(chalk.bold.yellow(`[${Timestamp}] `) + marked(`${message}`.trim()).trim() + '\n');
      }
    }

    (<any>global).console_monkeypatched = true;


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

export interface IYargs extends yargs.Argv {
  app(name: string): IYargs;
  title(text: string): IYargs;
  copyright(text: string): IYargs;

}

let _copyright = "Copyright 2017.";
let _title = "";
let _name = "$0";

export const cli: IYargs = <IYargs>yargs;

cli.app = (name: string) => {
  _name = name;
  (<any>cli).$0 = name;
  cli.usage(`# ${_title}\n${_copyright}\n## Usage: ${_name} <command> [options]`);
  return cli;
};

cli.copyright = (text: string) => {
  _copyright = text
  cli.usage(`# ${_title}\n${_copyright}\n## Usage: ${_name} <command> [options]`);
  return cli;
};

cli.title = (text: string) => {
  _title = text
  cli.usage(`# ${_title}\n${_copyright}\n## Usage: ${_name} <command> [options]`);
  return cli;
};

cli
  .wrap(0)
  .help('help', "Show help")
  .usage(`# ${_title}\n${_copyright}\n## Usage: ${_name} <command> [options]`);



