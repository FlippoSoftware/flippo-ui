import { getStyleHookProps } from '~@attributes/getStyleHookProps';
import { popupStateMapping } from '~@attributes/popupStateMapping';
import { getInternalBackdropProps } from '~@dom/internalBackdrop';
import { acquireScrollLock } from '~@dom/scrollLock';
import { Connectable } from '~@lib/Connectable';
import { DROPDOWN_COLLISION_AVOIDANCE } from '~@lib/constants';
import { Effect } from '~@packages/floating-ui/utils/Effect';
import { AnchorPositioner } from '~@positioning/AnchorPositioner';
import { mergeProps } from '~@props/mergeProps';

import type { Align, Side, Style } from '~@lib/types';
import type { AnchorPositioningSharedOptions } from '~@positioning/AnchorPositioner';
import type { Props } from '~@props/mergeProps';

import type { ComboboxRootMachine } from '../root/ComboboxRootMachine';

export type ComboboxPositionerState = {
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    empty: boolean;
};

/**
 * State machine of `Combobox.Positioner`: anchored to the input (or the trigger when the input is in the popup).
 */
export class ComboboxPositionerMachine extends Connectable {
    readonly positioner: AnchorPositioner;

    private options: AnchorPositioningSharedOptions & { keepMounted?: boolean | undefined };

    private readonly root: ComboboxRootMachine;

    private readonly scrollLock = new Effect(() => {
        const { open, modal, openMethod, triggerElement } = this.root.store.state;
        if (!(open && modal && openMethod !== 'touch')) {
            return;
        }
        return acquireScrollLock(triggerElement);
    });

    constructor(root: ComboboxRootMachine, options: AnchorPositioningSharedOptions & { keepMounted?: boolean | undefined } = {}) {
        super();
        this.root = root;
        this.options = options;
        this.positioner = new AnchorPositioner(root.floatingRoot, this.getAnchorOptions());
    }

    protected override onConnect() {
        this.connectChild(this.positioner);
        this.addCleanup(this.root.store.subscribe(() => this.sync()));
        this.addCleanup(this.positioner.store.subscribe(() => this.syncSide()));
        this.sync();
    }

    setOptions(options: AnchorPositioningSharedOptions & { keepMounted?: boolean | undefined }) {
        this.options = options;
        this.sync();
    }

    setElement = (element: HTMLElement | null) => {
        this.root.store.set('positionerElement', element);
    };

    getState(): ComboboxPositionerState {
        const state = this.positioner.store.state;
        return {
            open: this.root.store.state.open,
            side: this.positioner.side(state),
            align: AnchorPositioner.align(state),
            anchorHidden: AnchorPositioner.anchorHidden(state),
            empty: this.root.derived.state.filteredItems.length === 0
        };
    }

    static attrs(state: ComboboxPositionerState) {
        return getStyleHookProps(state, popupStateMapping);
    }

    getPositionerProps(elementProps: Props = {}): Props {
        const { open, mounted } = this.root.store.state;
        const style: Style = { ...this.positioner.positionerStyles() };
        if (!open) {
            style.pointerEvents = 'none';
        }
        return mergeProps({ role: 'presentation', hidden: !mounted, style }, elementProps);
    }

    getArrowStyles(): Style {
        return AnchorPositioner.arrowStyles(this.positioner.store.state);
    }

    shouldRenderInternalBackdrop(): boolean {
        const { mounted, modal } = this.root.store.state;
        return mounted && modal;
    }

    getInternalBackdropProps() {
        const { open, inputElement, triggerElement } = this.root.store.state;
        return getInternalBackdropProps(inputElement ?? triggerElement, !open);
    }

    protected override onDisconnect() {}

    private getAnchorOptions() {
        const { store } = this.root;
        const { inputInsidePopup, triggerElement, inputElement, mounted } = store.state;
        return {
            ...this.options,
            anchor: this.options.anchor ?? (inputInsidePopup ? triggerElement : inputElement),
            mounted,
            collisionAvoidance: this.options.collisionAvoidance ?? DROPDOWN_COLLISION_AVOIDANCE,
            lazyFlip: true
        };
    }

    private sync() {
        if (!this.connected) {
            return;
        }
        const { open, modal, openMethod, triggerElement } = this.root.store.state;
        this.positioner.setOptions(this.getAnchorOptions());
        this.scrollLock.sync([open, modal, openMethod, triggerElement]);
        this.syncSide();
    }

    private syncSide() {
        this.root.store.set('popupSide', this.positioner.side());
    }
}
