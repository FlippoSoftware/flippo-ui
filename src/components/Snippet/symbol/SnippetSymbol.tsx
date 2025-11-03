import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSnippetRootContext } from '../root/SnippetRootContext';

import { SnippetSymbolDataAttributes } from './SnippetSymbolDataAttributes';

const snippetSymbolStyleHook: StateAttributesMapping<SnippetSymbol.State> = {
    snippetSymbol(value): Record<string, string> | null {
        if (value) {
            return { [SnippetSymbolDataAttributes.snippetSymbol]: '' };
        }

        return null;
    }
};

export function SnippetSymbol(componentProps: SnippetSymbol.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        children,
        ...elementProps
    } = componentProps;

    const { symbol } = useSnippetRootContext();

    const content = children ?? symbol;

    const state: SnippetSymbol.State = React.useMemo(() => ({
        snippetSymbol: true
    }), []);

    const element = useRenderElement('span', componentProps, {
        ref,
        state,
        props: [elementProps, { children: content }],
        customStyleHookMapping: snippetSymbolStyleHook
    });

    return element;
}

SnippetSymbol.displayName = 'SnippetSymbol';

export namespace SnippetSymbol {
    export type State = {
        snippetSymbol: boolean;
    };

    export type Props = HeadlessUIComponentProps<'span', State>;
}
