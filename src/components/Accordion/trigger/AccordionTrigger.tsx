import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';
import { triggerOpenStateMapping } from '~@lib/collapsibleOpenStateMapping';
import { useRenderElement } from '~@lib/hooks';
import { isElementDisabled } from '~@lib/isElementDisabled';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useCollapsibleRootContext } from '../../Collapsible/root/CollapsibleRootContext';
import {
    ARROW_DOWN,
    ARROW_LEFT,
    ARROW_RIGHT,
    ARROW_UP,
    END,
    HOME,
    stopEvent
} from '../../Composite/composite';
import { useButton } from '../../use-button';
import { useAccordionItemContext } from '../item/AccordionItemContext';
import { useAccordionRootContext } from '../root/AccordionRootContext';

import type { AccordionItem } from '../item/AccordionItem';

const SUPPORTED_KEYS = new Set([
    ARROW_DOWN,
    ARROW_UP,
    ARROW_RIGHT,
    ARROW_LEFT,
    HOME,
    END
]);

function getActiveTriggers(accordionItemRefs: {
    current: (HTMLElement | null)[];
}): HTMLButtonElement[] {
    const { current: accordionItemElements } = accordionItemRefs;

    const output: HTMLButtonElement[] = [];

    for (let i = 0; i < accordionItemElements.length; i += 1) {
        const section = accordionItemElements[i];
        if (!isElementDisabled(section)) {
            const trigger = section?.querySelector('[type="button"]') as HTMLButtonElement;
            if (!isElementDisabled(trigger)) {
                output.push(trigger);
            }
        }
    }

    return output;
}

/**
 * A button that opens and closes the corresponding panel.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */

export function AccordionTrigger(componentProps: AccordionTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled: disabledProp,
        id: idProp,
        nativeButton,
        ref,
        ...elementProps
    } = componentProps;

    const {
        panelId,
        open,
        handleTrigger,
        disabled: contextDisabled
    } = useCollapsibleRootContext();

    const disabled = disabledProp ?? contextDisabled;

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        focusableWhenDisabled: true,
        native: nativeButton
    });

    const {
        accordionItemRefs,
        direction,
        loop,
        orientation
    } = useAccordionRootContext();

    const isRtl = direction === 'rtl';
    const isHorizontal = orientation === 'horizontal';

    const { state, setTriggerId, triggerId: id } = useAccordionItemContext();

    useIsoLayoutEffect(() => {
        if (idProp) {
            setTriggerId(idProp);
        }
        return () => {
            setTriggerId(undefined);
        };
    }, [idProp, setTriggerId]);

    const props = React.useMemo(
        () => ({
            'aria-controls': open ? panelId : undefined,
            'aria-expanded': open,
            disabled,
            id,
            'onClick': handleTrigger,
            onKeyDown(event: React.KeyboardEvent) {
                if (!SUPPORTED_KEYS.has(event.key)) {
                    return;
                }

                stopEvent(event);

                const triggers = getActiveTriggers(accordionItemRefs);

                const numOfEnabledTriggers = triggers.length;
                const lastIndex = numOfEnabledTriggers - 1;

                let nextIndex = -1;

                const thisIndex = triggers.indexOf(event.target as HTMLButtonElement);

                function toNext() {
                    if (loop) {
                        nextIndex = thisIndex + 1 > lastIndex ? 0 : thisIndex + 1;
                    }
                    else {
                        nextIndex = Math.min(thisIndex + 1, lastIndex);
                    }
                }

                function toPrev() {
                    if (loop) {
                        nextIndex = thisIndex === 0 ? lastIndex : thisIndex - 1;
                    }
                    else {
                        nextIndex = thisIndex - 1;
                    }
                }

                switch (event.key) {
                    case ARROW_DOWN:
                        if (!isHorizontal) {
                            toNext();
                        }
                        break;
                    case ARROW_UP:
                        if (!isHorizontal) {
                            toPrev();
                        }
                        break;
                    case ARROW_RIGHT:
                        if (isHorizontal) {
                            if (isRtl) {
                                toPrev();
                            }
                            else {
                                toNext();
                            }
                        }
                        break;
                    case ARROW_LEFT:
                        if (isHorizontal) {
                            if (isRtl) {
                                toNext();
                            }
                            else {
                                toPrev();
                            }
                        }
                        break;
                    case 'Home':
                        nextIndex = 0;
                        break;
                    case 'End':
                        nextIndex = lastIndex;
                        break;
                    default:
                        break;
                }

                if (nextIndex > -1) {
                    triggers[nextIndex]?.focus();
                }
            }
        }),
        [
            accordionItemRefs,
            disabled,
            handleTrigger,
            id,
            isHorizontal,
            isRtl,
            loop,
            open,
            panelId
        ]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef],
        props: [props, elementProps, getButtonProps],
        customStyleHookMapping: triggerOpenStateMapping
    });

    return element;
}

export namespace AccordionTrigger {
    export type Props = HeadlessUIComponentProps<'button', AccordionItem.State> & NativeButtonProps;
}
