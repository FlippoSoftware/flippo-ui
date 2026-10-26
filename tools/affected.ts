/**
 * Selects the packages a pull request has to check (`.github/workflows/check.yaml`): the packages it changes and the
 * packages that depend on them (a change of an API in core-components is checked in react-components too), built
 * with their dependencies. Prints GitHub step outputs:
 *
 * - `any`: `false` when nothing needs checking;
 * - `docs`: whether documentation inputs changed (requires a complete workspace build);
 * - `build`, `verify`: the pnpm `--filter` arguments of the build and of lint/typecheck/test; empty means the whole
 *   workspace, as for a change outside `packages/` (lockfile, workspace config, tools, workflows).
 *
 * Usage: `node tools/affected.ts <base commit>`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

// Letters in any case, digits, `_`, `.`, `-`; not starting with a dot (no `..`).
const PLAIN_NAME = /^\w[\w.-]*$/;

/** The selection is independent of git so its CI behavior can be checked without creating commits. */
export function selectAffected(
    files: string[],
    hasPackage = (folder: string) => existsSync(`packages/${folder}/package.json`),
    warn: (message: string) => void = console.error
): Record<'any' | 'docs' | 'build' | 'verify', string> {
    const docs = files.some((file) =>
        /^(docs\/|tools\/|packages\/[^/]+\/(src\/|scss\/|etc\/|\.storybook\/|README\.md$|package\.json$|custom-elements-manifest\.config\.js$)|\.github\/|package\.json$|pnpm-lock\.yaml$|pnpm-workspace\.yaml$|\.nvmrc$)/.test(
            file
        )
    );
    const changed = files.filter((file) => !file.endsWith('.md'));
    const packages = new Set<string>();
    let whole = false;

    for (const file of changed) {
        // Package folders are plain names (letters, digits, `_`, `.`, `-`): the outputs reach a command unquoted, so a name
        // with other characters (spaces, `*`, `$`…, a path a pull request made up) checks the whole workspace instead.
        const folder = /^packages\/([^/]+)\//.exec(file)?.[1];
        const plain = folder !== undefined && PLAIN_NAME.test(folder);
        if (plain && hasPackage(folder)) {
            packages.add(folder);
        } else {
            if (folder !== undefined && !plain) {
                // stderr: stdout is the step's outputs. GitHub shows `::warning::` lines as annotations.
                warn(`::warning::Unexpected package folder name "${folder}": checking the whole workspace.`);
            }
            whole = true;
        }
    }

    const outputs = { any: String(docs || whole || packages.size > 0), docs: String(docs), build: '', verify: '' };

    if (!whole) {
        // The docs generators consume every package, even for a change to just one README or story.
        if (!docs) outputs.build = [...packages].map((name) => `--filter=...{packages/${name}}...`).join(' ');
        outputs.verify = [...packages].map((name) => `--filter=...{packages/${name}}`).join(' ');
    }
    return outputs;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
    const base = process.argv[2];
    if (!base) {
        console.error('Usage: node tools/affected.ts <base commit>');
        process.exit(1);
    }
    const files = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { encoding: 'utf8' }).split('\n').filter(Boolean);
    for (const [key, value] of Object.entries(selectAffected(files))) console.log(`${key}=${value}`);
}
