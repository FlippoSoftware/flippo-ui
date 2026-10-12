import React from 'react';

import { ButtonMachine } from '@flippo-software/core-components/button';

import { toReactProps, useMachine } from '~@lib/core';

import { useCompositeRootContext } from '../Composite/root/CompositeRootContext';

/**
 * Props and a ref that make an element behave as a button (core `ButtonMachine`).
 */
export function useButton(parameters: useButton.Parameters = {}): useButton.ReturnValue {
    const { disabled = false, focusableWhenDisabled, tabIndex = 0, native = true } = parameters;

    const composite = useCompositeRootContext(true) !== undefined;

    const button = useMachine((options) => new ButtonMachine(options), {
        disabled,
        focusableWhenDisabled,
        tabIndex,
        native,
        composite
    });

    // An object ref (the public API) that passes the element to the machine.
    const buttonRef = React.useMemo(() => {
        let element: HTMLElement | null = null;
        return {
            get current() {
                return element;
            },
            set current(next: HTMLElement | null) {
                element = next;
                button.setElement(next);
            }
        };
    }, [button]);

    const getButtonProps = React.useCallback(
        (externalProps: React.ComponentPropsWithRef<any> = {}) => toReactProps(button.getButtonProps(externalProps)),
        [button]
    );

    return { getButtonProps, buttonRef };
}

export namespace useButton {
    export type Parameters = {
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;
        /**
         * Whether the button may receive focus even if it is disabled.
         * @default false
         */
        focusableWhenDisabled?: boolean;
        tabIndex?: NonNullable<React.HTMLAttributes<any>['tabIndex']>;
        /**
         * Whether the component is being rendered as a native button.
         * @default true
         */
        native?: boolean;
    };

    export type ReturnValue = {
        /**
         * Resolver for the button props.
         * @param externalProps additional props for the button
         * @returns props that should be spread on the button
         */
        getButtonProps: (externalProps?: React.ComponentPropsWithRef<any>) => React.ComponentPropsWithRef<any>;
        /**
         * A ref to the button DOM element. This ref should be passed to the rendered element.
         * It is not a part of the props returned by `getButtonProps`.
         */
        buttonRef: React.RefObject<HTMLElement | null>;
    };
}
