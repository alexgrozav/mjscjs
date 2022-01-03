import path from 'path';
import fs from 'fs';

/**
 * Resolve import relative to file path if applicable
 *
 * @param filePath
 * @param importPath
 * @param tsconfig
 * @param extname
 * @returns {string|*}
 */
const resolveImport = (filePath, importPath, { tsconfig, extname }) => {
    let resolvedPath = importPath;
    let importExtname = path.extname(importPath);

    /**
     * Resolve relative imports
     */
    if (/^\.\.?\//.test(importPath) && !importExtname) {
        const resolvedModulePath = path.resolve(path.dirname(filePath), importPath);
        const resolvedModulePathIsDir = fs.existsSync(resolvedModulePath)
            && fs.lstatSync(resolvedModulePath).isDirectory()

        return resolvedModulePathIsDir ? `${importPath}/index.${extname}` : `${importPath}.${extname}`;
    }

    /**
     * Resolve tsconfig.compilerOptions.paths aliases
     */
    Object.entries(tsconfig.compilerOptions.paths).forEach(([key, value]) => {
        const pathRegEx = new RegExp(key);
        const pathResolution = value[0]
            .replace(tsconfig.compilerOptions.rootDir, tsconfig.compilerOptions.outDir)
            .replace('*', '');

        if (pathRegEx.test(importPath)) {
            const resolvedModulePath = path.resolve(tsconfig.dirname, importPath.replace(pathRegEx, pathResolution).replace('*', ''));
            const resolvedModulePathIsDir = fs.existsSync(resolvedModulePath)
                && fs.lstatSync(resolvedModulePath).isDirectory();

            resolvedPath = path.relative(path.dirname(filePath), resolvedModulePath);
            resolvedPath = resolvedPath.startsWith('.') ? resolvedPath : `./${resolvedPath}`
            if (!importExtname) {
                resolvedPath = resolvedModulePathIsDir ? `${resolvedPath}/index.${extname}` : `${resolvedPath}.${extname}`;
            }
        }
    });

    return resolvedPath;
}

/**
 * Detect imports for esm and cjs using regular expressions
 *
 * @param filePath
 * @param options
 * @returns {string}
 */
export const resolveImports = async (filePath, options) => {
    const importRegEx = options.isModule ? /(from ['"])([^'"]+)(['"])/g : /(require\(['"])([^'"]+)(['"]\))/g;
    const targetPath = filePath.replace('.js', `.${options.extname}`);

    let contents = await fs.promises.readFile(filePath);
    contents = contents
        .toString()
        .replace(importRegEx, (match, ...parts) => {
            const resolvedImportPath = resolveImport(filePath, parts[1], options);

            return `${parts[0]}${resolvedImportPath}${parts[2]}`;
        })
        .replace(/(\/\/# sourceMappingURL=)(.+)/, (match, ...parts) => {
            return parts[0] + parts[1].replace('.js', `.${options.extname}`);
        });

    await fs.promises.writeFile(targetPath, contents);
    await fs.promises.unlink(filePath);
}
