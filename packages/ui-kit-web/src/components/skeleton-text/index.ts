import { skeletonText as recipe } from '@flippo-software/component-styles/skeleton-text';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';

const LINE_CLASS = recipe().line;

/** A placeholder for a paragraph: renders `lines` bars (3 by default), sized by the current font. */
class SkeletonTextBase extends PresentationElement.withAttributes({ lines: 'number', gap: 'string' }) {
    protected override getProps() {
        this.syncLines(Math.max(1, Math.floor(this.lines ?? 3)));
        return {
            'aria-hidden': 'true',
            style: { '--fl-skeleton-text-gap': this.gap }
        };
    }

    /** The lines are the element's own content (it has no content of the page). */
    private syncLines(count: number) {
        while (this.childElementCount < count) {
            const line = this.ownerDocument.createElement('span');
            line.className = LINE_CLASS;
            this.append(line);
        }
        while (this.childElementCount > count) this.lastElementChild?.remove();
    }
}
export const SkeletonTextElement: StyledConstructor<typeof SkeletonTextBase, typeof recipe> = styled(
    SkeletonTextBase,
    recipe,
    'skeleton-text',
    'root'
);
export type SkeletonTextElement = InstanceType<typeof SkeletonTextElement>;
export const elements: typeof SkeletonTextElement = SkeletonTextElement;
export function define(options: DefineOptions) {
    registerElements('skeleton-text', elements, options);
}
