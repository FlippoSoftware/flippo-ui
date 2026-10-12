import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

import { formEntries, stubElementInternals } from './stubElementInternals';

const tick = () => new Promise((resolve) => setTimeout(resolve));

const { internalsOf, restore } = stubElementInternals();

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterAll(restore);

afterEach(() => {
    document.body.innerHTML = '';
});

async function mount(markup: string) {
    const container = document.createElement('div');
    container.innerHTML = markup;
    document.body.append(container);
    await tick();
    await tick();
    return (selector: string) => container.querySelector(selector) as HTMLElement;
}

const key = (element: Element, value: string) =>
    element.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));

describe('toggle group', () => {
    it('keeps one toggle pressed and moves with the arrow keys', async () => {
        const query = await mount(`
            <ui-toggle-group default-value="left">
                <ui-toggle id="left" value="left">L</ui-toggle>
                <ui-toggle id="right" value="right">R</ui-toggle>
            </ui-toggle-group>`);
        const group = query('ui-toggle-group');
        expect(group.getAttribute('role')).toBe('group');
        expect(query('#left').getAttribute('aria-pressed')).toBe('true');
        expect(query('#left').tabIndex).toBe(0);
        expect(query('#right').tabIndex).toBe(-1);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        group.addEventListener('value-change', onChange);
        query('#right').click();
        await tick();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: ['right'] }));
        expect(query('#right').getAttribute('aria-pressed')).toBe('true');
        expect(query('#left').getAttribute('aria-pressed')).toBe('false');

        query('#right').focus();
        key(query('#right'), 'ArrowLeft');
        await tick();
        expect(document.activeElement).toBe(query('#left'));
    });
});

describe('toolbar', () => {
    it('moves between its items, through a toggle inside a toolbar button', async () => {
        const query = await mount(`
            <ui-toolbar>
                <ui-toolbar-button id="bold" as-child><ui-toggle as-child><button>B</button></ui-toggle></ui-toolbar-button>
                <ui-toolbar-separator></ui-toolbar-separator>
                <ui-toolbar-group disabled><ui-toolbar-button id="cut">Cut</ui-toolbar-button></ui-toolbar-group>
                <ui-toolbar-input as-child><input id="search" /></ui-toolbar-input>
            </ui-toolbar>`);
        expect(query('ui-toolbar').getAttribute('role')).toBe('toolbar');
        const bold = query('button');
        // Both the toolbar button and the toggle apply their props to the same `<button>`.
        expect(bold.getAttribute('aria-pressed')).toBe('false');
        expect(bold.tabIndex).toBe(0);
        expect(query('#cut').getAttribute('aria-disabled')).toBe('true');
        expect(query('ui-toolbar-separator').getAttribute('role')).toBe('separator');

        bold.focus();
        key(bold, 'ArrowRight');
        await tick();
        // Disabled items stay focusable.
        expect(document.activeElement).toBe(query('#cut'));
        key(query('#cut'), 'ArrowRight');
        await tick();
        expect(document.activeElement).toBe(query('#search'));

        bold.click();
        await tick();
        expect(bold.getAttribute('aria-pressed')).toBe('true');
    });
});

describe('tabs', () => {
    it('shows the panel of the chosen tab', async () => {
        const query = await mount(`
            <ui-tabs default-value="a">
                <ui-tabs-list>
                    <ui-tabs-tab id="tab-a" value="a">A</ui-tabs-tab>
                    <ui-tabs-tab id="tab-b" value="b">B</ui-tabs-tab>
                    <ui-tabs-indicator></ui-tabs-indicator>
                </ui-tabs-list>
                <ui-tabs-panel id="panel-a" value="a">Panel A</ui-tabs-panel>
                <ui-tabs-panel id="panel-b" value="b">Panel B</ui-tabs-panel>
            </ui-tabs>`);
        expect(query('ui-tabs-list').getAttribute('role')).toBe('tablist');
        expect(query('#tab-a').getAttribute('role')).toBe('tab');
        expect(query('#tab-a').getAttribute('aria-selected')).toBe('true');
        expect(query('#tab-a').getAttribute('aria-controls')).toBe('panel-a');
        expect(query('#panel-a').getAttribute('aria-labelledby')).toBe('tab-a');
        expect(query('#panel-a').hidden).toBe(false);
        expect(query('#panel-b').hidden).toBe(true);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        query('ui-tabs').addEventListener('value-change', onChange);
        query('#tab-b').click();
        await tick();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: 'b' }));
        expect(query('#tab-b').hasAttribute('data-active')).toBe(true);
        expect(query('#panel-b').hidden).toBe(false);
        expect(query('#panel-a').hidden).toBe(true);
    });

    it('matches tabs and panels by position without values', async () => {
        const query = await mount(`
            <ui-tabs>
                <ui-tabs-list><ui-tabs-tab id="t1">1</ui-tabs-tab><ui-tabs-tab id="t2">2</ui-tabs-tab></ui-tabs-list>
                <ui-tabs-panel id="p1">1</ui-tabs-panel><ui-tabs-panel id="p2">2</ui-tabs-panel>
            </ui-tabs>`);
        expect(query('#p1').hidden).toBe(false);
        expect(query('#p2').hidden).toBe(true);
        query('#t2').click();
        await tick();
        expect(query('#p2').hidden).toBe(false);
    });
});

