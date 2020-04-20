import { CommandLineAction, CommandLineChoiceParameter, CommandLineFlagParameter, CommandLineStringListParameter, CommandLineStringParameter } from '@microsoft/ts-command-line'
import { appContext } from './appContext'

import * as adlruntime from '@azure-tools/adl.runtime'
/* shows what is in store
 * in a runtime env, this will connect to rpaas api server
 * and use it as a store, to red api definitions from
 */

/* @khenidak
* How does this should look like
* ./cairo list (showes evertything)
* ./cairo list --show-docs (shows the documentation - if any - for each model)
* ./cairo list --only-apis (shows api spec)
* ./cairo list -- only-apis --only--versions (shows apis + versions)
* ~ normalized
* ~ versioned type
* ~ filtering
* ./cairo list <whatever> --filter="api=x"
* ./cairo list <whatever> --filter="api=x,api=y,version=x,normalized=y"
* sadly rush stack is badly documented. so the best source of understanding different
* flags go to
* https://github.com/microsoft/rushstack/blob/master/libraries/ts-command-line/src/test/CommandLineParameter.test.ts
*/
export class showStoreAction extends CommandLineAction {
    private _scope: CommandLineChoiceParameter;
    private _filter: CommandLineStringParameter; /* TODO */
    private _show_docs: CommandLineFlagParameter;

    public constructor(private ctx: appContext) {
    super({
      actionName: 'list',
      summary: 'shows the apis already loaded in the store',
      documentation: ''
    });
  }

  protected onExecute(): Promise<void> {
            // TODO: pretty print, json yaml printing etc.
            return new Promise<void>( () => {
                const scope = this._scope.value ? this._scope.value : "all";

                // dumb print information from store as is
                var models = this.ctx.store.ApiModels;

                var printer = this.ctx.createPrinter(this._scope.value, this._show_docs.value);
                // api infos
                for(let model of models){
                    printer.printModel(model);
                }
                printer.flushOutput();
            });
  }

  protected onDefineParameters(): void { // abstract

    this._scope = this.defineChoiceParameter({
      parameterLongName: '--scope',
      parameterShortName: '-s',
            alternatives: [ 'all', 'types', 'normalized', 'apiversions', 'versioned', 'properties', 'constraints', 'docs' ],
            defaultValue: 'all',
      description: 'scope',
            required: false,
    });

    //TODO
    this._filter = this.defineStringParameter({
      parameterLongName: '--filter',
            argumentName: 'PATH_STRING_STDIN',
      parameterShortName: '-f',
      description: 'filter TODO',
            required: false,
    });

    this._show_docs = this. defineFlagParameter({
          parameterLongName: '--show-docs',
          parameterShortName: '-d',
          description: 'display docs',
          environmentVariable: 'ENV_DOCS'
        });
  }
}
