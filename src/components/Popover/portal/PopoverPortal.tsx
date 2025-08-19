'use client';

import React from 'react';

import { FloatingPortal } from '@packages/floating-ui-react';

import type { FloatingPortalProps } from '@packages/floating-ui-react';

import { usePopoverRootContext } from '../root/PopoverRootContext';

import { PopoverPortalContext } from './PopoverPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverPortal(props: PopoverPortal.Props) {
    const { children, keepMounted = false, container } = props;

    const { mounted } = usePopoverRootContext();

    const shouldRender = mounted || keepMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <PopoverPortalContext value={keepMounted}>
            <FloatingPortal root={container}>{children}</FloatingPortal>
        </PopoverPortalContext>
    );
}

export namespace PopoverPortal {
    export type Props = {
        children?: React.ReactNode;
        /**
         * Whether to keep the portal mounted in the DOM while the popup is hidden.
         * @default false
         */
        keepMounted?: boolean;
        /**
         * A parent element to render the portal element into.
         */
        container?: FloatingPortalProps['root'];
    };
}
