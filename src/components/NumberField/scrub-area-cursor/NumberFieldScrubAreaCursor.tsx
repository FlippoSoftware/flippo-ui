import React from 'react';
import ReactDOM from 'react-dom';

import { isWebKit } from '~@lib/detectBrowser';
import { useRenderElement } from '~@lib/hooks';
import { ownerDocument } from '~@lib/owner';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNumberFieldRootContext } from '../root/NumberFieldRootContext';
import { useNumberFieldScrubAreaContext } from '../scrub-area/NumberFieldScrubAreaContext';
import { styleHookMapping } from '../utils/styleHooks';

import type { NumberFieldRoot } from '../root/NumberFieldRoot';

/**
 * A custom element to display instead of the native cursor while using the scrub area.
 * Renders a `<span>` element.
 *
 * This component uses the [Pointer Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API), which may prompt the browser to display a related notification. It is disabled
 * in Safari to avoid a layout shift that this notification causes there.
 *
 * Documentation: [Base UI Number Field](https://base-ui.com/react/components/number-field)
 */
export function NumberFieldScrubAreaCursor(componentProps: NumberFieldScrubAreaCursor.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { state } = useNumberFieldRootContext();
    const {
        isScrubbing,
        isTouchInput,
        isPointerLockDenied,
        scrubAreaCursorRef
    }
        = useNumberFieldScrubAreaContext();

    const [domElement, setDomElement] = React.useState<Element | null>(null);

    const shouldRender = isScrubbing && !isWebKit && !isTouchInput && !isPointerLockDenied;

    const element = useRenderElement('span', componentProps, {
        enabled: shouldRender,
        ref: [ref, scrubAreaCursorRef, setDomElement],
        state,
        props: [{
            role: 'presentation',
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none'
            }
        }, elementProps],
        customStyleHookMapping: styleHookMapping
    });

    return element && ReactDOM.createPortal(element, ownerDocument(domElement).body);
}

export type NumberFieldScrubAreaCursorState = {} & NumberFieldRoot.State;

export type NumberFieldScrubAreaCursorProps = {} & HeadlessUIComponentProps<'span', NumberFieldScrubAreaCursor.State>;

export namespace NumberFieldScrubAreaCursor {
    export type State = NumberFieldScrubAreaCursorState;
    export type Props = NumberFieldScrubAreaCursorProps;
}
