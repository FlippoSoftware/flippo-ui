import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

/**
 * NoSsr purposely removes components from the subject of Server Side Rendering (SSR).
 *
 * This component can be useful in a variety of situations:
 *
 * Escape hatch for broken dependencies not supporting SSR.
 * Improve the time-to-first paint on the client by only rendering above the fold.
 * Reduce the rendering time on the server.
 * Under too heavy server load, you can turn on service degradation.
 */
export function NoSsr(props: NoSsr.Props) {
    const { children, defer = false, fallback = null } = props;
    const [mountedState, setMountedState] = React.useState(false);

    useIsoLayoutEffect(() => {
        if (!defer) {
            setMountedState(true);
        }
    }, [defer]);

    React.useEffect(() => {
        if (defer) {
            setMountedState(true);
        }
    }, [defer]);

    return (mountedState ? children : fallback);
}

export namespace NoSsr {
    export type Props = {
        /**
         * You can wrap a node.
         */
        children?: React.ReactNode;
        /**
         * If `true`, the component will not only prevent server-side rendering.
         * It will also defer the rendering of the children into a different screen frame.
         * @default false
         */
        defer?: boolean;
        /**
         * The fallback content to display.
         * @default null
         */
        fallback?: React.ReactNode;
    };
}
