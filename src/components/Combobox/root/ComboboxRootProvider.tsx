import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import type { ComboboxRootMachine } from '@flippo-software/core-components/combobox';

import { toReactProps, useStoreState, useTracker } from '~@lib/core';

import {
    ComboboxDerivedItemsContext,
    ComboboxInputValueContext,
    ComboboxRootContext,
    ComboboxRootMachineContext
} from './ComboboxRootContext';

/**
 * Provides a combobox root machine to the parts (`Combobox.Root`, `Autocomplete.Root`) and renders the hidden
 * inputs carrying its value.
 */
export function ComboboxRootProvider(props: ComboboxRootProvider.Props) {
    const { root, actionsRef, inputRef, children } = props;

    useIsoLayoutEffect(() => root.register(), [root]);
    React.useImperativeHandle(actionsRef, () => root.actions, [root]);
    React.useImperativeHandle(inputRef, () => root.store.state.inputRef.current as HTMLInputElement, [root]);
    const track = useTracker();

    const derived = useStoreState(root.derived);
    const { inputValue } = useStoreState(root.inputValue);

    return (
        <ComboboxRootMachineContext value={root}>
            <ComboboxRootContext value={root.store}>
                <ComboboxDerivedItemsContext value={derived}>
                    <ComboboxInputValueContext value={inputValue}>
                        {children}
                        <input {...track(() => toReactProps(root.getHiddenInputProps()))} ref={root.setHiddenInputElement} />
                        {track(() => root.getHiddenInputs()).map((input) => (
                            <input key={input.value} type='hidden' name={input.name} value={input.value} />
                        ))}
                    </ComboboxInputValueContext>
                </ComboboxDerivedItemsContext>
            </ComboboxRootContext>
        </ComboboxRootMachineContext>
    );
}

export namespace ComboboxRootProvider {
    export type Props = {
        root: ComboboxRootMachine;
        actionsRef?: React.Ref<{ unmount: () => void }> | undefined;
        inputRef?: React.Ref<HTMLInputElement> | undefined;
        children?: React.ReactNode;
    };
}
