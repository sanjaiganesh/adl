/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Exception extends Error {
  constructor(message: string, public exitCode: number = 1) {
    super(message);
    Object.setPrototypeOf(this, Exception.prototype);
  }
}

export class UnsupportedPlatformException extends Exception {
  constructor(platform: string, public exitCode: number = 1) {
    super(`Unsupported Platform: ${platform}`, exitCode);
    Object.setPrototypeOf(this, UnsupportedPlatformException.prototype);
  }
}

export class UnknownFramework extends Exception {
  constructor(framework: string, public exitCode: number = 1) {
    super(`Unknown Framework Version: ${framework}`, exitCode);
    Object.setPrototypeOf(this, UnknownFramework.prototype);
  }
}
