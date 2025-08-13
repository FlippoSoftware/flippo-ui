'use client';

import * as React from 'react';

export function useFocusableWhenDisabled(
    parameters: NUseFocusableWhenDisabled.Parameters
): NUseFocusableWhenDisabled.ReturnValue {
    const {
        focusableWhenDisabled,
        disabled,
        composite = false,
        tabIndex: tabIndexProp = 0,
        isNativeButton
    } = parameters;

    const isFocusableComposite = composite && focusableWhenDisabled !== false;
    const isNonFocusableComposite = composite && focusableWhenDisabled === false;

    // we can't explicitly assign `undefined` to any of these props because it
    // would otherwise prevent subsequently merged props from setting them
    const props = React.useMemo(() => {
        const additionalProps = {
            // allow Tabbing away from focusableWhenDisabled elements
            onKeyDown(event: React.KeyboardEvent) {
                if (disabled && focusableWhenDisabled && event.key !== 'Tab') {
                    event.preventDefault();
                }
            }
        } as NUseFocusableWhenDisabled.FocusableWhenDisabledProps;

        if (!composite) {
            additionalProps.tabIndex = tabIndexProp;

            if (!isNativeButton && disabled) {
                additionalProps.tabIndex = focusableWhenDisabled ? tabIndexProp : -1;
            }
        }

        if (
            (isNativeButton && (focusableWhenDisabled || isFocusableComposite))
            || (!isNativeButton && disabled)
        ) {
            additionalProps['aria-disabled'] = disabled;
        }

        if (isNativeButton && (!focusableWhenDisabled || isNonFocusableComposite)) {
            additionalProps.disabled = disabled;
        }

        return additionalProps;
    }, [
        composite,
        disabled,
        focusableWhenDisabled,
        isFocusableComposite,
        isNonFocusableComposite,
        isNativeButton,
        tabIndexProp
    ]);

    return { props };
}

export namespace NUseFocusableWhenDisabled {
    export type FocusableWhenDisabledProps = {
        'aria-disabled'?: boolean;
        'disabled'?: boolean;
        'onKeyDown': (event: React.KeyboardEvent) => void;
        'tabIndex': number;
    };

    export type Parameters = {
        focusableWhenDisabled?: boolean | undefined;
        disabled: boolean;
        composite?: boolean;
        tabIndex?: number;
        isNativeButton: boolean;
    };

    export type ReturnValue = {
        props: FocusableWhenDisabledProps;
    };
}
