import * as recipes from '@flippo-software/component-styles';
import { components as headless } from '@flippo-software/web-components';
import { afterEach, describe, expect, it } from 'vitest';

import { type ButtonElement, type CheckboxElement, components, define, type GridElement } from '../src';

define({ prefix: 'styled-test' });
const flush = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
};
afterEach(() => {
    document.body.replaceChildren();
});

describe('styled Web Components', () => {
    it('covers every headless family and every shared recipe', () => {
        for (const name of Object.keys(headless)) expect(components, name).toHaveProperty(name);
        for (const [name] of Object.entries(recipes).filter(([, value]) => typeof value === 'function'))
            expect(components, name).toHaveProperty(name === 'switchRecipe' ? 'switch' : name);
        define({ prefix: 'styled-test' });
    });
    it('styles the as-child target, updates variants and keeps consumer classes', async () => {
        // biome-ignore lint/security/noSecrets: HTML fixture, not a secret.
        document.body.innerHTML = '<styled-test-button as-child size="small"><button class="user">Save</button></styled-test-button>';
        await flush();
        const host = document.body.firstElementChild as InstanceType<typeof ButtonElement>;
        const button = host.firstElementChild as HTMLButtonElement;
        expect(button.className).toContain('fl-button--small');
        expect(button.className).toContain('user');
        host.setAttribute('size', 'large');
        await flush();
        expect(button.className).toContain('fl-button--large');
        expect(button.className).not.toContain('fl-button--small');
        expect(host.className).not.toContain('fl-button');
        host.remove();
        expect(button.className).toBe('user');
    });
    it('moves styles when the as-child target is replaced', async () => {
        document.body.innerHTML = '<styled-test-button as-child><button>Old</button></styled-test-button>';
        await flush();
        const host = document.body.firstElementChild!;
        const old = host.firstElementChild!;
        const next = document.createElement('button');
        next.className = 'next';
        host.replaceChildren(next);
        await flush();
        expect(old.className).not.toContain('fl-button');
        expect(next.className).toContain('fl-button');
        expect(next.className).toContain('next');
    });
    it('inherits variants from the family root and reacts to attribute changes', async () => {
        document.body.innerHTML =
            '<styled-test-input size="small"><styled-test-input-control as-child><input /></styled-test-input-control></styled-test-input>';
        await flush();
        const root = document.body.firstElementChild!;
        expect(root.className).toContain('fl-control--small');
        expect(root.querySelector('input')?.className).toContain('fl-input-control');
        root.setAttribute('size', 'large');
        await flush();
        expect(root.className).toContain('fl-control--large');
    });
    it('keeps checkbox machine behaviour', async () => {
        document.body.innerHTML =
            '<styled-test-checkbox size="large" aria-label="Accept"><styled-test-checkbox-indicator>✓</styled-test-checkbox-indicator></styled-test-checkbox>';
        await flush();
        const checkbox = document.body.firstElementChild as InstanceType<typeof CheckboxElement>;
        expect(checkbox.className).toContain('fl-checkbox-root--large');
        checkbox.click();
        await flush();
        expect(checkbox.getAttribute('aria-checked')).toBe('true');
    });
    it('uses the same typography, card and layout styles as React', async () => {
        document.body.innerHTML =
            '<styled-test-card><styled-test-card-title>Title</styled-test-card-title><styled-test-text size="heading-2" color="brand">Hello</styled-test-text><styled-test-grid columns="3" spacing="4"></styled-test-grid></styled-test-card>';
        await flush();
        const text = document.querySelector('styled-test-text')!;
        expect(text.className).toContain('fl-text-heading-2-default');
        const grid = document.querySelector('styled-test-grid') as InstanceType<typeof GridElement>;
        expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
        expect(grid.style.gap).toBe('var(--fl-spacing-4)');
    });
    it('updates a popup when root styling properties change', async () => {
        document.body.innerHTML =
            // biome-ignore lint/security/noSecrets: Static custom-element markup, not a credential.
            '<styled-test-dialog size="large"><styled-test-dialog-popup></styled-test-dialog-popup></styled-test-dialog>';
        await flush();
        const root = document.body.firstElementChild!;
        const popup = root.firstElementChild!;
        expect(popup.className).toContain('fl-dialog-popup--large');
        root.setAttribute('size', 'small');
        await flush();
        expect(popup.className).toContain('fl-dialog-popup--small');
        expect(popup.className).not.toContain('fl-dialog-popup--large');
    });
    it('clears input through its native change event', async () => {
        document.body.innerHTML =
            // biome-ignore lint/security/noSecrets: Static custom-element markup, not a credential.
            '<styled-test-input><styled-test-input-control as-child><input value="Alice" /></styled-test-input-control><styled-test-input-clear as-child><button>Clear</button></styled-test-input-clear></styled-test-input>';
        await flush();
        const input = document.querySelector('input')!;
        let changes = 0;
        input.addEventListener('input', () => {
            changes += 1;
        });
        document.querySelector('button')!.click();
        await flush();
        expect(input.value).toBe('');
        expect(changes).toBe(1);
    });
    it('includes every recipe slot in the registered family', () => {
        // One element that renders the content of its other slots itself (the lines of a skeleton text).
        const singleElements = new Set(['skeletonText']);
        for (const [name, recipe] of Object.entries(recipes)) {
            if (typeof recipe !== 'function' || singleElements.has(name)) continue;
            const result = recipe({} as never);
            if (typeof result === 'string') continue;
            const family = components[name === 'switchRecipe' ? 'switch' : (name as keyof typeof components)];
            for (const slot of Object.keys(result)) {
                expect(family, `${name}.${slot}`).toHaveProperty(slot);
            }
        }
    });
});
