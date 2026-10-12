import React from 'react';

import { getSnippetLineText } from '@flippo-software/core-components/snippet';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite';

export function SnippetLine(componentProps: SnippetLine.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        children,
        value: valueProp,
        ...elementProps
    } = componentProps;

    const elementRef = React.useRef<HTMLPreElement | null>(null);
    const [textFromElement, setTextFromElement] = React.useState<string | null>(null);

    // Without an explicit value, the copied text is read from the rendered line (without its symbols).
    useIsoLayoutEffect(() => {
        if (valueProp !== undefined || typeof children === 'string' || !elementRef.current) {
            return;
        }
        setTextFromElement(getSnippetLineText(elementRef.current));
    }, [children, valueProp]);

    let text: SnippetLine.Metadata = textFromElement;
    if (valueProp !== undefined) {
        text = valueProp;
    } else if (typeof children === 'string') {
        text = children;
    }

    const metadata = React.useMemo(() => ({ text }), [text]);
    const { ref: itemRef, index } = useCompositeListItem({ metadata });

    const state: SnippetLine.State = React.useMemo(
        () => ({
            index
        }),
        [index]
    );

    const element = useRenderElement('pre', componentProps, {
        ref: [ref, itemRef, elementRef],
        state,
        props: [elementProps, { children }]
    });

    return element;
}

export namespace SnippetLine {
    export type Metadata = string | null | undefined;

    export type State = {
        /**
         * The index of the line.
         */
        index: number;
    };

    export type Props = {
        /**
         * The text copied for this line. Defaults to the line's text content without its symbols.
         */
        value?: Metadata;
    } & HeadlessUIComponentProps<'pre', State>;
}
