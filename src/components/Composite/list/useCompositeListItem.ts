

import React from 'react';

import { useEnhancedEffect } from '@flippo-ui/hooks';

import { useCompositeListContext } from './CompositeListContext';

export enum IndexGuessBehavior {
    None,
    GuessFromOrder
}

export function useCompositeListItem<Metadata>(params: NUseCompositeListItem.Params<Metadata> = {}) {
    const {
        label,
        metadata,
        textRef,
        indexGuessBehavior
    } = params;
    const {
        register,
        unregister,
        subscribeMapChange,
        elementsRef,
        labelsRef,
        nextIndexRef
    }
        = useCompositeListContext();

    const indexRef = React.useRef(-1);
    const [index, setIndex] = React.useState<number>(
        indexGuessBehavior === IndexGuessBehavior.GuessFromOrder
            ? () => {
                if (indexRef.current === -1) {
                    const newIndex = nextIndexRef.current;
                    nextIndexRef.current += 1;
                    indexRef.current = newIndex;
                }
                return indexRef.current;
            }
            : -1
    );

    const componentRef = React.useRef<Element | null>(null);

    const ref = React.useCallback(
        (node: HTMLElement | null) => {
            componentRef.current = node;

            if (index !== -1 && node !== null) {
                elementsRef.current[index] = node;

                if (labelsRef) {
                    const isLabelDefined = label !== undefined;
                    labelsRef.current[index] = isLabelDefined
                        ? label
                        : (textRef?.current?.textContent ?? node.textContent);
                }
            }
        },
        [
            index,
            elementsRef,
            labelsRef,
            label,
            textRef
        ]
    );

    useEnhancedEffect(() => {
        const node = componentRef.current;
        if (node) {
            register(node, metadata);
            return () => {
                unregister(node);
            };
        }

        return undefined;
    }, [register, unregister, metadata]);

    useEnhancedEffect(() => {
        return subscribeMapChange((map) => {
            const i = componentRef.current ? map.get(componentRef.current)?.index : null;

            if (i != null) {
                setIndex(i);
            }
        });
    }, [subscribeMapChange, setIndex]);

    return React.useMemo(
        () => ({
            ref,
            index
        }),
        [index, ref]
    );
}

export namespace NUseCompositeListItem {
    export type Params<Metadata> = {
        label?: string | null;
        metadata?: Metadata;
        textRef?: React.RefObject<HTMLElement | null>;
        /**
         * Enables guessing the indexes. This avoids a re-render after mount, which is useful for
         * large lists. This should be used for lists that are likely flat and vertical, other cases
         * might trigger a re-render anyway.
         */
        indexGuessBehavior?: IndexGuessBehavior;
    };

    export type ReturnValue = {
        ref: (node: HTMLElement | null) => void;
        index: number;
    };
}
