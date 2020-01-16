import * as OpenAPI from '@azure-tools/openapi';
import { dereference, JsonType, isReference } from '@azure-tools/openapi';
import { Api, TypeReference } from '../model/api';
import { values, Dictionary, items } from '@azure-tools/linq';
import { pascalCase } from '@azure-tools/codegen';


/** takes an openapi3 model, converts it into a ADL model, and returns that */
export function loadOpenApi(model: OpenAPI.Model) {
  const result = new Api();

  const converter = new OpenApiConverter(result, model);
  converter.processSchemas();

  return result;
}


function docDescription(value?: string) {
  return { description: value || '' };
}

function quoteForIdentifier(value: string) {
  return /[^\w]/g.exec(value) ? `'${value}'` : value;
}

// ref: https://www.w3schools.com/charsets/ref_html_ascii.asp
const specialCharacterMapping: { [character: string]: string } = {
  '!': 'exclamation mark',
  '"': 'quotation mark',
  '#': 'number sign',
  '$': 'dollar sign',
  '%': 'percent sign',
  '&': 'ampersand',
  '\'': 'apostrophe',
  '(': 'left parenthesis',
  ')': 'right parenthesis',
  '*': 'asterisk',
  '+': 'plus sign',
  ',': 'comma',
  '-': 'hyphen',
  '.': 'dot',
  '/': 'slash',
  ':': 'colon',
  ';': 'semicolon',
  '<': 'less-than',
  '=': 'equals-to',
  '>': 'greater-than',
  '?': 'question mark',
  '@': 'at sign',
  '[': 'left square bracket',
  '\\': 'backslash',
  ']': 'right square bracket',
  '^': 'caret',
  '_': 'underscore',
  '`': 'grave accent',
  '{': 'left curly brace',
  '|': 'vertical bar',
  '}': 'right curly brace',
  '~': 'tilde'
};


export function getValidEnumValueName(originalString: string): string {

  return pascalCase(originalString.split('').map(x => specialCharacterMapping[x] || x).join(''));
}

class OpenApiConverter {
  protected processed = new Map<any, any>();

  constructor(protected api: Api, protected model: OpenAPI.Model) {

  }


  deref<T>(source?: Array<OpenAPI.Refable<T>>) {
    return values(source).select(each => dereference(this.model, each).instance);
  }

  derefD<T>(source?: Dictionary<OpenAPI.Refable<T>>) {
    return items(source).select(each => ({
      key: each.key,
      value: dereference(this.model, each.value).instance
    }));
  }


  createFile(schema: OpenAPI.Schema) {
    const modelName: string = pascalCase(schema['x-ms-metadata'].name);
    if (schema.enum) {
      return this.api.addEnum(modelName);
    }

    return this.api.addSchema(modelName);
  }

  /*
  createIntersectionType(schema: OpenAPI.Schema) {
    const typeAlias = this.createTypeAlias(schema);
    const file = this.createFile(schema);

    const allOf = this.deref(schema.allOf).select(a => this.addImportFor<TypeReference>(file, this.acquireTypeForSchema(a))).toArray().joinWith(each => each.getName(), '&');
    const oneOf = this.deref(schema.oneOf).select(a => this.addImportFor<TypeReference>(file, this.acquireTypeForSchema(a))).toArray().joinWith(each => each.getName(), '|');
    const anyOfCombinations = combinations(this.deref(schema.anyOf).select(a => this.addImportFor<TypeReference>(file, this.acquireTypeForSchema(a))).toArray());
    const anyOf = anyOfCombinations.map(s => s.joinWith(each => each.getName(), '&')).join('|');
    let set = allOf;
    if (oneOf) {
      set = set ? `${set} & (${oneOf})` : oneOf;
    }
    if (anyOf) {
      set = set ? `${set} | (${anyOf})` : anyOf;
    }
    if (schema.properties) {
      const iface = this.createInterface(schema, file, this.schemaName(schema), true);
      set = `internal.${iface.getName()} & ${set}`;
    }

    typeAlias.setType(set);
    return typeAlias;
  }
  */

  createInterface(schema: OpenAPI.Schema) {
    //as
  }

