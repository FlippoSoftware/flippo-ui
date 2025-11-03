import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeList } from '../../Composite';

import type { CompositeMetadata } from '../../Composite';
import type { SnippetLine } from '../line/SnippetLine';

import { SnippetRootContext } from './SnippetRootContext';
import { SnippetRootDataAttributes } from './SnippetRootDataAttributes';

const snippetRootStyleHook: StateAttributesMapping<SnippetRoot.State> = {
    disableCopy(value): Record<string, string> | null {
        if (value) {
            return { [SnippetRootDataAttributes.disableCopy]: '' };
        }

        return null;
    }
};

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

    const elementsRef = React.useRef<HTMLElement[]>([]);
    const metadataMapRef = React.useRef<Map<Element, CompositeMetadata<SnippetLine.Metadata> | null>>(new Map());

    const handleMapChange = React.useCallback((newMap: Map<Element, CompositeMetadata<SnippetLine.Metadata> | null>) => {
        metadataMapRef.current = newMap;
    }, []);

    const state: SnippetRoot.State = React.useMemo(
        () => ({
            disableCopy,
            symbol: typeof symbol === 'string' ? symbol : undefined
        }),
        [disableCopy, symbol]
    );

    const contextValue = React.useMemo(
        () => ({
            symbol,
            disableCopy,
            metadataMapRef
        }),
        [disableCopy, symbol]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: snippetRootStyleHook
    });

    return (
        <SnippetRootContext value={contextValue}>
            <CompositeList elementsRef={elementsRef} onMapChange={handleMapChange}>
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
