import type { ToolbarItemOptions, ToolbarMachine } from '@flippo-software/core-components/toolbar';

import { ContextPart } from '../../../lib/ContextPart';
import { createContext, providesContext, requestAncestorContext } from '../../../lib/context';

import type { ToolbarGroupElement } from '../group/ToolbarGroupElement';

import type { ToolbarElement } from './ToolbarElement';

export const ToolbarContext = createContext<ToolbarElement>('toolbar');

export const ToolbarGroupContext = createContext<ToolbarGroupElement>('toolbar-group');

const TOOLBAR = [ToolbarContext] as const;

export abstract class ToolbarPart extends ContextPart<typeof TOOLBAR> {
    protected readonly contexts = TOOLBAR;

    protected get toolbar(): ToolbarMachine {
        return this.provided[0].machine;
    }
}

/**
 * Base of the items: an item of the toolbar's navigation, in the toolbar group around it, if any.
 */
export abstract class ToolbarItemPart extends ToolbarPart.withAttributes({
    /**
     * Whether the item ignores user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Whether the item stays focusable while disabled, so the arrow keys still reach it.
     * @default true
     */
    'focusable-when-disabled': 'boolean'
}) {
    protected group: ToolbarGroupElement | undefined;

    private cancelGroupRequest: (() => void) | null = null;

    protected override whenReady(callback: () => void) {
        super.whenReady(() => {
            this.cancelGroupRequest?.();
            this.cancelGroupRequest = requestAncestorContext(this, ToolbarGroupContext, providesContext(ToolbarGroupContext), (group) => {
                this.cancelGroupRequest = null;
                this.group = group;
                callback();
            });
        });
    }

    override disconnectedCallback() {
        this.cancelGroupRequest?.();
        this.cancelGroupRequest = null;
        super.disconnectedCallback();
    }

    protected get itemOptions(): ToolbarItemOptions {
        return {
            disabled: this.disabled ?? false,
            focusableWhenDisabled: this.focusableWhenDisabled ?? true,
            nativeButton: this.target?.localName === 'button',
            group: this.group?.machine ?? null
        };
    }
}
