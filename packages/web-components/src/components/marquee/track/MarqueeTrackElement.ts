import { applyStyle } from '@flippo-software/core-components/lib';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { ContextPart } from '../../../lib/ContextPart';
import { MARQUEE_ROOT } from '../root/MarqueeRootContext';

const COPY = 'data-flippo-marquee-copy';

abstract class MarqueePart extends ContextPart<typeof MARQUEE_ROOT> {
    protected readonly contexts = MARQUEE_ROOT;
}

/**
 * The scrolling strip: it shows copies of its content (in the page, after it: `aria-hidden`, inert, without ids), and
 * measures one copy (its own content, hidden in its shadow root).
 */
export class MarqueeTrackElement extends MarqueePart.withAttributes({}) {
    private readonly measure: HTMLDivElement;

    private copies: Element[] = [];

    private observer: MutationObserver | null = null;

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        this.measure = this.ownerDocument.createElement('div');
        this.measure.setAttribute('aria-hidden', 'true');
        this.measure.append(this.ownerDocument.createElement('slot'));
        const copies = this.ownerDocument.createElement('slot');
        copies.name = 'copies';
        root.append(this.measure, copies);
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        const marquee = this.provided[0].machine;
        marquee.setContent(this.measure);
        const stopCopying = effect(() => {
            const count = marquee.store.state.multiplier * 2;
            untracked(() => this.renderCopies(count));
        });
        this.observer = new MutationObserver((records) => {
            if (records.some((record) => !this.copies.includes(record.target as Element) && !this.isInCopy(record.target))) {
                this.renderCopies(this.copies.length, true);
                marquee.calculateSize();
            }
        });
        this.observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
        const onIteration = () => this.provided[0].dispatchEvent(new CustomEvent('cycle-complete', { bubbles: true }));
        const onEnd = () => this.provided[0].dispatchEvent(new CustomEvent('finish', { bubbles: true }));
        this.addEventListener('animationiteration', onIteration);
        this.addEventListener('animationend', onEnd);
        return () => {
            this.removeEventListener('animationiteration', onIteration);
            this.removeEventListener('animationend', onEnd);
            this.observer?.disconnect();
            this.observer = null;
            stopCopying();
            this.renderCopies(0);
            marquee.setContent(null);
        };
    }

    protected override getProps(): Props {
        const marquee = this.provided[0].machine;
        applyStyle(this.measure, marquee.getMeasureStyle());
        return { style: marquee.getTrackStyle() };
    }

    private isInCopy(node: Node): boolean {
        return node instanceof Element ? node.closest(`[${COPY}]`) !== null : node.parentElement?.closest(`[${COPY}]`) != null;
    }

    /**
     * Shows `count` copies of the content (`refresh`: copies the current content again).
     */
    private renderCopies(count: number, refresh = false) {
        this.observer?.disconnect();
        if (refresh) {
            for (const copy of this.copies) {
                copy.remove();
            }
            this.copies = [];
        }
        while (this.copies.length > count) {
            this.copies.pop()?.remove();
        }
        const originals = [...this.childNodes].filter((node) => !(node instanceof Element && node.hasAttribute(COPY)));
        while (this.copies.length < count) {
            const copy = this.ownerDocument.createElement('div');
            copy.setAttribute(COPY, '');
            copy.setAttribute('slot', 'copies');
            copy.setAttribute('aria-hidden', 'true');
            copy.setAttribute('inert', '');
            copy.style.display = 'contents';
            for (const node of originals) {
                const clone = node.cloneNode(true);
                if (clone instanceof Element) {
                    clone.removeAttribute('id');
                    for (const element of clone.querySelectorAll('[id]')) {
                        element.removeAttribute('id');
                    }
                }
                copy.append(clone);
            }
            this.append(copy);
            this.copies.push(copy);
        }
        this.observer?.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
    }
}
