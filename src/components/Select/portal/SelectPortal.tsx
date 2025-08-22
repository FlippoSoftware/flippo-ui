'use client';

import React from 'react';

import { useStore } from '@flippo_ui/hooks';

import { FloatingPortal } from '@packages/floating-ui-react';

import type { FloatingPortalProps } from '@packages/floating-ui-react';

import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';

import { SelectPortalContext } from './SelectPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectPortal(props: SelectPortal.Props) {
    const { children, container } = props;

    const { store } = useSelectRootContext();
    const mounted = useStore(store, selectors.mounted);
    const forceMount = useStore(store, selectors.forceMount);

    const shouldRender = mounted || forceMount;
    if (!shouldRender) {
        return null;
    }

    return (
        <SelectPortalContext value>
            <FloatingPortal root={container}>{children}</FloatingPortal>
        </SelectPortalContext>
    );
}

export namespace SelectPortal {
    export type Props = {
        children?: React.ReactNode;
        /**
         * A parent element to render the portal element into.
         */
        container?: FloatingPortalProps['root'];
    };
}
