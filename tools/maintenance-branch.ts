/**
 * Creates the maintenance branch of an old major of a package (`.github/workflows/maintenance-branch.yaml`):
 * `maintenance/<component>-v<major>`, from the tag of the last `<major>.x` release, with the release tooling of `main`
 * (`.github/` and the release scripts) in one `ci:` commit. On a push, GitHub runs the workflows of the pushed branch:
 * without that commit, a branch made from an older tag would run the release workflow of its time.
 *
 * Usage: `node tools/maintenance-branch.ts <component> <major> [--dry-run]`, in a clone with the tags and `origin/main`.
 * `--dry-run` prints the plan and changes nothing.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import process from 'node:process';
import { parseArgs } from 'node:util';

const SOURCE = 'origin/main';
const TOOLING = ['.github', 'tools/affected.ts', 'tools/dist-tag.ts', 'tools/publish-guard.ts', 'tools/release-order.ts'];

const { values, positionals } = parseArgs({ allowPositionals: true, options: { 'dry-run': { type: 'boolean' } } });
const [component, majorText] = positionals;

function git(...args: string[]): string {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function fail(message: string): never {
    console.error(message);
    process.exit(1);
}

const config: { packages: Record<string, { component?: string }> } = JSON.parse(git('show', `${SOURCE}:release-please-config.json`));
const manifest: Record<string, string> = JSON.parse(git('show', `${SOURCE}:.release-please-manifest.json`));
const path = Object.keys(config.packages).find((key) => config.packages[key].component === component);

if (!path) {
    fail(`Unknown package "${component}": the components are in release-please-config.json.`);
}
if (!/^\d+$/.test(majorText ?? '')) {
    fail(`The major must be a number, not "${majorText ?? ''}".`);
}

const major = Number(majorText);
const current = manifest[path];
if (major >= Number(current.split('.')[0])) {
    fail(`${component} is at ${current} on main: a maintenance branch is for an older major.`);
}

// The newest stable release of the major (`react-components-v1.4.2`, not `…-v1.5.0-beta.1`).
const tag = git('tag', '--list', `${component}-v${major}.*`, '--sort=-v:refname')
    .split('\n')
    .find((name) => /-v\d+\.\d+\.\d+$/.test(name));
if (!tag) {
    fail(`No release tag ${component}-v${major}.x.y: nothing to maintain.`);
}

const branch = `maintenance/${component}-v${major}`;
let exists = true;
try {
    git('ls-remote', '--exit-code', '--heads', 'origin', branch);
} catch {
    exists = false;
}
if (exists) {
    fail(`${branch} exists already: cherry-pick the fixes into it.`);
}
if (git('branch', '--list', branch)) {
    fail(`A local branch ${branch} exists: delete it (git branch -D ${branch}) or push it.`);
}

// The tooling that main has (a path missing on main is not an error: there is nothing to bring).
const tooling = TOOLING.filter((file) => {
    try {
        git('cat-file', '-e', `${SOURCE}:${file}`);
        return true;
    } catch {
        return false;
    }
});

console.log(`${branch} from ${tag}, with the release tooling of ${SOURCE}.`);
if (values['dry-run']) {
    process.exit(0);
}

git('switch', '--quiet', '--create', branch, tag);
// Workflows removed on main go away here too.
git('rm', '-r', '--quiet', '--ignore-unmatch', '.github');
git('checkout', SOURCE, '--', ...tooling);
if (git('status', '--porcelain')) {
    git('commit', '--quiet', '-m', `ci: release tooling of main for the ${component} ${major}.x maintenance branch`);
}
git('push', '--quiet', 'origin', branch);

if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        [
            `### ${branch}`,
            '',
            `Created from \`${tag}\`. Fix on \`main\` first, then bring the commit here:`,
            '',
            '```sh',
            `git switch ${branch} && git pull`,
            'git cherry-pick -x <sha>',
            'git push',
            '```',
            '',
            `Releases from this branch are published under the npm dist-tag \`v${major}\`.`,
            ''
        ].join('\n')
    );
}
console.log(`Pushed ${branch}.`);
