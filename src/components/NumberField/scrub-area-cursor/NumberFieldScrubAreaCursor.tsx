import React from 'react';
import * as ReactDOM from 'react-dom';

import { toReactProps } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { ownerDocument } from '~@lib/owner';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNumberFieldRootContext } from '../root/NumberFieldRootContext';
import { useNumberFieldScrubAreaContext } from '../scrub-area/NumberFieldScrubAreaContext';
import { styleHookMapping } from '../utils/styleHooks';

import type { NumberFieldRoot } from '../root/NumberFieldRoot';

/**
 * A custom element to display instead of the native cursor while using the scrub area.
 * Rendered in a portal into the document body.
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
    const { scrubArea } = useNumberFieldScrubAreaContext();

    const [domElement, setDomElement] = React.useState<Element | null>(null);

    const element = useRenderElement('span', componentProps, {
        enabled: scrubArea.shouldRenderCursor(),
        ref: [ref, scrubArea.setCursor, setDomElement],
        state,
        props: [toReactProps(scrubArea.getCursorProps()), elementProps],
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
