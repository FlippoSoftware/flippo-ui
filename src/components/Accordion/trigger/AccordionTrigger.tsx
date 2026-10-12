import { ButtonMachine } from '@flippo-software/core-components/button';

import { triggerOpenStateMapping } from '~@lib/collapsibleOpenStateMapping';
import { toReactProps, useMachine, useSyncDuringRender } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useAccordionItemContext } from '../item/AccordionItemContext';

import type { AccordionItem } from '../item/AccordionItem';

/**
 * A button that opens and closes the corresponding panel.
 * Renders a `<button>` element.
 */
export function AccordionTrigger(componentProps: AccordionTriggerProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled: disabledProp,
        id: idProp,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const { item, state, defaultTriggerId } = useAccordionItemContext();

    // The panel is labelled by the trigger.
    useSyncDuringRender(() => item.setTriggerId(idProp ?? defaultTriggerId));

    const disabled = disabledProp ?? item.collapsible.disabled;
    const button = useMachine((options) => new ButtonMachine(options), {
        disabled,
        focusableWhenDisabled: true,
        native: nativeButton
    });

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, button.setElement],
        props: [elementProps, (props) => toReactProps(item.getTriggerProps(button, props, disabledProp))],
        customStyleHookMapping: triggerOpenStateMapping
    });
}

export type AccordionTriggerProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', AccordionItem.State>;

export namespace AccordionTrigger {
    export type Props = AccordionTriggerProps;
}
