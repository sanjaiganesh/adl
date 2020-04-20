import * as adlruntime from '@azure-tools/adl.runtime'
import * as cliprinters from './printers/module'

export class appContext {
    store: adlruntime.ApiManager; // actual store
    machinery: adlruntime.ApiMachinery; // api design time. e.g. constraints system
    machineryRuntime: adlruntime.ApiRuntime; // api runtime implementation e.g. normalize()/convert()
    opts: adlruntime.apiProcessingOptions;


    outputFormat: string | undefined;

    printScopeFromString(scope:string): cliprinters.printerScope{
      if (scope.length == 0) return cliprinters.printerScope.all;
      return cliprinters.printerScope[scope];
    }
    createPrinter(scope: string = 'all', show_docs:boolean = false): cliprinters.printer {
      const printScope = this.printScopeFromString(scope)
      switch (this.outputFormat) {
          case 'text': {
              return new cliprinters.textPrinter(printScope);
          }
          case 'table': {
              return new cliprinters.tablePrinter(printScope);
          }
          default: {
              return new cliprinters.textPrinter(printScope);
          }
      }
    }
}



