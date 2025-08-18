'use client';

import React from 'react';

import { triggerOpenStateMapping } from '@lib/collapsibleOpenStateMapping';
import { useRenderElement } from '@lib/hooks';
import { transitionStatusMapping } from '@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '@lib/types';

import { useButton } from '../../use-button';
import { useCollapsibleRootContext } from '../root/CollapsibleRootContext';

import type { CollapsibleRoot } from '../root/CollapsibleRoot';

const styleHookMapping: CustomStyleHookMapping<CollapsibleRoot.State> = {
    ...triggerOpenStateMapping,
    ...transitionStatusMapping
};

/**
 * A button that opens and closes the collapsible panel.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Collapsible](https://base-ui.com/react/components/collapsible)
 */
export function CollapsibleTrigger(componentProps: CollapsibleTrigger.Props) {
    const {
        panelId,
        open,
        handleTrigger,
        state,
        disabled: contextDisabled
    } = useCollapsibleRootContext();

    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        id,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = contextDisabled,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        focusableWhenDisabled: true,
        native: nativeButton
    });

    const props = React.useMemo(
        () => ({
            'aria-controls': open ? panelId : undefined,
            'aria-expanded': open,
            disabled,
            'onClick': handleTrigger
        }),
        [
            panelId,
            disabled,
            open,
            handleTrigger
        ]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef],
        props: [props, elementProps, getButtonProps],
        customStyleHookMapping: styleHookMapping
    });

    return element;
}

export namespace CollapsibleTrigger {
    export type Props = NativeButtonProps & HeadlessUIComponentProps<'button', CollapsibleRoot.State>;
}
