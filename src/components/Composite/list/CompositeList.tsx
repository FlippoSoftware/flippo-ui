import React from 'react';

import { ListRegistry } from '@flippo-software/core-components/composite';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { CompositeListContext } from './CompositeListContext';

import type { CompositeListContextValue } from './CompositeListContext';

export type CompositeMetadata<CustomMetadata> = { index?: number | null } & CustomMetadata;

export type CreateCompositeListParameters = {
    CompositeListContext: React.Context<CompositeListContextValue<any>>;
};

/**
 * Creates a list component that registers its items (in DOM order) in a core `ListRegistry`
 * and provides it through `CompositeListContext`.
 */
export function createCompositeList(params: CreateCompositeListParameters) {
    const { CompositeListContext } = params;

    return function CompositeList<Metadata>(props: CompositeList.Props<Metadata>) {
        const { children, elementsRef, labelsRef, onMapChange: onMapChangeProp, registry: externalRegistry } = props;

        // A list without a given registry owns one (created once; a list doesn't switch between the two).
        const [ownRegistry] = React.useState(() => (externalRegistry ? null : new ListRegistry<Metadata>({ elementsRef, labelsRef })));
        const registry = externalRegistry ?? (ownRegistry as ListRegistry<Metadata>);

        const onMapChange = useStableCallback(onMapChangeProp);

        // Subscribed before connecting: connecting flushes the items registered so far.
        useIsoLayoutEffect(
            () => registry.subscribe((map) => onMapChange(map as Map<Element, CompositeMetadata<Metadata> | null>)),
            [registry, onMapChange]
        );

        useIsoLayoutEffect(() => ownRegistry?.connect(), [ownRegistry]);

        const contextValue: CompositeListContextValue<Metadata> = React.useMemo(
            () => ({
                register: (node, metadata) => registry.register(node, metadata ?? undefined),
                unregister: registry.unregister,
                subscribeMapChange: registry.subscribe as CompositeListContextValue<Metadata>['subscribeMapChange'],
                elementsRef: registry.elementsRef as React.RefObject<Array<HTMLElement | null>>,
                labelsRef: (registry.labelsRef ?? labelsRef) as React.RefObject<Array<string | null>> | undefined,
                nextIndexRef: registry.nextIndexRef
            }),
            [registry, labelsRef]
        );

        return <CompositeListContext value={contextValue}>{children}</CompositeListContext>;
    };
}

export const CompositeList = createCompositeList({
    CompositeListContext
});

export type CompositeListProps<Metadata> = {
    children: React.ReactNode;
    /**
     * A ref to the list of HTML elements, ordered by their index.
     * `useListNavigation`'s `listRef` prop.
     */
    elementsRef: React.RefObject<Array<HTMLElement | null>>;
    /**
     * A ref to the list of element labels, ordered by their index.
     * `useTypeahead`'s `listRef` prop.
     */
    labelsRef?: React.RefObject<Array<string | null>>;
    onMapChange?: (newMap: Map<Element, CompositeMetadata<Metadata> | null>) => void;
    /**
     * An existing registry to provide (a composite root's); a new one is created otherwise.
     */
    registry?: ListRegistry<Metadata>;
};

// eslint-disable-next-line ts/no-redeclare
export namespace CompositeList {
    export type Props<Metadata> = CompositeListProps<Metadata>;
}
