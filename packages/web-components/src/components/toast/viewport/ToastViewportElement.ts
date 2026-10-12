import { applyStyle, isSafari, visuallyHidden } from '@flippo-software/core-components/lib';
import { mergeProps } from '@flippo-software/core-components/props';
import { ToastViewportMachine } from '@flippo-software/core-components/toast';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type { ToastObject } from '@flippo-software/core-components/toast';

import { ToastProviderPart } from '../root/ToastRootContext';

function createGuard(document: Document): HTMLSpanElement {
    const guard = document.createElement('span');
    guard.setAttribute('data-base-ui-focus-guard', '');
    if (isSafari) {
        guard.setAttribute('role', 'button');
    } else {
        guard.setAttribute('aria-hidden', 'true');
    }
    applyStyle(guard, visuallyHidden);
    guard.hidden = true;
    guard.tabIndex = -1;
    return guard;
}

/**
 * The region the toasts are shown in (F6 moves the focus to it). With a `<template>` child holding a
 * `<prefix>-toast`, it shows a copy of it for each toast; otherwise, render `<prefix>-toast` elements with their
 * `toast` property yourself (e.g. from the provider's `toasts-change`).
 *
 * State attributes: `data-expanded`.
 */
export class ToastViewportElement extends ToastProviderPart.withAttributes({}) {
    private viewport!: ToastViewportMachine;

    private readonly guards: [HTMLSpanElement, HTMLSpanElement];

    private readonly announcer: HTMLDivElement;

    /**
     * The toasts rendered from the template, by id.
     */
    private readonly rendered = new Map<string, HTMLElement & { toast?: ToastObject }>();

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        const document = this.ownerDocument;
        this.guards = [createGuard(document), createGuard(document)];
        this.announcer = document.createElement('div');
        applyStyle(this.announcer, visuallyHidden);
        root.append(this.guards[0], document.createElement('slot'), this.guards[1], this.announcer);
        for (const guard of this.guards) {
            guard.addEventListener('focus', (event) => this.viewport?.onFocusGuardFocus(event));
        }
    }

    protected override createParts() {
        this.viewport = new ToastViewportMachine(this.provider);
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.viewport.connect();
        const stopGuards = effect(() => {
            const shown = this.viewport.shouldRenderFocusGuards();
            untracked(() => {
                for (const guard of this.guards) {
                    guard.hidden = !shown;
                    guard.tabIndex = shown ? 0 : -1;
                }
            });
        });
        const stopAnnouncing = effect(() => {
            const announcements = this.viewport.getHighPriorityAnnouncements();
            untracked(() => this.announce(announcements));
        });
        const stopRendering = effect(() => {
            const { toasts } = this.provider.store.state;
            untracked(() => this.renderToasts(toasts));
        });
        return () => {
            stopRendering();
            stopAnnouncing();
            stopGuards();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.viewport?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.viewport.getViewportProps(), ToastViewportMachine.attrs(this.viewport.getState()));
    }

    /**
     * Shows a copy of the template for each toast, in their order (only with a template).
     */
    private renderToasts(toasts: readonly ToastObject[]) {
        const template = [...this.children].find((child): child is HTMLTemplateElement => child.localName === 'template');
        if (!template) {
            return;
        }
        const ids = new Set(toasts.map((toast) => toast.id));
        for (const [id, element] of this.rendered) {
            if (!ids.has(id)) {
                element.remove();
                this.rendered.delete(id);
            }
        }
        let previous: Element = template;
        for (const toast of toasts) {
            let element = this.rendered.get(toast.id);
            if (!element) {
                element = template.content.firstElementChild?.cloneNode(true) as (HTMLElement & { toast?: ToastObject }) | undefined;
                if (!element) {
                    return;
                }
                this.rendered.set(toast.id, element);
            }
            element.toast = toast;
            if (previous.nextElementSibling !== element) {
                previous.after(element);
            }
            previous = element;
        }
    }

    private announce(toasts: readonly ToastObject[]) {
        const document = this.ownerDocument;
        this.announcer.replaceChildren(
            ...toasts.map((toast) => {
                const alert = document.createElement('div');
                alert.setAttribute('role', 'alert');
                alert.setAttribute('aria-atomic', 'true');
                const title = document.createElement('div');
                title.textContent = toast.title ?? '';
                const description = document.createElement('div');
                description.textContent = toast.description ?? '';
                alert.append(title, description);
                return alert;
            })
        );
    }
}