  createEnum(schema: OpenAPI.Schema) {
    if (schema.enum) {
      const enumName = schema['x-ms-metadata'] ? pascalCase(schema['x-ms-metadata'].name) : 'unknown';
      const e = this.api.addEnum(enumName);
      e.addJsDoc(docDescription(schema.description));
      e.addMembers(
        schema['x-ms-enum']?.values ? schema['x-ms-enum'].values.map(
          (each: any) => ({
            docs: [docDescription(each.description)],
            name: quoteForIdentifier(getValidEnumValueName(`${(each.name !== undefined) ? each.name : each.value}`)),
            value: each.value
          })) :
          schema.enum.map(each => ({
            name: quoteForIdentifier(getValidEnumValueName(each)),
            value: each
          }))
      );

      this.processed.set(schema, e);

      if (schema.deprecated) {
        e.addJsDoc('deprecated');
      }
      return e;
    }
    throw Error(`Enum failed ${JSON.stringify(schema, undefined, 2)}`);
  }

  @cache
  acquireTypeForSchema(schema: OpenAPI.Schema) { //: TypeReference {
    if (this.processed.has(schema)) {
      return;// this.processed.get(schema);
    }

    if (schema.enum && schema.enum.length > 1) {
      //return
      this.createEnum(schema);
    }

    /*
    // if the schema is an 
    // allOf/anyOf/oneOf 
    // or has properties and has 'AdditionalProperties'
    //  the target type must be a union/intersection type
    // 
    // and the underlying schema is 'internal' to that.

    if (schema.allOf || schema.anyOf || schema.oneOf) {
      return this.createIntersectionType(schema);
    }

    if (schema.additionalProperties) {
      // this is some kind of additional properties model

      if (values(schema.properties).any()) {
        // it has some declared properties too.
        // create the interface as internal, and 
        // add an alias
        const typeAlias = this.createTypeAlias(schema);
        const iface = this.createInterface(schema, undefined, undefined, true);

        if (schema.additionalProperties === true) {
          typeAlias.setType(`internal.${iface.getName()} & AdditionalProperties<any>`);
        } else {
          const t = this.acquireTypeForSchema(dereference(this.model, schema.additionalProperties).instance);
          typeAlias.setType(`internal.${iface.getName()} & AdditionalProperties<${t.getName()}>`);
          return typeAlias;
        }
      }

      if (schema.additionalProperties === true) {
        // this type is literally just AdditionalProperties<any>
        return { getName: () => 'AdditionalProperties<any>' };
      }

      if (isReference(schema.additionalProperties)) {
        const t = this.acquireTypeForSchema(dereference(this.model, schema.additionalProperties).instance);
        return {
          getName: () => `AdditionalProperties<${t.getName()}>`,
          applyImport: this.forwardTypeReference(t)
        };
      }
    }
*/


    if (schema.properties || schema.type === JsonType.Object) {
      return this.createInterface(schema);
    }
    /*
    switch (schema.type) {
      case JsonType.Number:
        return { getName: () => and('number', format(schema.format), maximum(schema.maximum, schema.exclusiveMaximum), minimum(schema.minimum, schema.exclusiveMaximum)) };

      case JsonType.Integer:
        return { getName: () => and('number', format(schema.format), maximum(schema.maximum, schema.exclusiveMaximum), minimum(schema.minimum, schema.exclusiveMaximum)) };

      case JsonType.Boolean:
        return { getName: () => 'boolean' };

      case JsonType.String:
        if (schema.enum && schema.enum.length === 1) {
          return { getName: () => `Constant<'${(<any>schema.enum)[0]}'>` };
        }
        return { getName: () => and('string', format(schema.format), maxLength(schema.maxLength), minLength(schema.minLength), pattern(schema.pattern)) };

      case JsonType.Array:
        if (schema.items) {
          const i = dereference(this.model, schema.items).instance;
          if (i) {
            const r = this.acquireTypeForSchema(i);
            return {
              getName: () => `${schema.uniqueItems ? 'Set' : 'Array'}<${r.getName()}>`,
              applyImport: this.forwardTypeReference(r)
            };
          }
        }
    }
    throw new Error(`NoType! ${JSON.stringify(schema, undefined, 2)}`);
*/

  }

  processSchemas() {
    for (const schema of values(this.model?.components?.schemas).select(schema => dereference(this.model, schema).instance)) {
      this.acquireTypeForSchema(schema);
    }
  }
}

function cache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const fn = target[propertyKey];
  target[propertyKey] = (input: any) => {
    if (target.processed.has(input)) {
      return target.processed.get(input);
    }
    const output = fn(input);
    target.processed.set(input, output);
    return output;
  };
}
