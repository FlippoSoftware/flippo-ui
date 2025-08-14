'use client';
import * as React from 'react';

import { useFocusableWhenDisabled } from '@lib/hooks';

import type { HeadlessUIComponentProps, HTMLProps } from '@lib/types';

import { ARROW_LEFT, ARROW_RIGHT, stopEvent } from '../../Composite/composite';
import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useToolbarGroupContext } from '../group/ToolbarGroupContext';
import { useToolbarRootContext } from '../root/ToolbarRootContext';

import type { ToolbarRoot } from '../root/ToolbarRoot';

/**
 * A native input element that integrates with Toolbar keyboard navigation.
 * Renders an `<input>` element.
 *
 * Documentation: [Base UI Toolbar](https://base-ui.com/react/components/toolbar)
 */
export function ToolbarInput(componentProps: ToolbarInput.Props) {
    const {
        className,
        focusableWhenDisabled = true,
        render,
        disabled: disabledProp = false,
        ref,
        ...elementProps
    } = componentProps;

    const itemMetadata = React.useMemo(() => ({ focusableWhenDisabled }), [focusableWhenDisabled]);

    const { disabled: toolbarDisabled, orientation } = useToolbarRootContext();

    const groupContext = useToolbarGroupContext(true);

    const disabled = toolbarDisabled || (groupContext?.disabled ?? false) || disabledProp;

    const { props: focusableWhenDisabledProps } = useFocusableWhenDisabled({
        composite: true,
        disabled,
        focusableWhenDisabled,
        isNativeButton: false
    });

    const state: ToolbarInput.State = React.useMemo(
        () => ({
            disabled,
            orientation,
            focusable: focusableWhenDisabled
        }),
        [disabled, focusableWhenDisabled, orientation]
    );

    const defaultProps: HTMLProps = {
        onClick(event) {
            if (disabled) {
                event.preventDefault();
            }
        },
        onKeyDown(event) {
            if (event.key !== ARROW_LEFT && event.key !== ARROW_RIGHT && disabled) {
                stopEvent(event);
            }
        },
        onPointerDown(event) {
            if (disabled) {
                event.preventDefault();
            }
        }
    };

    return (
        <CompositeItem
            tag={'input'}
            render={render}
            className={className}
            metadata={itemMetadata}
            state={state}
            refs={[ref]}
            props={[defaultProps, elementProps, focusableWhenDisabledProps]}
        />
    );
}

export namespace ToolbarInput {
    export type State = {
        disabled: boolean;
        focusable: boolean;
    } & ToolbarRoot.State;

    export type Props = {
        /**
         * When `true` the item is disabled.
         * @default false
         */
        disabled?: boolean;
        /**
         * When `true` the item remains focuseable when disabled.
         * @default true
         */
        focusableWhenDisabled?: boolean;
        defaultValue?: React.ComponentProps<'input'>['defaultValue'];
    } & HeadlessUIComponentProps<'input', ToolbarRoot.State>;
}
