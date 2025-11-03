import React from 'react';

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

    useIsoLayoutEffect(() => {
        if (valueProp !== undefined || typeof children === 'string') {
            return;
        }

        if (elementRef.current) {
            const cloned = elementRef.current.cloneNode(true) as HTMLElement;
            const symbolElements = cloned.querySelectorAll('[data-snippet-symbol]');
            symbolElements.forEach((el) => el.remove());
            const text = cloned.textContent;
            setTextFromElement(text);
        }
    }, [children, valueProp]);

    const value = React.useMemo<string | null>(() => {
        if (valueProp !== undefined) {
            return valueProp;
        }
        if (typeof children === 'string') {
            return children;
        }
        return textFromElement;
    }, [valueProp, children, textFromElement]);

    const { ref: itemRef, index } = useCompositeListItem({ metadata: value });

    const state: SnippetLine.State = React.useMemo(
        () => ({
            index
        }),
        [index]
    );

    const element = useRenderElement('pre', componentProps, {
        ref: [ref, itemRef, elementRef],
        state,
        props: elementProps
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

    export type Props = { value: Metadata } & HeadlessUIComponentProps<'pre', State>;
}
