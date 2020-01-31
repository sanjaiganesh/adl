import { TypeAliasDeclaration, NamespaceDeclaration, Project, ClassDeclaration, JSDocStructure, SourceFile, InterfaceDeclaration, EnumDeclaration, Type, VariableDeclarationKind, IndentationText, QuoteKind, MethodDeclaration, Directory } from 'ts-morph';
import { intersect } from '@azure-tools/codegen';
import { writeFile, mkdir, isDirectory, isFile, readFile } from '@azure-tools/async-io';
import { dirname, resolve, relative } from 'path';
import { length, values } from '@azure-tools/linq';
import { getTags } from './jsdoc';

export type TypeReference = { getName: () => string; getSourceFile?: (() => SourceFile); applyImport?: (file: SourceFile) => void };

export interface ResourceProperties {
}

export interface OperationGroupProperties {
}

export interface OperationProperties {
}

export interface MemberProperties {
}

export interface EnumMemberProperties {
}
const manipulationSettings = {
  indentationText: IndentationText.TwoSpaces,
  insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
  quoteKind: QuoteKind.Single,

};

function flatten<T>(array: Array<Array<T>>): Array<T> {
  return array.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(<Array<Array<T>>><unknown>toFlatten) : toFlatten);
  }, []);
}

function isEmpty(item: any) {
  return length(item) === 0;
}

const defaults = {
  tsconfig: <any>{
    // pick up the configuraton from the adl.types package. 
    extends: './node_modules/@azure-tools/adl.types/config.json',
    // all *.adl.ts files
    include: [
      '**/*.adl.ts'
    ],
  },

  package: <any>{
    name: 'APINAME',
    version: '1.0.0',
    description: 'DESCRIPTION',
    main: 'MAIN.adl.ts',
    devDependencies: {
      'typescript': '~3.7.4',
      '@azure-tools/adl.types': '~1.0.0'
    }
  }
};

function parseJsonc(text: string) {
  return JSON.parse(text.replace(/\/\*[\s\S]*?\*\//gm, '')
    .replace(/\s+\/\/.*/g, '')
    .replace(/],(\s*?)\}/gm, ']$1}')
    .replace(/},(\s*?)\}/gm, '}$1}'));
}

interface SourceFileLocation {
  getSourceFile(fileNameOrPath: string): SourceFile | undefined;
  createSourceFile(filePath: string, sourceFileText?: string): SourceFile;
}
export class Api {
  project = new Project({
    useInMemoryFileSystem: true, manipulationSettings,
  });

  protected schemas = this.project.createDirectory('schemas');
  protected enums = this.project.createDirectory('enums');
  protected operations = this.project.createDirectory('operations');
  protected tsconfig = defaults.tsconfig;
  protected package = defaults.package;
  protected serviceName?: string;

  protected loadedFiles = new Set<string>();

  constructor() {
    //shh
  }

  protected get ServiceNamespace() {
    const all = this.getNamespaces();
    if (this.serviceName) {
      const result = all.find(each => each.getName() === this.serviceName);
      if (result) {
        return result;
      }
    }

    // find it?
    if (length(all) === 1) {
      // it must be the one.
      return all[0];
    }

    if (!isEmpty(all)) {
      // is there one pointed to by the package.json ?
      if (this.package.main) {
        const first = all.find(each => each.getSourceFile().getFilePath() === this.package.main);
        if (first) {
          return first;
        }
      }

      // take the first one there is, we'll deal later.
      return all[0];
    }
    return undefined;
  }

  get ServiceName() {
    if (this.serviceName) {
      return this.serviceName;
    }
    // find it?
    const ns = this.ServiceNamespace;
    if (ns) {
      return this.serviceName = ns.getName();
    }

    // not found
    return '';
  }
  set ServiceName(name: string) {
    if (!name) {
      throw new Error('Service name must not be empty');
    }

    if (this.serviceName) {
      if (name === this.serviceName) {
        return;
      }

      const ns = this.ServiceNamespace;
      if (ns) {
        // we have one already.
        // let's rename it.
        ns.setName(name);
        this.serviceName = name;
        this.package.main = ns.getSourceFile().getFilePath();
      }
    }
    this.serviceName = name;
    this.package.main = this.addNamespace(name).getSourceFile().getFilePath();
  }


  /** @internal 
   * use ts-morph to load the files off the disk and into the project
   * 
  */
  async load(projectFolder: string) {
    projectFolder = resolve(projectFolder);
    if (!isDirectory(projectFolder)) {
      throw new Error(`Invalid Path ${projectFolder} for ADL project`);
    }
    const configFile = resolve(projectFolder, 'tsconfig.json');
    if (!isFile(configFile)) {
      throw new Error(`No tsconfig at ${configFile}`);
    }

    const pkgFile = resolve(projectFolder, 'package.json');
    if (!isFile(pkgFile)) {
      throw new Error(`No packagejson at ${pkgFile}`);
    }

    this.tsconfig = parseJsonc((await readFile(configFile)));
    this.package = parseJsonc((await readFile(pkgFile)));

    const p = new Project({ tsConfigFilePath: configFile, manipulationSettings });
    for (const each of p.getSourceFiles()) {
      const sourceFile = each.getFilePath();
      const content = await readFile(sourceFile);
      const rPath = relative(projectFolder, sourceFile);
      this.loadedFiles.add(rPath);

      this.project.createSourceFile(rPath, content);
    }

    return this;
  }

