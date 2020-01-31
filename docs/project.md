# ADL Project 

The exact layout of the project is not critical, there are only a few things which should be kept in mind.

### File types
ADL files should use the `.adl.ts` file extension to identify that they are ADL files.

### Requried Files

The following files are required to create an ADL project

``` bash
package.json    # necessary to install the required ADL types support.
tsconfig.json   # the settings to use the ADL support
[MyApi].adl.ts  # at least one .adl.ts file that describes the API surface.
```

> example `package.json` file

``` json
{
  "name": "SampleService",
  "version": "1.0.0",
  "description": "My API Description for the SampleService",
  "main": "sample-service.adl.ts",
  "devDependencies": { 
    "typescript": "~3.7.4",
    "@azure-tools/adl.types": "~1.0.0"
  }
}
```

Most of the configuration in tsconfig.json is already defined in the `adl.types` module so
all that is required is to extend that file, and add in the includes:

> example `tsconfig.json` file

``` json
{
  "extends": "./node_modules/@azure-tools/adl.types/config.json",
  "include": [
    "**/*.adl.ts"
  ]
}
```

### Layout 
An ideal project layout should make it clear as to what you're looking at.

> suggested project layout

``` bash
/myproject                    # base folder
  package.json                # required file
  tsconfig.json               # required file
  myproject.adl.ts            # API namespace declaration
    /schemas
      abcProperties.adl.ts    # files for schema types
      defProperties.adl.ts
    
    /enums
      dayOfWeek.adl.ts        # files with enum types
```

