import { useCallback, useRef, useState } from 'react';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useStableCallback } from '../useStableCallback';

export type UseHoverReturnValue<T extends HTMLElement = any> = {
    hovered: boolean;
    ref: React.RefCallback<T | null>;
};

export function useHover<T extends HTMLElement = any>(): UseHoverReturnValue<T> {
    const [hovered, setHovered] = useState(false);
    const previousNode = useRef<HTMLElement>(null);

    const handleMouseEnter = useStableCallback(() => {
        setHovered(true);
    });

    const handleMouseLeave = useStableCallback(() => {
        setHovered(false);
    });

    const ref: React.RefCallback<T | null> = useCallback(
        (node) => {
            if (previousNode.current) {
                previousNode.current.removeEventListener('mouseenter', handleMouseEnter);
                previousNode.current.removeEventListener('mouseleave', handleMouseLeave);
            }

            if (node) {
                node.addEventListener('mouseenter', handleMouseEnter);
                node.addEventListener('mouseleave', handleMouseLeave);
            }

            previousNode.current = node;
        },
        [handleMouseEnter, handleMouseLeave]
    );

    useIsoLayoutEffect(() => {
        return () => {
            if (previousNode.current) {
                previousNode.current.removeEventListener('mouseenter', handleMouseEnter);
                previousNode.current.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return { ref, hovered };
}
