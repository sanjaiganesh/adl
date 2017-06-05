/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as con from "@microsoft.azure/console"
import * as polyfill from "@microsoft.azure/polyfill"
import * as os from 'os';
import * as fs from 'fs';
import { Exception, UnsupportedPlatformException, UnknownFramework } from "./exception"
import * as req from 'request';
import { unpack } from '@microsoft.azure/unpack'

// ensure that we're polyfilled.
polyfill.polyfilled;

// load framework definitions
const frameworks = require("../frameworks.json");

function contains(item: string, collection: Array<any>): boolean {
  for (const each in collection) {
    if (each == item) {
      return true;
    }
  }
  return false;
}



export function getVersions(): Array<string> {
  return Object.getOwnPropertyNames(frameworks);
}

export function isVersion(version: string): boolean {
  return getVersions().indexOf(version) > -1;
}

export function isOperatingSystem(version: string, operatingSystem: string): boolean {
  return getOperatingSystems(version).indexOf(operatingSystem) > -1;
}

export function isArchitecture(version: string, operatingSystem: string, architecture: string): boolean {
  return isOperatingSystem(version, operatingSystem) && frameworks[version].operatingSystems[operatingSystem].indexOf(architecture) > -1;
}

export function getReleases(version: string): Array<string> {
  if (isVersion(version)) {
    return frameworks[version].releases;
  }
  return [];
}

export function getAllOperatingSystems() {
  const result = [];
  for (const v of getVersions()) {
    for (const o of getOperatingSystems(v)) {
      if (result.indexOf(o) == -1) {
        result.push(o);
      }
    }
  }
  return result;
}

export function getOperatingSystems(version: string) {
  if (isVersion(version)) {
    return Object.getOwnPropertyNames(frameworks[version].operatingSystems);
  }
  return [];
}

export function getAllArchitectures(): Array<string> {
  const result = [];
  for (const v of getVersions()) {
    for (const o of getOperatingSystems(v)) {
      for (const a of getArchitectures(v, o)) {
        if (result.indexOf(a) == -1) {
          result.push(a);
        }
      }
    }
  }
  return result;
}

export function getArchitectures(version: string, operatingSystem: string): Array<string> {
  if (isOperatingSystem(version, operatingSystem)) {
    return frameworks[version].operatingSystems[operatingSystem];
  }
  return [];
}

export function getDownloadUrl(version: string, operatingSystem: string, architecture: string): string {
  if (isArchitecture(version, operatingSystem, architecture)) {
    return `https://aka.ms/dotnet/${version}/${operatingSystem}/${architecture}`
  }
  throw new UnknownFramework(`${version}/${operatingSystem}/${architecture}`);
}

export async function installFramework(version: string, operatingSystem: string, architecture: string, folder: string): Promise<boolean> {
  const URL = getDownloadUrl(version, operatingSystem, architecture);
  unpack(req(URL), folder);
  return false;
}

export function getAllReleases(): Array<string> {
  const result = getVersions();
  for (const v of getVersions()) {
    for (const r of getReleases(v)) {
      if (result.indexOf(r) == -1) {
        result.push(r);
      }
    }
  }
  return result;
}

export function detectOperatingSystem(version: string): string {
  switch (version) {
    case "2.0":
    case "2.0.0-preview1":
      return detectOperatingSystem20();
    case "1.0":
    case "1.0.5":
    case "1.0.4":
      return detectOperatingSystem10();
    case "1.1":
    case "1.1.2":
      return detectOperatingSystem11();
  }
  throw new UnknownFramework(version);
}

function detectOperatingSystem10(): string {
  switch (os.platform()) {
    case 'darwin':
      return 'osx';
    case 'win32':
      return `windows`;

    case 'linux':
      const text = fs.readFileSync(`/etc/os-release`, { encoding: `utf8` }).replace(`"`, ``);
      const osrelease = {
        id: (/ID=(.*)/.exec(text) || [null, null])[1],
        version: (/ID_VERSION=(.*)/.exec(text) || [null, null])[1]
      }

      switch (osrelease.id) {
        case "centos":
          return `centos`;
        case "debian":
          return `debian`;
        case "rhel":
          return `rhel`;
        case "ubuntu":
          switch (osrelease.version) {
            case "14.04":
              return `ubuntu-14.04`;
            case "16.04":
              return `ubuntu-16.04`;
            case "16.10":
              return `ubuntu-16.04`;
          }
      }
      throw new UnsupportedPlatformException(`${os.platform()}-${osrelease.id}-${osrelease.version}-${os.arch()}`);

  }
  throw new UnsupportedPlatformException(`${os.platform()}-${os.arch()}`);
}

function detectOperatingSystem11(): string {
  switch (os.platform()) {
    case 'darwin':
      return 'osx';
    case 'win32':
      return `windows`;

    case 'linux':
      const text = fs.readFileSync(`/etc/os-release`, { encoding: `utf8` }).replace(`"`, ``);
      const osrelease = {
        id: (/ID=(.*)/.exec(text) || [null, null])[1],
        version: (/ID_VERSION=(.*)/.exec(text) || [null, null])[1]
      }

      switch (osrelease.id) {
        case "centos":
          return `centos`;
        case "debian":
          return `debian`;
        case "rhel":
          return `rhel`;
        case "ubuntu":
          switch (osrelease.version) {
            case "14.04":
              return `ubuntu-14.04`;
            case "16.04":
              return `ubuntu-16.04`;
            case "16.10":
              return `ubuntu-16.10`;
          }
        case "fedora":
          return `fedora`;
        case "opensuse":
          return `opensuse`;
      }

      throw new UnsupportedPlatformException(`${os.platform()}-${osrelease.id}-${osrelease.version}-${os.arch()}`);
  }
  throw new UnsupportedPlatformException(`${os.platform()}-${os.arch()}`);
}

function detectOperatingSystem20(): string {
  switch (os.platform()) {
    case 'darwin':
      return 'osx';
    case 'win32':
      return `windows`;
    case 'linux':
      return `linux`;
  }
  throw new UnsupportedPlatformException(`${os.platform()}-${os.arch()}`);
}