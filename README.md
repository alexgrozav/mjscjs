# mjscjs

<a href="https://www.npmjs.com/package/mjscjs">
  <img src="https://img.shields.io/npm/v/mjscjs.svg" alt="npm version">
</a>
<a href="https://www.npmjs.com/package/mjscjs">
  <img src="https://img.shields.io/npm/dm/mjscjs.svg" alt="Downloads">
</a>

<br/>
<br/>

> Transform typescript output to `.mjs` and `.cjs` compatible code. One codebase to rule them all.

This simple utility will ensure you deliver packages using latest ES standards. It relies on two separate typescript **tsconfig.json** configurations to generate `esnext` and `commonjs` modules. After build, `mjscjs` will process all the generated files:

✅ Renames all your files to `.mjs` and `.cjs` respectively

✅ Renames all your sourcemaps to `.mjs.map` and `.cjs.map`

✅ Replaces all your imports to use `.mjs` and requires to use `.cjs`

✅ Replaces all your sourcemap references

✅ Replaces all your **tsconfig.json** paths aliases with relative imports and requires

## Installation

```bash
npm install -D mjscjs
```

## Usage

For `mjscjs` to work properly, please make sure your **tsconfig.json** specifies the following configuration options:

```json
{
    "compilerOptions": {
        "outDir": "lib",
        "rootDir": "./src",
        "baseUrl": ".",
        "paths": {
            "@example/*": ["./src/*"]
        }
    }
}
```

### 1. Create `.mjs` specific configuration

Create a file called **tsconfig.mjs.json**.

```json 
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "module": "esnext",
        "outDir": "lib-mjs"
    }
}
```

### 2. Create `.cjs` specific configuration

Create a file called **tsconfig.cjs.json**.

```json 
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "module": "commonjs",
        "outDir": "lib-cjs"
    }
}
```

### 3. Run `mjscjs` against both configurations

When working with a typescript project, simply target the **tsconfig.json** file of your project.

```bash
npx tsc -d -p tsconfig.mjs.json
npx mjscjs -p tsconfig.mjs.json
```

```bash
npx tsc -d -p tsconfig.cjs.json
npx mjscjs -p tsconfig.cjs.json
```

## Add to package scripts

To make things easier, add `mjscjs` to your **package.json** scripts and run the complete build using `npm run build`.

```bash
{
  "scripts": {
    "build": "npm run build:mjs && npm run build:cjs",
    "build:mjs": "tsc -d -p tsconfig.mjs.json && npm run build:mjs:transform",
    "build:mjs:transform": "mjscjs -p tsconfig.mjs.json",
    "build:cjs": "tsc -d -p tsconfig.cjs.json && npm run build:cjs:transform",
    "build:cjs:transform": "mjscjs -p tsconfig.cjs.json"
  }
}
```

## Alternative Usage

**Attention** The non-typescript usage is work in progress and not properly tested. Contributions are welcome.

When working with a non-typescript project, you can specify the module type, build dir, and source dir separately.

```bash
npx mjscjs --target . --buildDir './build' --srcDir './src' --module esm
npx mjscjs -t . -b './build' -s './src' -m esm
```

## Contributing

Contributions are welcome! Please raise an issue to discuss any problem or feature request.

## Copyright and license

Code copyright 2022 Alex Grozav. Code released under the [MIT License](./LICENSE).
