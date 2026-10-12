import React from 'react';

import { SnippetMachine, snippetRootStateAttributesMapping } from '@flippo-software/core-components/snippet';

import { useMachine, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeList } from '../../Composite';

import { SnippetRootContext } from './SnippetRootContext';

import type { SnippetRootContextValue } from './SnippetRootContext';

/**
 * Root container for the Snippet component.
 * Displays code snippets with copy functionality.
 * Renders a `<div>` element by default.
 */
export function SnippetRoot(componentProps: SnippetRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        disableCopy = false,
        symbol = '$',
        ...elementProps
    } = componentProps;

    const snippet = useMachine((options) => new SnippetMachine(options), { disableCopy, symbol });
    const state: SnippetRoot.State = useMachineState(snippet);

    const contextValue: SnippetRootContextValue = React.useMemo(() => ({ snippet, symbol, disableCopy }), [snippet, symbol, disableCopy]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: snippetRootStateAttributesMapping as StateAttributesMapping<SnippetRoot.State>
    });

    return (
        <SnippetRootContext value={contextValue}>
            <CompositeList registry={snippet.registry} elementsRef={snippet.registry.elementsRef}>
                {element}
            </CompositeList>
        </SnippetRootContext>
    );
}

export namespace SnippetRoot {
    export type State = {
        /**
         * Whether copying is disabled.
         */
        disableCopy: boolean;
        /**
         * The symbol to display in the snippet.
         */
        symbol?: string;
    };

    export type Props = HeadlessUIComponentProps<'div', State> & {
        /**
         * Whether to disable the copy functionality.
         * @default false
         */
        disableCopy?: boolean;
        /**
         * The symbol to display in the snippet.
         * @default '$'
         */
        symbol?: string | React.ReactNode;
    };
}
