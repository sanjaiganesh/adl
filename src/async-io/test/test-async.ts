import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import * as polyfill from '@microsoft.azure/polyfill'
import * as assert from "assert";
import * as asyncio from '../main'
// ensure
polyfill.polyfilled;

@suite class AsyncIO {

  @test async "Does Pify'd exist work"() {
    assert.equal(await asyncio.exists(__filename), true);
  }
}