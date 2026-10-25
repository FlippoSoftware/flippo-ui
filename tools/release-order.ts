/**
 * Checks the packages a release is about to publish and prints them in publish order, one path per line
 * (`.github/workflows/release.yaml`).
 *
 * `pnpm publish` replaces `workspace:^` with the version the dependency has in the workspace. With one release pull
 * request per package, a dependent can be released before its dependency: it would then require a version that is
 * not on npm. So every `workspace:` dependency (and peer dependency) of a released package must either be published
 * already, or be released by the same run, in which case it is published first.
 *
 * Usage: `node tools/release-order.ts '["packages/core-components","packages/react-components"]'`.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const REGISTRY = 'https://registry.npmjs.org';

type Manifest = {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
};

function readManifest(path: string): Manifest {
    return JSON.parse(readFileSync(join(path, 'package.json'), 'utf8'));
}

const paths: string[] = JSON.parse(process.argv[2] ?? '[]');
const released = new Map(
    paths.map((path) => {
        const manifest = readManifest(path);
        return [manifest.name, { path, manifest }];
    })
);

/** The workspace packages `manifest` depends on (dependencies and peers), with their versions in the workspace. */
function workspaceDependencies(manifest: Manifest): { name: string; version: string }[] {
    const names = Object.entries({ ...manifest.dependencies, ...manifest.peerDependencies })
        .filter(([, spec]) => spec.startsWith('workspace:'))
        .map(([name]) => name);
    return names.map((name) => {
        const { version } = readManifest(join('packages', name.replace('@flippo-software/', '')));
        return { name, version };
    });
}

async function isPublished(name: string, version: string): Promise<boolean> {
    const response = await fetch(`${REGISTRY}/${name.replace('/', '%2F')}/${version}`);
    return response.ok;
}

const problems: string[] = [];
const order: string[] = [];
const visiting = new Set<string>();

async function visit(name: string): Promise<void> {
    const release = released.get(name);
    if (!release || order.includes(name) || visiting.has(name)) {
        return;
    }
    visiting.add(name);
    for (const dependency of workspaceDependencies(release.manifest)) {
        if (released.has(dependency.name)) {
            await visit(dependency.name);
        } else if (!(await isPublished(dependency.name, dependency.version))) {
            problems.push(
                `${name} depends on ${dependency.name}@${dependency.version}, which is not on npm: release ${dependency.name} first.`
            );
        }
    }
    order.push(name);
}

for (const name of released.keys()) {
    await visit(name);
}

if (problems.length > 0) {
    console.error(problems.join('\n'));
    process.exit(1);
}

console.log(order.map((name) => released.get(name)?.path).join('\n'));
