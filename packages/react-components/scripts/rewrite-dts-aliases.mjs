#!/usr/bin/env node
/**
 * `tsc` keeps the `~@lib/*` and `~@packages/*` path aliases in emitted declarations; consumers can't resolve
 * them, so they are rewritten to relative paths.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const ALIASES = {
    '~@lib': join(distDir, 'lib'),
    '~@packages': join(distDir, 'packages')
};

const SPECIFIER = /(from\s+|import\s*\(\s*|import\s+)(['"])(~@lib|~@packages)(\/[^'"]*)?\2/g;

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            return walk(path);
        }
        return entry.name.endsWith('.d.ts') ? [path] : [];
    });
}

let rewritten = 0;
for (const file of walk(distDir)) {
    const source = readFileSync(file, 'utf8');
    const output = source.replace(SPECIFIER, (_, prefix, quote, alias, rest = '') => {
        let specifier = relative(dirname(file), ALIASES[alias] + rest)
            .split('\\')
            .join('/');
        if (!specifier.startsWith('.')) {
            specifier = `./${specifier}`;
        }
        return `${prefix}${quote}${specifier}${quote}`;
    });
    if (output !== source) {
        writeFileSync(file, output);
        rewritten += 1;
    }
}
console.log(`Rewrote path aliases in ${rewritten} declaration files.`);
