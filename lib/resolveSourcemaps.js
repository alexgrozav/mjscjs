import fs from 'fs';

export const resolveSourcemaps = async (filePath, options) => {
    const sourcemapPath = filePath.replace('.js', '.js.map');
    const sourcemapTargetPath = filePath.replace('.js', `.${options.extname}.map`);

    if (!fs.existsSync(sourcemapPath)) {
        return;
    }

    const contents = await fs.promises.readFile(sourcemapPath);
    await fs.promises.writeFile(
        sourcemapTargetPath,
        contents
            .toString()
            .replace(/("file":\s*")([^"]+).js"/, `$1$2.${options.extname}"`)
    );
    await fs.promises.unlink(sourcemapPath);
};
