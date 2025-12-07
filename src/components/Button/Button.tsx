import React from 'react';

import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps, NativeButtonProps, NonNativeButtonProps } from '~@lib/types';

import { useButton } from '../use-button/useButton';

/**
 * A button component that can be used to trigger actions.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Button](https://base-ui.com/react/components/button)
 */
export function Button(componentProps: Button.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled: disabledProp = false,
        focusableWhenDisabled = false,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const disabled = Boolean(disabledProp);

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        focusableWhenDisabled,
        native: nativeButton
    });

    const state: Button.State = React.useMemo(
        () => ({
            disabled
        }),
        [disabled]
    );

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef],
        props: [elementProps, getButtonProps]
    });
}

export namespace Button {
    export type State = {
        /**
         * Whether the button should ignore user interaction.
         */
        disabled: boolean;
    };

    type ButtonCommonProps = {
        /**
         * Whether the button should ignore user interaction.
         */
        disabled?: boolean;
        /**
         * Whether the button should be focusable when disabled.
         * @default false
         */
        focusableWhenDisabled?: boolean;
    };

    type NonNativeAttributeKeys
        = | 'form'
          | 'formAction'
          | 'formEncType'
          | 'formMethod'
          | 'formNoValidate'
          | 'formTarget'
          | 'name'
          | 'type'
          | 'value';

    type ButtonNativeProps = {
        nativeButton?: true;
    } & NativeButtonProps & ButtonCommonProps & Omit<HeadlessUIComponentProps<'button', State>, 'disabled'>;

    type ButtonNonNativeProps = {
        nativeButton: false;
    } & NonNativeButtonProps & ButtonCommonProps & Omit<HeadlessUIComponentProps<'button', State>, NonNativeAttributeKeys | 'disabled'>;

    export type Props = ButtonNativeProps | ButtonNonNativeProps;
}
