import { untracked } from '@flippo-software/store';

import { ButtonMachine } from '~@components/button/root/ButtonMachine';
import { createChangeEventDetails } from '~@events/changeEventDetails';
import { REASONS } from '~@events/reasons';
import { OptionsStore } from '~@lib/OptionsStore';
import { getNativeEvent } from '~@packages/floating-ui/utils/event';
import { mergeProps } from '~@props/mergeProps';

import type { Props } from '~@props/mergeProps';

import type { AnyDialogStore } from '../utils/AnyDialogStore';

type ClickLikeEvent = MouseEvent | { nativeEvent: MouseEvent; currentTarget: EventTarget | null };

export type DialogCloseOptions = {
    /**
     * @default false
     */
    disabled?: boolean | undefined;
    /**
     * @default true
     */
    nativeButton?: boolean | undefined;
};

/**
 * State machine of `Dialog.Close`.
 */
export class DialogCloseMachine {
    readonly button: ButtonMachine;

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<DialogCloseOptions>({} as DialogCloseOptions);

    private get options(): DialogCloseOptions {
        return this.optionsStore.state;
    }

    private set options(options: DialogCloseOptions) {
        this.optionsStore.setState(options);
    }

    private readonly store: AnyDialogStore;

    constructor(store: AnyDialogStore, options: DialogCloseOptions = {}) {
        this.store = store;
        this.options = options;
        this.button = new ButtonMachine({ disabled: options.disabled, native: options.nativeButton });
    }

    setOptions(options: DialogCloseOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.button.setOptions({ disabled: options.disabled, native: options.nativeButton });
        });
    }

    setElement = (element: HTMLElement | null) => {
        this.button.setElement(element);
    };

    getState(): { disabled: boolean } {
        return { disabled: this.options.disabled ?? false };
    }

    getCloseProps(elementProps: Props = {}): Props {
        return mergeProps(
            {
                onClick: (event: ClickLikeEvent) => {
                    if (this.store.select('open')) {
                        this.store.setOpen(
                            false,
                            createChangeEventDetails(REASONS.closePress, getNativeEvent(event as MouseEvent)) as never
                        );
                    }
                }
            },
            elementProps,
            (props: Props) => this.button.getButtonProps(props)
        );
    }
}
