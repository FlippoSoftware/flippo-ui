import React from 'react';

import { randomId } from '~@lib/randomId';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useStableCallback } from '../useStableCallback';

function getHeadingsData(
    headings: HTMLElement[],
    getDepth: (element: HTMLElement) => number,
    getValue: (element: HTMLElement) => string
): UseScrollSpyHeadingData[] {
    const result: UseScrollSpyHeadingData[] = [];

    for (const heading of headings) {
        result.push({
            depth: getDepth(heading),
            value: getValue(heading),
            id: heading.id || randomId('scroll-spy'),
            getNode: () => (heading.id ? document.getElementById(heading.id)! : heading)
        });
    }

    return result;
}

function getActiveElement(rects: DOMRect[], offset: number = 0) {
    if (rects.length === 0) {
        return -1;
    }

    const closest = rects.reduce(
        (acc, item, index) => {
            if (Math.abs(acc.position - offset) < Math.abs(item.y - offset)) {
                return acc;
            }

            return {
                index,
                position: item.y
            };
        },
        { index: 0, position: rects[0]?.y ?? 0 }
    );

    return closest.index;
}

function getDefaultDepth(element: HTMLElement) {
    return Number(element.tagName[1]);
}

function getDefaultValue(element: HTMLElement) {
    return element.textContent || '';
}

export type UseScrollSpyHeadingData = {
    /** Heading depth, 1-6 */
    depth: number;

    /** Heading text content value */
    value: string;

    /** Heading id */
    id: string;

    /** Function to get heading node */
    getNode: () => HTMLElement;
};

export type UseScrollSpyOptions = {
    /** Selector to get headings, `'h1, h2, h3, h4, h5, h6'` by default */
    selector?: string;

    /** A function to retrieve depth of heading, by default depth is calculated based on tag name */
    getDepth?: (element: HTMLElement) => number;

    /** A function to retrieve heading value, by default `element.textContent` is used */
    getValue?: (element: HTMLElement) => string;

    /** Host element to attach scroll event listener, if not provided, `window` is used */
    scrollHost?: HTMLElement;

    /** Offset from the top of the viewport to use when determining the active heading, `0` by default */
    offset?: number;
};

export type UseScrollSpyReturnType = {
    /** Index of the active heading in the `data` array */
    active: number;

    /** Headings data. If not initialize, data is represented by an empty array. */
    data: UseScrollSpyHeadingData[];

    /** True if headings value have been retrieved from the DOM. */
    initialized: boolean;

    /** Function to update headings values after the parent component has mounted. */
    reinitialize: () => void;
};

export function useScrollSpy({
    selector = 'h1, h2, h3, h4, h5, h6',
    getDepth = getDefaultDepth,
    getValue = getDefaultValue,
    offset = 0,
    scrollHost
}: UseScrollSpyOptions = {}): UseScrollSpyReturnType {
    const [active, setActive] = React.useState(-1);
    const [initialized, setInitialized] = React.useState(false);
    const [data, setData] = React.useState<UseScrollSpyHeadingData[]>([]);
    const headingsRef = React.useRef<UseScrollSpyHeadingData[]>([]);

    const handleScroll = useStableCallback(() => {
        setActive(
            getActiveElement(
                headingsRef.current.map((d) => d.getNode().getBoundingClientRect()),
                offset
            )
        );
    });

    const initialize = useStableCallback(() => {
        const headings = getHeadingsData(
            Array.from(document.querySelectorAll(selector)),
            getDepth,
            getValue
        );
        headingsRef.current = headings;
        setInitialized(true);
        setData(headings);
        setActive(
            getActiveElement(
                headings.map((d) => d.getNode().getBoundingClientRect()),
                offset
            )
        );
    });

    useIsoLayoutEffect(() => {
        initialize();
        const _scrollHost = scrollHost || window;
        _scrollHost.addEventListener('scroll', handleScroll);

        return () => _scrollHost.removeEventListener('scroll', handleScroll);
    }, [scrollHost]);

    return {
        reinitialize: initialize,
        active,
        initialized,
        data
    };
}
