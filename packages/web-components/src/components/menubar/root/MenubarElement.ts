import { MenubarMachine } from '@flippo-software/core-components/menubar';
import { mergeProps } from '@flippo-software/core-components/props';

import type { MenubarOptions } from '@flippo-software/core-components/menubar';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement } from '../../../lib/MachineElement';

import { MenubarContext } from './MenubarRootContext';

/**
 * A bar of menus, like the one of a desktop app: the arrow keys move between their triggers, and once one menu is
 * open, hovering another trigger opens its menu. Put `<prefix>-menu` elements in it.
 *
 * Attributes: `orientation` (`horizontal` by default, `vertical`), `loop-focus` (`"false"` stops at the ends),
 * `modal` (`"false"` leaves the page usable while a menu is open), `disabled`.
 * State attributes: `data-orientation`, `data-modal`, `data-has-submenu-open`.
 */
export class MenubarElement extends MachineElement.withAttributes({
    /**
     * The orientation of the menubar.
     * @default 'horizontal'
     */
    orientation: ['horizontal', 'vertical'],
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    'loop-focus': 'boolean',
    /**
     * Whether the menubar is modal.
     * @default true
     */
    modal: 'boolean',
    /**
     * Whether the whole menubar is disabled.
     * @default false
     */
    disabled: 'boolean'
}) {
    private menubar!: MenubarMachine;

    private readonly generatedId = createId('menubar');

    constructor() {
        super();
        declareProvider(this, MenubarContext);
    }

    get machine(): MenubarMachine {
        return this.menubar;
    }

    protected override createParts() {
        this.menubar = new MenubarMachine(this.getOptions(), {
            id: this.targetId(this.generatedId),
            nodeId: createId('menubar-node'),
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'
        });
    }

    protected override applyOptions() {
        this.menubar.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.menubar.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.menubar.connect();
        const stopProviding = provideContext(this, MenubarContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.menubar?.setElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.menubar.getMenubarProps(), MenubarMachine.attrs(this.menubar.getState()));
    }

    private getOptions(): MenubarOptions {
        return {
            orientation: this.orientation ?? 'horizontal',
            loopFocus: this.loopFocus ?? true,
            modal: this.modal ?? true,
            disabled: this.disabled ?? false
        };
    }
}
