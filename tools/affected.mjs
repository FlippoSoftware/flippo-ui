/**
 * Selects the packages a pull request has to check (`.github/workflows/check.yaml`): the packages it changes and the
 * packages that depend on them (a change of an API in core-components is checked in react-components too), built
 * with their dependencies. Prints GitHub step outputs:
 *
 * - `any`: `false` when nothing needs checking (only Markdown changed);
 * - `build`, `verify`: the pnpm `--filter` arguments of the build and of lint/typecheck/test; empty means the whole
 *   workspace, as for a change outside `packages/` (lockfile, workspace config, tools, workflows).
 *
 * Usage: `node tools/affected.mjs <base commit>`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';

const base = process.argv[2];

if (!base) {
    console.error('Usage: node tools/affected.mjs <base commit>');
    process.exit(1);
}

const changed = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { encoding: 'utf8' })
    .split('\n')
    .filter((file) => file && !file.endsWith('.md'));

// Letters in any case, digits, `_`, `.`, `-`; not starting with a dot (no `..`).
const PLAIN_NAME = /^\w[\w.-]*$/;

const packages = new Set();
let whole = false;

for (const file of changed) {
    // Package folders are plain names (letters, digits, `_`, `.`, `-`): the outputs reach a command unquoted, so a name
    // with other characters (spaces, `*`, `$`…, a path a pull request made up) checks the whole workspace instead.
    const folder = /^packages\/([^/]+)\//.exec(file)?.[1];
    const plain = folder !== undefined && PLAIN_NAME.test(folder);
    if (plain && existsSync(`packages/${folder}/package.json`)) {
        packages.add(folder);
    } else {
        if (folder !== undefined && !plain) {
            // stderr: stdout is the step's outputs. GitHub shows `::warning::` lines as annotations.
            console.error(`::warning::Unexpected package folder name "${folder}": checking the whole workspace.`);
        }
        whole = true;
    }
}

const outputs = { any: String(whole || packages.size > 0), build: '', verify: '' };

if (!whole) {
    outputs.build = [...packages].map((name) => `--filter=...{packages/${name}}...`).join(' ');
    outputs.verify = [...packages].map((name) => `--filter=...{packages/${name}}`).join(' ');
}

for (const [key, value] of Object.entries(outputs)) {
    console.log(`${key}=${value}`);
}
