import fs from 'fs';

export const resolveTypes = async (filePath, options) => {
    const typePath = filePath.replace('.js', '.d.ts');
    const typeTargetPath = filePath.replace(".js", `.${options.extname}`);

    if (!fs.existsSync(typePath)) {
        return;
    }

    const contents = await fs.promises.readFile(typePath);
    await fs.promises.writeFile(
        typeTargetPath,
        contents
            .toString()
            .replace(/("file":\s*")([^"]+).d.ts"/, `$1$2.${options.extname}"`)
    );
};
