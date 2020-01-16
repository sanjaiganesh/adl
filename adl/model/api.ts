import { Project, ClassDeclaration, JSDocStructure, SourceFile, InterfaceDeclaration, EnumDeclaration, Type, VariableDeclarationKind, IndentationText, QuoteKind } from 'ts-morph';
import { intersect } from '@azure-tools/codegen';

export interface OperationGroup {

}

export class Api {
  project = new Project({
    useInMemoryFileSystem: true, manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
      quoteKind: QuoteKind.Single,
    }
  });

  protected models = this.project.createDirectory('models');
  protected enums = this.project.createDirectory('enums');
  protected operations = this.project.createDirectory('operations');


  constructor() {
    // 
  }

  addOperationGroup(name: string, properties?: OperationGroup) {
    const filename = `${name}.ts`;
    const file = this.operations.getSourceFile(filename) || this.operations.createSourceFile(filename);

    const og = file.getClass(name) || file.addClass({ name, isExported: true });

    return intersect(og, new OperationGroupFunctions(og));
  }

  addSchema() {

  }

  addEnum() {

  }

}

export class OperationGroupFunctions {
  /*@internal*/
  constructor(private declaraton: ClassDeclaration) {
  }

  addOperation(name: string, properties: ) {

  }
}