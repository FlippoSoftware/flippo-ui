import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { compile } from 'sass';
import { beforeAll, describe, expect, it } from 'vitest';

import * as recipes from '../src/index';

const root = join(import.meta.dirname, '..');
const componentNames = readdirSync(join(root, 'src', 'components')).sort();

/** Every stylesheet compiled together, as `index.css` is. */
let css = '';
let tokensCss = '';

beforeAll(() => {
    const uses = ['fonts', 'base', ...componentNames.map((name) => `../components/${name}/${name}`)];
    const existing = uses.filter((path) => {
        try {
            readFileSync(join(root, 'src', 'styles', `${path}.scss`));
            return true;
        } catch {
            return false;
        }
    });
    css = compile(join(root, 'src', 'styles', 'base.scss')).css;
    for (const path of existing.slice(2)) {
        css += compile(join(root, 'src', 'styles', `${path}.scss`)).css;
    }
    tokensCss = compile(join(root, 'src', 'styles', 'tokens.scss')).css;
});

type AnyRecipe = ((props?: Record<string, unknown>) => string | Record<string, string>) & {
    variantOptions: Record<string, readonly unknown[]>;
};

/** Every combination of the options of a recipe's variants. */
function combinations(options: Record<string, readonly unknown[]>): Record<string, unknown>[] {
    return Object.entries(options).reduce<Record<string, unknown>[]>(
        (result, [name, values]) => result.flatMap((props) => values.map((value) => ({ ...props, [name]: value }))),
        [{}]
    );
}

function classesOf(recipe: AnyRecipe): Set<string> {
    const classes = new Set<string>();
    for (const props of combinations(recipe.variantOptions)) {
        const result = recipe(props);
        const strings = typeof result === 'string' ? [result] : Object.values(result);
        for (const value of strings) {
            for (const name of value.split(/\s+/).filter(Boolean)) {
                classes.add(name);
            }
        }
    }
    return classes;
}

describe('recipes', () => {
    it('exports a recipe for every component', () => {
        expect(Object.keys(recipes).length).toBeGreaterThanOrEqual(componentNames.length);
    });

    it('only return classes that the stylesheets define', () => {
        const defined = new Set([...css.matchAll(/\.(fl-[a-z0-9-]+)/g)].map((match) => match[1]!));
        const missing: string[] = [];
        for (const [name, recipe] of Object.entries(recipes).filter(([, value]) => typeof value === 'function')) {
            for (const className of classesOf(recipe as unknown as AnyRecipe)) {
                if (!defined.has(className)) {
                    missing.push(`${name}: ${className}`);
                }
            }
        }
        expect(missing).toEqual([]);
    });

    it('compose the shared classes and text styles', () => {
        expect(recipes.button({ variant: 'secondary', size: 'small' })).toBe(
            'fl-button fl-interactive fl-focus-ring fl-button--secondary fl-button--small fl-text-body-minus-stronger'
        );
        expect(recipes.select({ size: 'large' }).trigger).toBe(
            'fl-select-trigger fl-control fl-control--light fl-control--large fl-text-body-default'
        );
    });
});

describe('stylesheets', () => {
    it('only use tokens that tokens.css defines', () => {
        const defined = new Set(tokensCss.match(/--fl-[a-z0-9-]+(?=:)/g));
        const groups = /^--fl-(color|spacing|radius|size|text|font|shadow|duration|ease|z|border-width|focus)-/;
        const used = new Set([...css.matchAll(/var\((--fl-[a-z0-9-]+)/g)].map((match) => match[1]!));
        const undefinedTokens = [...used].filter((name) => groups.test(name) && !defined.has(name) && !name.startsWith('--fl-focus-ring-'));
        expect(undefinedTokens).toEqual([]);
    });

    it('read every private variable they set', () => {
        const set = new Set([...css.matchAll(/(--_fl-[a-z0-9-]+):/g)].map((match) => match[1]!));
        const read = new Set([...css.matchAll(/var\((--_fl-[a-z0-9-]+)/g)].map((match) => match[1]!));
        expect([...set].filter((name) => !read.has(name))).toEqual([]);
    });

    it('pass component hooks to shared patterns without a fallback', () => {
        const hooks = [...css.matchAll(/--_fl-[a-z0-9-]+-hook: ([^;]+);/g)].map((match) => match[1]!);
        expect(hooks.length).toBeGreaterThan(0);
        expect(hooks.filter((value) => !/^var\(--fl-[a-z0-9-]+\)$/.test(value))).toEqual([]);
    });

    it('put every rule in a cascade layer', () => {
        for (const name of componentNames) {
            const path = join(root, 'src', 'components', name, `${name}.scss`);
            let source: string;
            try {
                source = readFileSync(path, 'utf8');
            } catch {
                continue;
            }
            expect(source, name).toMatch(/@layer fl\.components|@use '\.\.\/[a-z-]+\/[a-z-]+';/);
        }
    });

    it('define light and dark values for every semantic colour', () => {
        const semantic = [...tokensCss.matchAll(/--fl-color-([a-z0-9-]+): light-dark\(/g)].map((match) => match[1]);
        expect(semantic).toContain('bg-0');
        expect(semantic).toContain('text-strong');
        expect(tokensCss).toContain('color-scheme: light dark');
    });
});
