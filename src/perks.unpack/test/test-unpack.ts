import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import * as polyfill from '@microsoft.azure/perks.polyfill'
import * as assert from "assert";
import * as fs from 'fs'
import * as up from '../'
import * as os from 'os'
import * as path from 'path'

// ensure
polyfill.polyfilled;

@suite class unpack {
  @test async "tgz"() {
    const tmpFolder = fs.mkdtempSync("test-unpack");
    try {
      const stream = fs.createReadStream(`${__dirname}/license.tgz`);
      assert.equal(true, await up.unpack(stream, tmpFolder));

      const license = fs.readFileSync(`${tmpFolder}/LICENSE`);
      assert.equal(license.length, 1183);
    } finally {
      fs.unlinkSync(`${tmpFolder}/LICENSE`)
      fs.rmdirSync(tmpFolder);
    }
  }

  @test async "zip"() {
    const tmpFolder = fs.mkdtempSync("test-unpack");
    try {
      const stream = fs.createReadStream(`${__dirname}/license.zip`);
      assert.equal(true, await up.unpack(stream, tmpFolder));
      const license = fs.readFileSync(`${tmpFolder}/LICENSE.TXT`);
      assert.equal(license.length, 1183);
    } finally {
      fs.unlinkSync(`${tmpFolder}/LICENSE.TXT`);
      fs.rmdirSync(tmpFolder);
    }
  }
}