  protected getInterfaces() {
    return flatten(this.project.getSourceFiles().map(each => each.getInterfaces()));
  }
  protected getEnums() {
    return flatten(this.project.getSourceFiles().map(each => each.getEnums()));
  }
  protected getNamespaces() {
    return flatten(this.project.getSourceFiles().map(each => each.getNamespaces()));
  }
  protected getClasses() {
    return flatten(this.project.getSourceFiles().map(each => each.getClasses()));
  }
  protected getSourceFileIn(directory: SourceFileLocation, name: string) {
    const filename = `${name}.ts`;
    return directory.getSourceFile(filename) || directory.createSourceFile(filename);
  }

  addOperationGroup(name: string, properties?: OperationGroupProperties) {
    let result = this.getClasses().find(each => each.getName() === name);
    if (!result) {
      const file = this.getSourceFileIn(this.operations, name);
      result = file.getClass(name) || file.addClass({ name, isExported: true });
    }
    return intersect(new OperationGroup(result), result);
  }

  addSchema(name: string) {
    let result = this.getInterfaces().find(each => each.getName() === name);
    if (!result) {
      const file = this.getSourceFileIn(this.schemas, name);
      result = file.getInterface(name) || file.addInterface({ name, isExported: true });
    }
    return intersect(new Schema(result), result);
  }

  addEnum(name: string) {
    let result = this.getEnums().find(each => each.getName() === name);
    if (!result) {
      const file = this.getSourceFileIn(this.enums, name);
      result = file.getEnum(name) || file.addEnum({ name, isExported: true });
    }
    return intersect(new Enum(result), result);
  }

  addNamespace(name: string) {
    let result = this.getNamespaces().find(each => each.getName() === name);
    if (!result) {
      const file = this.getSourceFileIn(this.project, name);

      result = file.getNamespace(name) || file.addNamespace({ name, isExported: true });
    }
    return intersect(new Namespace(result), result);
  }

  async * getFiles() {
    for (const each of this.project.getSourceFiles()) {
      each.organizeImports();
      each.formatText({ indentSize: 2 });
      await each.save();

      yield {
        path: each.getFilePath().toString(),
        content: each.getFullText().replace(/\*\/\s*\/\*\*\s*/g, '') // combine doccomments 
      };
    }
  }

  async save(path: string) {
    for await (const each of this.getFiles()) {
      await mkdir(dirname(`${path}/${each.path}`));
      await writeFile(`${path}/${each.path}`, each.content);
    }
    await writeFile(resolve(path, 'package.json'), JSON.stringify(this.package, undefined, 2));
    await writeFile(resolve(path, 'tsconfig.json'), JSON.stringify(this.tsconfig, undefined, 2));
  }


  get ApiVersions(): Iterable<string> {
    const ns = this.ServiceNamespace;
    if (ns) {
      return [...getTags(ns, 'version').where(each => !!each.value).selectNonNullable(each => each.value)];
    }
    return [];
  }

  get Resources(): Iterable<Resource> {
    const ns = this.ServiceNamespace;
    if (ns) {
      return values(ns.getTypeAliases()).select(each => intersect(new Resource(each), each));
    }
    return [];
  }
}

export class Namespace {
  /*@internal*/
  constructor(private declaraton: NamespaceDeclaration) {
    //shh
  }

}

export class Resource {
  /*@internal*/
  constructor(private declaraton: TypeAliasDeclaration) {
    //shh
  }

  get Schema() {
    throw new Error('Unimplemented');
  }

  get Namespace() {
    throw new Error('Unimplemented');
  }

  get Name() {
    return this.declaraton.getName();
  }

  get ResourceType() {
    return (<any>this.declaraton.getTypeNode())?.getTypeName()?.getText();
  }

  get Path() {
    return '/';
  }
}

export class Schema {
  /*@internal*/
  constructor(private declaraton: InterfaceDeclaration) {
  }

  addProperty(name: string, properties: MemberProperties) {
    //sshh
  }

  get Properties(): Iterable<Property> {
    return [];
  }
}

export class Property {
  /*@internal*/
  constructor(private declaraton: InterfaceDeclaration) {
  }

  /** returns the type of the property */
  get Type() {
    throw new Error('Unimplemented');
  }

  /** returns the list of constraints on the property */
  get Constraints(): Iterable<Constraint> {
    return [];
  }

  /** returns the list of attributes on the property */
  get Attributes(): Iterable<Attribute> {
    return [];
  }

  /** returns the list of encodings on the property */
  get Encodings(): Iterable<Encoding> {
    return [];
  }
}

export class Constraint {
  /*@internal*/
  constructor() {
    //shh
  }

}
export class Encoding {
  /*@internal*/
  constructor() {
    //shh
  }

}
export class Attribute {
  /*@internal*/
  constructor() {
    //shh
  }

}

export class Enum {
  /*@internal*/
  constructor(private declaraton: EnumDeclaration) {
  }

  addEnum(name: string, properties: EnumMemberProperties) {
    //shh
  }
}

export class OperationGroup {
  /*@internal*/
  constructor(private declaraton: ClassDeclaration) {
    //shh
  }

  addOperation(name: string, properties: OperationGroupProperties) {
    //shh
  }
}

export class Operation {
  /*@internal*/
  constructor(private declaraton: MethodDeclaration) {
    //shh
  }
}
