/** Guides opt into contract tracking in registry.json. Changed contracts warn until the guide is reviewed. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { contractHash } from './contracts.ts';

type RegistryEntry = { contracts: string[]; reviewed: Record<string, string> };
export type Registry = Record<string, RegistryEntry>;
export type RegistryReport = {
    current: { page: string; contract: string; hash: string }[];
    stale: { page: string; contract: string; reviewed?: string; current: string }[];
    errors: string[];
};

function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateEntry(page: string, entry: unknown): asserts entry is RegistryEntry {
    if (
        !isObject(entry) ||
        !Array.isArray(entry.contracts) ||
        !entry.contracts.every((contract) => typeof contract === 'string') ||
        !isObject(entry.reviewed)
    ) {
        throw new Error(`Invalid registry entry: ${page}`);
    }
    if (new Set(entry.contracts).size !== entry.contracts.length) throw new Error(`${page}: duplicate contracts`);
    for (const [contract, hash] of Object.entries(entry.reviewed)) {
        if (!entry.contracts.includes(contract) || typeof hash !== 'string' || !/^[a-f0-9]{12}$/.test(hash)) {
            throw new Error(`${page}: invalid reviewed hash for ${contract}`);
        }
    }
}

export function readRegistry(root: string): Registry {
    const registry: unknown = JSON.parse(readFileSync(join(root, 'docs/registry.json'), 'utf8'));
    if (!isObject(registry)) throw new Error('registry.json must be an object');
    for (const [page, entry] of Object.entries(registry)) {
        if (
            isAbsolute(page) ||
            page.split('/').includes('..') ||
            !page.endsWith('.mdx') ||
            !existsSync(join(root, 'docs/content/docs', page))
        ) {
            throw new Error(`Unknown registry page: ${page}`);
        }
        validateEntry(page, entry);
    }
    return registry as Registry;
}

export function checkRegistry(root: string, registry: Registry): RegistryReport {
    const report: RegistryReport = { current: [], stale: [], errors: [] };
    const hashes = new Map<string, string>();
    for (const [page, entry] of Object.entries(registry)) {
        for (const contract of entry.contracts) {
            try {
                let hash = hashes.get(contract);
                if (hash === undefined) {
                    hash = contractHash(root, contract);
                    hashes.set(contract, hash);
                }
                const reviewed = entry.reviewed[contract];
                if (reviewed === hash) report.current.push({ page, contract, hash });
                else report.stale.push({ page, contract, reviewed, current: hash });
            } catch (error) {
                report.errors.push(`${page}: ${contract}: ${(error as Error).message}`);
            }
        }
    }
    return report;
}

export function reviewRegistry(root: string, registry: Registry, pages: string[]): RegistryReport {
    const selected = pages.map((page) => {
        if (Object.hasOwn(registry, page)) return page;
        const normalized = relative(join(root, 'docs/content/docs'), resolve(page));
        if (Object.hasOwn(registry, normalized)) return normalized;
        throw new Error(`Page is not registered: ${page}`);
    });
    const report = checkRegistry(root, registry);
    if (report.errors.length > 0) throw new Error(report.errors.join('\n'));
    for (const item of [...report.current.map((item) => ({ ...item, current: item.hash })), ...report.stale]) {
        if (selected.includes(item.page)) registry[item.page].reviewed[item.contract] = item.current;
    }
    writeFileSync(join(root, 'docs/registry.json'), `${JSON.stringify(registry, null, 4)}\n`);
    return checkRegistry(root, registry);
}

function options(args: string[]) {
    const pages: string[] = [];
    let jsonFile: string | undefined;
    for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (arg === '--json' && args[index + 1] && !args[index + 1].startsWith('--')) jsonFile = resolve(args[++index]);
        else if (arg === '--review') {
            const start = pages.length;
            while (args[index + 1] && !args[index + 1].startsWith('--')) pages.push(args[++index]);
            if (pages.length === start) throw new Error('--review requires at least one registered page');
        } else throw new Error(`Unknown or incomplete option: ${arg}`);
    }
    return { pages, jsonFile };
}

function main() {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
    let jsonFile: string | undefined;
    let report: RegistryReport = { current: [], stale: [], errors: [] };
    try {
        const parsed = options(process.argv.slice(2));
        jsonFile = parsed.jsonFile;
        const registry = readRegistry(root);
        report = parsed.pages.length > 0 ? reviewRegistry(root, registry, parsed.pages) : checkRegistry(root, registry);
    } catch (error) {
        report.errors.push((error as Error).message);
    }
    if (jsonFile) {
        mkdirSync(dirname(jsonFile), { recursive: true });
        writeFileSync(jsonFile, `${JSON.stringify(report, null, 4)}\n`);
    }
    for (const { page, contract } of report.stale)
        console.warn(`docs: ${page}: ${contract} changed since the guide was reviewed (warning only)`);
    for (const error of report.errors) console.error(`docs: ${error}`);
    console.log(`docs registry: ${report.current.length} current, ${report.stale.length} to review, ${report.errors.length} errors`);
    if (report.errors.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
