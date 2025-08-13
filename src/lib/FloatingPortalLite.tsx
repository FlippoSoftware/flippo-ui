'use client';
import * as ReactDOM from 'react-dom';

import { useFloatingPortalNode } from '@floating-ui/react';

/**
 * Renders children into a floating portal node.
 *
 * @param props - The properties for the floating portal.
 * @param props.root - The root node where the portal should be attached. If not provided, a new node will be created.
 * @param props.children - The React children to render inside the portal.
 * @returns The portal with children rendered inside, or null if no node is available.
 */
export function FloatingPortalLite(props: NFloatingPortalLite.Props) {
    const node = useFloatingPortalNode({ root: props.root });

    return node && ReactDOM.createPortal(props.children, node);
}

export namespace NFloatingPortalLite {
    export type Props = {
        children?: React.ReactNode;
        root?: HTMLElement | null | React.RefObject<HTMLElement | null>;
    };
}
