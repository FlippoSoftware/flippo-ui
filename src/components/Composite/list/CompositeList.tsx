

import React from 'react';

import { useEnhancedEffect, useEventCallback, useLazyRef } from '@flippo-ui/hooks';

import { CompositeListContext } from './CompositeListContext';

export type CompositeMetadata<CustomMetadata> = { index?: number | null } & CustomMetadata;

export function CompositeList<Metadata>(props: NCompositeList.Props<Metadata>) {
    const {
        children,
        elementsRef,
        labelsRef,
        onMapChange
    } = props;

    const nextIndexRef = React.useRef(0);
    const listeners = useLazyRef(createListeners).current;

    const map = useLazyRef(createMap<Metadata>).current;
    const [mapTick, setMapTick] = React.useState(0);
    const lastTickRef = React.useRef(mapTick);

    const register = useEventCallback((node: Element, metadata: Metadata) => {
        map.set(node, metadata ?? null);
        lastTickRef.current += 1;
        setMapTick(lastTickRef.current);
    });

    const unregister = useEventCallback((node: Element) => {
        map.delete(node);
        lastTickRef.current += 1;
        setMapTick(lastTickRef.current);
    });

    const sortedMap = React.useMemo(() => {
        disableEslintWarning(mapTick);

        const newMap = new Map<Element, CompositeMetadata<Metadata>>();
        const sortedNodes = Array.from(map.keys()).sort(sortByDocumentPosition);

        sortedNodes.forEach((node, index) => {
            const metadata = map.get(node) ?? ({} as CompositeMetadata<Metadata>);
            newMap.set(node, { ...metadata, index });
        });

        return newMap;
    }, [map, mapTick]);

    useEnhancedEffect(() => {
        const shouldUpdateLangth = lastTickRef.current === mapTick;
        if (shouldUpdateLangth) {
            if (elementsRef.current.length !== sortedMap.size) {
                elementsRef.current.length = sortedMap.size;
            }

            if (labelsRef && labelsRef.current.length !== sortedMap.size) {
                labelsRef.current.length = sortedMap.size;
            }
        }

        onMapChange?.(sortedMap);
    });

    useEnhancedEffect(() => {
        listeners.forEach((l) => l(sortedMap));
    }, [listeners, sortedMap]);

    const subscribeMapChange = useEventCallback((fn) => {
        listeners.add(fn);
        return () => {
            listeners.delete(fn);
        };
    });

    const contextValue = React.useMemo(() => ({
        register,
        unregister,
        subscribeMapChange,
        elementsRef,
        labelsRef,
        nextIndexRef
    }), [
        register,
        unregister,
        subscribeMapChange,
        elementsRef,
        labelsRef,
        nextIndexRef
    ]);

    return (
        <CompositeListContext value={contextValue}>
            {children}
        </CompositeListContext>
    );
}

function createMap<Metadata>() {
    return new Map<Element, CompositeMetadata<Metadata> | null>();
}

function createListeners() {
    return new Set<Function>();
}

function sortByDocumentPosition(a: Element, b: Element) {
    const position = a.compareDocumentPosition(b);

    if (
        position & Node.DOCUMENT_POSITION_FOLLOWING
        || position & Node.DOCUMENT_POSITION_CONTAINED_BY
    ) {
        return -1;
    }

    if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
        return 1;
    }

    return 0;
}

function disableEslintWarning(_: any) {}

export namespace NCompositeList {
    export type Props<Metadata> = {
        children: React.ReactNode;
        elementsRef: React.RefObject<Array<HTMLElement | null>>;
        labelsRef?: React.RefObject<Array<string | null>>;
        onMapChange?: (newMap: Map<Element, CompositeMetadata<Metadata> | null>) => void;
    };
}
