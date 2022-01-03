#! /usr/bin/env node

import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import glob from 'glob';
import { program } from 'commander';
import { fileURLToPath } from 'url';

import { loadTsconfig } from './loadTsconfig.js';
import { resolveImports } from './resolveImports.js';
import { resolveSourcemaps } from './resolveSourcemaps.js';

console.log(chalk.blue.bold('mjscjs'))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json')));

/**
 * Version
 */

program.version(packageJson.version);

/**
 * Set list of commands line options
 */

program
    .option('-m, --module <type>', 'Module type ("esm" or "commonjs")', 'esm')
    .option('-b, --buildDir <path>', 'Path to build (target) directory', './build')
    .option('-s, --srcDir <path>', 'Path to source directory', './src')
    .option('-t, --target <path>', 'Path to working directory', '.')
    .option('-p, --project <file>', 'Path to tsconfig.json');

program.parse(process.argv);

const options = program.opts();

/**
 * Commands
 */

if (options.project) {
    console.log(`• Loading ${path.basename(options.project)}..`)
}

options.tsconfig = options.project ? loadTsconfig(process.cwd(), options.project) : {
    dirname: path.resolve(process.cwd(), options.target),
    compilerOptions: {
        module: options.module,
        outDir: options.buildDir,
        rootDir: options.srcDir,
        paths: {}
    }
};

options.isModule = options.tsconfig.compilerOptions.module !== 'commonjs';
options.extname = options.isModule ? 'mjs' : 'cjs';

const targetDir = path.resolve(options.tsconfig.dirname, options.tsconfig.compilerOptions.outDir);

glob(path.resolve(targetDir, '**', '*.js'), (error, files) => {
    if (error) {
        throw error;
    }

    files.forEach(async (filePath) => {
        console.log(`• Resolving ${filePath.replace(`${targetDir}/`, '')}..`);

        await resolveImports(filePath, options);
        await resolveSourcemaps(filePath, options);
    });

    if (files.length === 0) {
        console.log(chalk.yellow('No files found.'))
    }

    console.log(chalk.green('Processing completed successfully.'))
})

