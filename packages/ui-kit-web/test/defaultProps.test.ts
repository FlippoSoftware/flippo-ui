import { afterEach, describe, expect, it } from 'vitest';

import { define, setDefaultProps } from '../src';

import type { DefaultProps, DefaultPropsElement, SelectPositionerElement } from '../src';

define({ prefix: 'dp', defaults: { button: { size: 'small' } } });

const flush = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
};

function mount(html: string): HTMLElement {
    const root = document.createElement('div');
    root.innerHTML = html;
    document.body.append(root);
    return root;
}

afterEach(() => {
    document.body.replaceChildren();
    setDefaultProps({ button: { size: 'small' } });
});

describe('default props', () => {
    it('gives the families the defaults of define(); an attribute wins', async () => {
        const root = mount(
            '<dp-button as-child><button id="default">Default</button></dp-button><dp-button size="large" as-child><button id="large">Large</button></dp-button>'
        );
        await flush();
        expect(root.querySelector('#default')?.className).toContain('fl-button--small');
        expect(root.querySelector('#large')?.className).toContain('fl-button--large');
    });

    it('lets a <prefix>-default-props override them in its subtree, and follows its changes', async () => {
        const root = mount(
            '<dp-default-props><dp-button as-child><button id="inside">Inside</button></dp-button></dp-default-props><dp-button as-child><button id="outside">Outside</button></dp-button>'
        );
        const provider = root.querySelector('dp-default-props') as DefaultPropsElement;
        provider.defaults = { button: { variant: 'danger' } };
        await flush();
        const inside = root.querySelector('#inside')?.className;
        // The provider's entry merges with the global one, key by key.
        expect(inside).toContain('fl-button--danger');
        expect(inside).toContain('fl-button--small');
        expect(root.querySelector('#outside')?.className).not.toContain('fl-button--danger');

        provider.defaults = { button: { variant: 'outlined', size: 'large' } };
        await flush();
        expect(root.querySelector('#inside')?.className).toContain('fl-button--outlined');
        expect(root.querySelector('#inside')?.className).toContain('fl-button--large');
    });

    it('gives a part its own entry over the kit defaults', async () => {
        setDefaultProps({ select: { positioner: { sideOffset: 4 } } });
        const root = mount('<dp-select><dp-select-positioner></dp-select-positioner></dp-select>');
        await flush();
        const positioner = root.querySelector('dp-select-positioner') as SelectPositionerElement;
        expect(positioner.sideOffset).toBe(4);
        positioner.sideOffset = 12;
        expect(positioner.sideOffset).toBe(12);
    });

    it('types the families, their properties and their parts', () => {
        const defaults: DefaultProps = { select: { size: 'small', positioner: { sideOffset: 4 } } };
        // @ts-expect-error: not a size of the button
        const wrongSize: DefaultProps = { button: { size: 'huge' } };
        // @ts-expect-error: not a family of the kit
        const wrongFamily: DefaultProps = { table: {} };
        expect([defaults, wrongSize, wrongFamily]).toHaveLength(3);
    });
});
