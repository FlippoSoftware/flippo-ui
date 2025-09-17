import React from 'react';

import { Input as InputHeadless } from '@flippo-ui/headless-components/input';
import { useButton } from '@flippo-ui/headless-components/use-button';
import { useRender } from '@flippo-ui/headless-components/use-render';
import { XmarkIcon } from '@flippo-ui/icons';

import styles from './InputClear.module.scss';

export function InputClear(props: InputClear.Props) {
    const {
        ref,
        disabled,
        onClick: onClickProp,
        ...otherProps
    } = props;

    const { value, state, setValue } = InputHeadless.useInputControl();

    const onClick = React.useCallback<NonNullable<InputClear.Props['onClick']>>((event) => {
        setValue('', event as unknown as Event);

        onClickProp?.(event);
    }, [onClickProp, setValue]);

    const { getButtonProps, buttonRef } = useButton({
        native: true,
        disabled: disabled ?? false
    });

    const element = useRender({
        defaultTagName: 'button',
        ref: [buttonRef, ref],
        state: { ...state, 'input-clear': true },
        props: [getButtonProps(otherProps), {
            className: styles.InputClear,
            children: <XmarkIcon />,
            onClick
        }]
    });

    if (!value)
        return null;

    return element;
}

export namespace InputClear {
    export type Props = React.ComponentPropsWithRef<'button'>;
}
