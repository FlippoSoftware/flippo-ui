import { untracked } from '@flippo-software/store';

import { getDisabledMountTransitionStyles } from '~@attributes/getDisabledMountTransitionStyles';
import { getStyleHookProps } from '~@attributes/getStyleHookProps';
import { COMPOSITE_KEYS } from '~@components/composite/utils/compositeKeys';
import { OpenChangeComplete } from '~@dom/OpenChangeComplete';
import { PopupAutoResize } from '~@dom/PopupAutoResize';
import { REASONS } from '~@events/reasons';
import { Connectable } from '~@lib/Connectable';
import { EMPTY_OBJECT } from '~@lib/constants';
import { OptionsStore } from '~@lib/OptionsStore';
import { FocusManager } from '~@packages/floating-ui/FocusManager';
import { HoverFloatingInteraction } from '~@packages/floating-ui/interactions/hover/HoverFloatingInteraction';
import { mergeProps } from '~@props/mergeProps';

import type { Align, Interaction, Side, Style, TextDirection, TransitionStatus } from '~@lib/types';
import type { FloatingPortalController } from '~@packages/floating-ui/FloatingPortalController';
import type { FloatingRootStore } from '~@packages/floating-ui/FloatingRootStore';
import type { FloatingTreeStore } from '~@packages/floating-ui/FloatingTreeStore';
import type { FocusManagerOptions, FocusTarget } from '~@packages/floating-ui/FocusManager';
import type { Props } from '~@props/mergeProps';

import type { PopoverPositionerMachine } from '../positioner/PopoverPositionerMachine';
import type { PopoverStore } from '../store/PopoverStore';

import { popoverPopupStateAttributesMapping } from './popoverPopupStateAttributesMapping';

export type PopoverPopupState = {
    open: boolean;
    side: Side;
    align: Align;
    instant: string | undefined;
    transitionStatus: TransitionStatus;
};

export type PopoverPopupOptions = {
    /**
     * Element to focus when the popover opens (defaults to the popup itself when opened by touch).
     */
    initialFocus?: FocusTarget | undefined;
    /**
     * Element to focus when the popover closes.
     */
    finalFocus?: FocusTarget | undefined;
};

export type PopoverPopupSetup = {
    positioner: PopoverPositionerMachine<unknown> | null;
    /**
     * Whether the popover is rendered inside a toolbar (composite keys don't bubble to it).
     * @default false
     */
    insideToolbar?: boolean | undefined;
    /**
     * @default 'ltr'
     */
    direction?: TextDirection | undefined;
    tree?: FloatingTreeStore | null | undefined;
    portal?: FloatingPortalController | null | undefined;
};

/**
 * State machine of `Popover.Popup`: focus management, hover close, auto-resize between triggers
 * and the popup's props.
 */
export class PopoverPopupMachine<Payload = unknown> extends Connectable {
    readonly store: PopoverStore<Payload>;

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<PopoverPopupOptions>({} as PopoverPopupOptions);

    private get options(): PopoverPopupOptions {
        return this.optionsStore.state;
    }

    private set options(options: PopoverPopupOptions) {
        this.optionsStore.setState(options);
    }

    private readonly setup: PopoverPopupSetup;

    private floatingRoot: FloatingRootStore | null = null;

    private focusManagerInstance: FocusManager | null = null;

    private hover: HoverFloatingInteraction | null = null;

    private readonly autoResize: PopupAutoResize;

    private readonly openChangeComplete: OpenChangeComplete;

    constructor(store: PopoverStore<Payload>, setup: PopoverPopupSetup, options: PopoverPopupOptions = {}) {
        super();
        this.store = store;
        this.setup = setup;
        this.options = options;
        this.openChangeComplete = new OpenChangeComplete(store.context.popupRef, () => {
            if (store.select('open')) {
                store.context.onOpenChangeComplete?.(true);
            }
        });
        this.autoResize = new PopupAutoResize(this.getAutoResizeOptions());
    }

    protected override onConnect() {
        this.connectChild(this.autoResize);
        this.addCleanup(this.store.subscribe(() => this.sync()));
        this.sync();
    }

