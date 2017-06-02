/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as con from "@microsoft.azure/perks.console"
import * as os from 'os';
import * as path from 'path'
import * as dotnet from "./index"

const printablePath = (path: string) => path.replace(/\\/g, "\\\\");

const pathOption = {
  alias: 'p',
  describe: 'installation root folder ',
  default: path.normalize(`${os.homedir()}/.dotnet`)
};

const osOption = {
  alias: 'o',
  describe: 'use specific operating system id',
  choices: dotnet.getAllOperatingSystems(),
  default: dotnet.detectOperatingSystem("2.0")
};

const archOption = {
  alias: 'a',
  describe: 'use specific operating system',
  choices: dotnet.getAllArchitectures(),
  default: os.arch()
};

const args = con.cli
  .app("dotnet-install")
  .title("DotNet Framework Installation Utility")
  .copyright("(C) 2017 **Microsoft Corporation.**")
  .command('info', '**Show installed information**', {
    path: pathOption
  }, info)
  .command('list', "**Show available dotnet framework versions**", {
    os: osOption,
    arch: archOption,
  }, list)
  .command('install', "**Install dotnet framework version**", {
    version: {
      alias: 'v',
      describe: 'selected version of dotnet framework to install',
      choices: dotnet.getAllReleases(),
      default: dotnet.getVersions()[0]
    },
    path: pathOption,
    os: osOption,
    arch: archOption
  }, install)
  .showHelpOnFail(true)

  .argv


function list(args: any) {
  console.log("# Available dotnet frameworks ");
  console.log("");

  let table = `|Version|Releases|OperatingSystem|Architectures|\n|--------|-------|-------|--------------|\n`
  let content = '';
  const arch = args.arch || os.arch();

  for (const version of dotnet.getVersions()) {
    const operatingSystem: string = args.os || dotnet.detectOperatingSystem(version);

    if (dotnet.isOperatingSystem(version, operatingSystem)) {
      content += `|${version}|${dotnet.getReleases(version)}|${operatingSystem}|${dotnet.getArchitectures(version, operatingSystem)}|\n`
    }
  }
  if (!content) {
    console.error(`Unable to find dotnet frameworks for ${args.os || dotnet.detectOperatingSystem('2.0')}/${arch}`);
    return;

  }
  console.log(table + content);
  console.log("");
  console.log("** ** When specifying a **--version**, you can use a version like **--version=1.1** or a specific release like **--version=1.1.2**");
};

function info(args: any) {
  console.log("# Installed frameworks ");
  console.log(`> Install folder: ${args.path} `);
}

function install(args: any) {

  console.log(`# Installing framework`);
  console.log(`> Selected Framework: ${args.os}-${args.version}-${args.arch}`);
  console.log(`> Installation folder: ${printablePath(args.path)} `);

}