import { untracked } from '@flippo-software/store';

import { getStyleHookProps } from '~@attributes/getStyleHookProps';
import { COMPOSITE_KEYS } from '~@components/composite/utils/compositeKeys';
import { OpenChangeComplete } from '~@dom/OpenChangeComplete';
import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';
import { FocusManager } from '~@packages/floating-ui/FocusManager';
import { mergeProps } from '~@props/mergeProps';

import type { Interaction, Style, TransitionStatus } from '~@lib/types';
import type { FloatingPortalController } from '~@packages/floating-ui/FloatingPortalController';
import type { FloatingRootStore } from '~@packages/floating-ui/FloatingRootStore';
import type { FloatingTreeStore } from '~@packages/floating-ui/FloatingTreeStore';
import type { FocusManagerOptions, FocusTarget } from '~@packages/floating-ui/FocusManager';
import type { Props } from '~@props/mergeProps';

import { getDialogState } from '../utils/getDialogState';

import type { DialogStore } from '../store/DialogStore';
import type { AnyDialogStore } from '../utils/AnyDialogStore';

import { DialogPopupCssVars } from './DialogPopupCssVars';
import { dialogPopupStateAttributesMapping } from './dialogPopupStateAttributesMapping';

export type DialogPopupState = {
    open: boolean;
    transitionStatus: TransitionStatus;
    nested: boolean;
    nestedDialogOpen: boolean;
};

export type DialogPopupOptions = {
    initialFocus?: FocusTarget | undefined;
    finalFocus?: FocusTarget | undefined;
};

export type DialogPopupSetup = {
    tree?: FloatingTreeStore | null | undefined;
    portal?: FloatingPortalController | null | undefined;
};

/**
 * State machine of `Dialog.Popup`: focus management (trap for modal dialogs) and the popup's props.
 */
export class DialogPopupMachine<Payload = unknown> extends Connectable {
    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<DialogPopupOptions>({} as DialogPopupOptions);

    private get options(): DialogPopupOptions {
        return this.optionsStore.state;
    }

    private set options(options: DialogPopupOptions) {
        this.optionsStore.setState(options);
    }

    private readonly store: DialogStore<Payload>;

    private readonly setup: DialogPopupSetup;

    private floatingRoot: FloatingRootStore | null = null;

    private focusManagerInstance: FocusManager | null = null;

    private readonly openChangeComplete: OpenChangeComplete;

    constructor(store: DialogStore<Payload>, options: DialogPopupOptions = {}, setup: DialogPopupSetup = {}) {
        super();
        this.store = store;
        this.options = options;
        this.setup = setup;
        this.openChangeComplete = new OpenChangeComplete(store.context.popupRef, () => {
            if (store.select('open')) {
                store.context.onOpenChangeComplete?.(true);
            }
        });
    }

    protected override onConnect() {
        this.addCleanup(this.store.subscribe(() => this.sync()));
        this.sync();
    }

    setOptions(options: DialogPopupOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
        });
    }

    /**
     * Passes the options to the focus manager after a commit.
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

    setElement = (element: HTMLElement | null) => {
        this.store.context.popupRef.current = element;
        this.store.set('popupElement', element);
    };

    static attrs(state: DialogPopupState) {
        return getStyleHookProps(state, dialogPopupStateAttributesMapping);
    }

    getState(): DialogPopupState {
        return getDialogState(this.store as AnyDialogStore);
    }

    getPopupProps(elementProps: Props = {}): Props {
        const { store } = this;
        return mergeProps(
            store.select('popupProps'),
            {
                'aria-labelledby': store.select('titleElementId') ?? undefined,
                'aria-describedby': store.select('descriptionElementId') ?? undefined,
                role: store.select('role'),
                tabIndex: -1,
                hidden: !store.select('mounted'),
                onKeyDown: (event: KeyboardEvent) => {
                    if (COMPOSITE_KEYS.has(event.key)) {
                        event.stopPropagation();
                    }
                },
                style: { [DialogPopupCssVars.nestedDialogs]: store.select('nestedOpenDialogCount') } as Style
            },
            elementProps
        );
    }

    protected override onDisconnect() {
        this.focusManagerInstance?.destroy();
        this.focusManagerInstance = null;
        this.floatingRoot = null;
        this.openChangeComplete.destroy();
    }

    private getFocusManagerOptions(): FocusManagerOptions {
        const { store } = this;
        const { initialFocus, finalFocus } = this.options;

        // If opened by touch, focus the popup element to prevent the virtual keyboard from opening
        // (this is required for Android specifically as iOS handles this automatically).
        const defaultInitialFocus = (interactionType: Interaction) => (interactionType === 'touch' ? store.context.popupRef.current : true);

        return {
            openInteractionType: store.select('openMethod'),
            disabled: !store.select('mounted'),
            closeOnFocusOut: !store.select('disablePointerDismissal'),
            initialFocus: initialFocus === undefined ? defaultInitialFocus : initialFocus,
            returnFocus: finalFocus,
            modal: store.select('modal') !== false,
            restoreFocus: 'popup',
            tree: this.setup.tree,
            portal: this.setup.portal
        };
    }

    private sync() {
        if (!this.connected) {
            return;
        }
        const floatingRoot = this.store.select('floatingRootContext');
        if (floatingRoot !== this.floatingRoot) {
            this.focusManagerInstance?.destroy();
            this.floatingRoot = floatingRoot;
            this.focusManagerInstance = new FocusManager(floatingRoot, this.getFocusManagerOptions());
            this.focusManagerInstance.connect();
        } else {
            this.focusManagerInstance?.setOptions(this.getFocusManagerOptions());
        }
        this.openChangeComplete.sync(this.store.select('open'));
    }
}
