/**
 * Prints the npm dist-tag a released version is published under (`.github/workflows/release.yaml`):
 *
 * - a prerelease, under its identifier: `2.0.0-beta.1` → `beta`, `2.0.0-rc.0` → `rc`;
 * - a release from a maintenance branch (`maintenance/<component>-v<major>`), under its major: `1.4.3` → `v1`, so
 *   the fixes of an old major do not take `latest` from the current one;
 * - any other release, under `latest`.
 *
 * Usage: `node tools/dist-tag.mjs <version> <branch>`.
 */
import process from 'node:process';

const [version, branch = ''] = process.argv.slice(2);
const match = /^(\d+)\.\d+\.\d+(?:-([0-9A-Za-z-]+))?/.exec(version ?? '');

if (!match) {
    console.error(`Not a semver version: ${version}`);
    process.exit(1);
}

const [, major, prerelease] = match;

if (prerelease) {
    // `beta.1` → `beta`; a bare number (`2.0.0-1`) has no name: `next`.
    const name = prerelease.split('.')[0];
    console.log(/^\d+$/.test(name) ? 'next' : name);
} else if (branch.startsWith('maintenance/')) {
    console.log(`v${major}`);
} else {
    console.log('latest');
}