describe('accordion', () => {
    it('opens a section with its trigger, one at a time', async () => {
        const query = await mount(`
            <ui-accordion>
                <ui-accordion-item id="i1" value="one">
                    <ui-accordion-header as-child><h3><ui-accordion-trigger id="t1">One</ui-accordion-trigger></h3></ui-accordion-header>
                    <ui-accordion-panel id="p1">First</ui-accordion-panel>
                </ui-accordion-item>
                <ui-accordion-item id="i2" value="two">
                    <ui-accordion-header><ui-accordion-trigger id="t2">Two</ui-accordion-trigger></ui-accordion-header>
                    <ui-accordion-panel id="p2">Second</ui-accordion-panel>
                </ui-accordion-item>
            </ui-accordion>`);
        expect(query('#t1').getAttribute('aria-expanded')).toBe('false');
        expect(query('#p1').hidden).toBe(true);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        query('ui-accordion').addEventListener('value-change', onChange);
        query('#t1').click();
        await tick();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: ['one'] }));
        expect(query('#t1').getAttribute('aria-expanded')).toBe('true');
        expect(query('#t1').getAttribute('aria-controls')).toBe('p1');
        expect(query('#p1').hidden).toBe(false);
        expect(query('#i1').hasAttribute('data-open')).toBe(true);

        query('#t2').click();
        await tick();
        expect(query('#p2').hidden).toBe(false);
        expect(query('#p1').hidden).toBe(true);

        query('#t2').focus();
        key(query('#t2'), 'ArrowUp');
        await tick();
        expect(document.activeElement).toBe(query('#t1'));
    });
});

describe('segmented control', () => {
    it('selects one item and submits its value', async () => {
        const query = await mount(`
            <ui-segmented-control name="view" default-value="grid">
                <ui-segmented-control-item id="grid" value="grid">Grid</ui-segmented-control-item>
                <ui-segmented-control-item id="list" value="list">List</ui-segmented-control-item>
            </ui-segmented-control>`);
        const control = query('ui-segmented-control');
        expect(query('#grid').hasAttribute('data-selected')).toBe(true);
        expect(formEntries(internalsOf(control)?.formValue)).toEqual([['view', 'grid']]);
        query('#list').click();
        await tick();
        expect(query('#list').hasAttribute('data-selected')).toBe(true);
        expect(query('#grid').hasAttribute('data-selected')).toBe(false);
        expect(formEntries(internalsOf(control)?.formValue)).toEqual([['view', 'list']]);
    });
});

describe('cards', () => {
    it('checks a checkbox card', async () => {
        const query = await mount(`
            <ui-checkbox-card name="plan" value="pro"><ui-checkbox-card-indicator></ui-checkbox-card-indicator>Pro</ui-checkbox-card>`);
        const card = query('ui-checkbox-card');
        expect(query('ui-checkbox-card-indicator').hidden).toBe(true);
        card.click();
        await tick();
        expect(card.hasAttribute('data-checked')).toBe(true);
        expect(query('ui-checkbox-card-indicator').hidden).toBe(false);
        expect(formEntries(internalsOf(card)?.formValue)).toEqual([['plan', 'pro']]);
    });

    it('checks one radio card of a group', async () => {
        const query = await mount(`
            <ui-radio-group name="plan">
                <ui-radio-card id="a" value="a">A</ui-radio-card>
                <ui-radio-card id="b" value="b">B</ui-radio-card>
            </ui-radio-group>`);
        query('#b').click();
        await tick();
        expect(query('#b').hasAttribute('data-checked')).toBe(true);
        expect(query('#a').hasAttribute('data-checked')).toBe(false);
        expect(formEntries(internalsOf(query('ui-radio-group'))?.formValue)).toEqual([['plan', 'b']]);
    });
});
