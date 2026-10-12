import { ButtonMachine } from '@flippo-software/core-components/button';

import { triggerOpenStateMapping } from '~@lib/collapsibleOpenStateMapping';
import { toReactProps, useMachine } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useCollapsibleRootContext } from '../root/CollapsibleRootContext';

import type { CollapsibleRoot } from '../root/CollapsibleRoot';

const styleHookMapping: StateAttributesMapping<CollapsibleRoot.State> = {
    ...triggerOpenStateMapping,
    ...transitionStatusMapping
};

/**
 * A button that opens and closes the collapsible panel.
 * Renders a `<button>` element.
 */
export function CollapsibleTrigger(componentProps: CollapsibleTriggerProps) {
    const { collapsible, state } = useCollapsibleRootContext();

    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        id,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = state.disabled,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const button = useMachine((options) => new ButtonMachine(options), {
        disabled,
        focusableWhenDisabled: true,
        native: nativeButton
    });

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, button.setElement],
        props: [elementProps, (props) => toReactProps(collapsible.getTriggerProps(button, props, disabled))],
        customStyleHookMapping: styleHookMapping
    });
}

export type CollapsibleTriggerProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', CollapsibleRoot.State>;

export namespace CollapsibleTrigger {
    export type Props = CollapsibleTriggerProps;
}
