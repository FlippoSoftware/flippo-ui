/**
 * Refuses `pnpm publish` outside the release workflow: the packages are published by GitHub Actions only, after the
 * checks pass (`.github/workflows/release.yaml`). Runs from the `prepublishOnly` script of every published package.
 *
 * The one exception is the very first publication of a package (npm trusted publishing can only be set up for a
 * package that exists): `FLIPPO_FIRST_PUBLISH=1 pnpm publish` from a maintainer's machine.
 */
import process from 'node:process';

const inReleaseWorkflow = process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_WORKFLOW === 'Release';
const firstPublish = process.env.FLIPPO_FIRST_PUBLISH === '1';

if (!(inReleaseWorkflow || firstPublish)) {
    console.error(
        [
            'Publishing is done by the Release workflow (merge the release pull request of release-please).',
            'Only the first publication of a new package may be done by hand: FLIPPO_FIRST_PUBLISH=1 pnpm publish.'
        ].join('\n')
    );
    process.exit(1);
}
