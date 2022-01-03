import fs from 'fs';
import path from 'path';
import merge from 'deepmerge';

export const loadTsconfig = (cwd, filename) => {
    const tsconfigPath = path.resolve(cwd, filename);
    const tsconfigDirname = path.dirname(tsconfigPath);

    let tsconfigContents = JSON.parse(fs.readFileSync(tsconfigPath));
    tsconfigContents.dirname = tsconfigDirname;

    if (tsconfigContents.extends) {
        const extendTsconfigPath = path.resolve(tsconfigDirname, tsconfigContents.extends);

        tsconfigContents = merge(
            JSON.parse(fs.readFileSync(extendTsconfigPath)),
            tsconfigContents
        );
    }

    return tsconfigContents;
}
