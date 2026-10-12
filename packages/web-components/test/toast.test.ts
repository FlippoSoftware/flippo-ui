import { createToastManager } from '@flippo-software/core-components/toast';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

const tick = () => new Promise((resolve) => setTimeout(resolve));

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterEach(() => {
    document.body.innerHTML = '';
});

type Provider = HTMLElement & {
    add(options: object): string;
    close(id: string): void;
    toastManager?: ReturnType<typeof createToastManager>;
};

async function mount() {
    const container = document.createElement('div');
    container.innerHTML = `
        <ui-toast-provider timeout="0">
            <ui-toast-viewport>
                <template>
                    <ui-toast class="toast">
                        <ui-toast-title></ui-toast-title>
                        <ui-toast-description></ui-toast-description>
                        <ui-toast-action></ui-toast-action>
                        <ui-toast-close>×</ui-toast-close>
                    </ui-toast>
                </template>
            </ui-toast-viewport>
        </ui-toast-provider>`;
    document.body.append(container);
    await tick();
    return {
        provider: container.querySelector('ui-toast-provider') as Provider,
        viewport: container.querySelector('ui-toast-viewport') as HTMLElement,
        toasts: () => [...container.querySelectorAll('ui-toast')] as HTMLElement[]
    };
}

const text = (element: Element | null) => element?.shadowRoot?.querySelector('slot')?.textContent;

describe('toast', () => {
    it('shows a copy of the template for each toast, with its texts', async () => {
        const { provider, viewport, toasts } = await mount();
        expect(viewport.getAttribute('role')).toBe('region');
        const onChange = vi.fn();
        provider.addEventListener('toasts-change', onChange);

        const id = provider.add({ title: 'Saved', description: 'Your file was saved.', type: 'success' });
        await tick();
        await tick();
        expect(toasts()).toHaveLength(1);
        const [toast] = toasts() as [HTMLElement];
        expect(onChange).toHaveBeenCalled();
        expect(text(toast.querySelector('ui-toast-title'))).toBe('Saved');
        expect(text(toast.querySelector('ui-toast-description'))).toBe('Your file was saved.');
        expect(toast.getAttribute('aria-labelledby')).toBe(toast.querySelector('ui-toast-title')?.id);
        expect(toast.getAttribute('data-type')).toBe('success');
        // No action text: the action is hidden.
        expect((toast.querySelector('ui-toast-action') as HTMLElement).hidden).toBe(true);

        provider.close(id);
        await tick();
        await tick();
        expect(toasts()).toHaveLength(0);
    });

    it('closes with its close button, and takes toasts from a manager', async () => {
        const { provider, toasts } = await mount();
        const manager = createToastManager();
        provider.toastManager = manager;
        await tick();
        manager.add({ title: 'From the manager' });
        await tick();
        await tick();
        expect(toasts()).toHaveLength(1);
        ((toasts()[0] as HTMLElement).querySelector('ui-toast-close') as HTMLElement).click();
        await tick();
        await tick();
        expect(toasts()).toHaveLength(0);
    });
});