    setOptions(options: PopoverPopupOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
        });
    }

    /**
     * Passes the options to the focus manager and interactions after a commit.
     */
    afterCommit() {
        this.sync();
    }

    /**
     * The focus manager; the adapter renders its focus guards around the popup.
     */
    get focusManager(): FocusManager {
        return this.focusManagerInstance as FocusManager;
    }

    /**
     * Ref callback for the popup element.
     */
    setElement = (element: HTMLElement | null) => {
        this.store.context.popupRef.current = element;
        this.store.set('popupElement', element);
    };

    static attrs(state: PopoverPopupState) {
        return getStyleHookProps(state, popoverPopupStateAttributesMapping);
    }

    getState(): PopoverPopupState {
        const positionerState = this.setup.positioner?.getState();
        return {
            open: this.store.select('open'),
            side: positionerState?.side ?? 'bottom',
            align: positionerState?.align ?? 'center',
            instant: this.store.select('instantType'),
            transitionStatus: this.store.select('transitionStatus')
        };
    }

    getPopupProps(elementProps: Props = {}): Props {
        const { store } = this;
        return mergeProps(
            store.select('popupProps'),
            {
                'aria-labelledby': store.select('titleElementId'),
                'aria-describedby': store.select('descriptionElementId'),
                style: this.getAnchoringStyles(),
                onKeyDown: (event: KeyboardEvent) => {
                    if (this.setup.insideToolbar && COMPOSITE_KEYS.has(event.key)) {
                        event.stopPropagation();
                    }
                }
            },
            getDisabledMountTransitionStyles(store.select('transitionStatus')),
            elementProps
        );
    }

    protected override onDisconnect() {
        this.destroyInteractions();
        this.openChangeComplete.destroy();
    }

    /**
     * Ensures popup size transitions correctly when anchored to `bottom` (side=top) or `right` (side=left).
     * Only while the popup auto-resizes (several triggers): the auto-resize gives the positioner the size of the
     * popup (`--positioner-width`/`--positioner-height`). Otherwise an absolute popup leaves the positioner without a
     * size, and it is placed and flipped as an empty box.
     */
    private getAnchoringStyles(): Style {
        if (this.store.context.triggerElements.size <= 1) {
            return EMPTY_OBJECT as Style;
        }
        const side = this.setup.positioner?.getState().side ?? 'bottom';
        const isRtl = this.setup.direction === 'rtl';
        const isInlineSide = side === (isRtl ? 'inline-end' : 'inline-start');
        const isOriginSide = side === 'top' || isInlineSide;
        const isPhysicalLeft = side === 'left' || isInlineSide;

        return isOriginSide
            ? {
                  position: 'absolute',
                  [side === 'top' ? 'bottom' : 'top']: '0',
                  [isPhysicalLeft ? 'right' : 'left']: '0'
              }
            : (EMPTY_OBJECT as Style);
    }

    private getFocusManagerOptions(): FocusManagerOptions {
        const { store, setup } = this;
        const activeTriggerElement = store.select('activeTriggerElement');
        const { initialFocus, finalFocus } = this.options;

        // If opened by touch, focus the popup element to prevent the virtual keyboard from opening
        // (this is required for Android specifically as iOS handles this automatically).
        const defaultInitialFocus = (interactionType: Interaction) => (interactionType === 'touch' ? store.context.popupRef.current : true);

        return {
            openInteractionType: store.select('openMethod'),
            modal: store.select('modal') === 'trap-focus',
            disabled: !store.select('mounted') || store.select('openChangeReason') === REASONS.triggerHover,
            initialFocus: initialFocus === undefined ? defaultInitialFocus : initialFocus,
            returnFocus: finalFocus,
            restoreFocus: 'popup',
            previousFocusableElement: activeTriggerElement instanceof HTMLElement ? activeTriggerElement : undefined,
            nextFocusableElement: store.context.triggerFocusTargetRef,
            beforeContentFocusGuardRef: store.context.beforeContentFocusGuardRef,
            tree: setup.tree,
            portal: setup.portal
        };
    }

    private getHoverOptions() {
        return {
            enabled: this.store.select('openOnHover') && !this.store.select('disabled'),
            closeDelay: this.store.select('closeDelay'),
            tree: this.setup.tree
        };
    }

    private getAutoResizeOptions() {
        const { store } = this;
        return {
            popupElement: store.select('popupElement'),
            positionerElement: store.select('positionerElement'),
            mounted: store.select('mounted'),
            content: store.select('payload'),
            // If there's just one trigger, we can skip the auto-resize logic as
            // the popover will always be anchored to the same position.
            enabled: () => store.context.triggerElements.size > 1,
            onMeasureLayout: () => {
                this.floatingRoot?.context.events.emit('measure-layout');
            },
            onMeasureLayoutComplete: (previousDimensions: unknown, nextDimensions: unknown) => {
                this.floatingRoot?.context.events.emit('measure-layout-complete', { previousDimensions, nextDimensions });
            }
        };
    }

    private sync() {
        if (!this.connected) {
            return;
        }
        const floatingRoot = this.store.select('floatingRootContext');

        if (floatingRoot !== this.floatingRoot) {
            this.destroyInteractions();
            this.floatingRoot = floatingRoot;
            this.focusManagerInstance = new FocusManager(floatingRoot, this.getFocusManagerOptions());
            this.hover = new HoverFloatingInteraction(floatingRoot, this.getHoverOptions());
            this.focusManagerInstance.connect();
            this.hover.connect();
        } else {
            this.focusManagerInstance?.setOptions(this.getFocusManagerOptions());
            this.hover?.setOptions(this.getHoverOptions());
        }

        this.autoResize.setOptions(this.getAutoResizeOptions());
        this.openChangeComplete.sync(this.store.select('open'));
    }

    private destroyInteractions() {
        this.focusManagerInstance?.destroy();
        this.hover?.destroy();
        this.focusManagerInstance = null;
        this.hover = null;
        this.floatingRoot = null;
    }
}
