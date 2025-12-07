import React from 'react';

import { useStore } from '@flippo-ui/hooks/use-store';

import { FloatingPortal } from '~@packages/floating-ui-react';

import { useComboboxRootContext } from '../root/ComboboxRootContext';
import { selectors } from '../store';

import { ComboboxPortalContext } from './ComboboxPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 * Renders a `<div>` element.
 */
export function ComboboxPortal(props: ComboboxPortal.Props) {
    const { keepMounted = false, ...portalProps } = props;

    const store = useComboboxRootContext();

    const mounted = useStore(store, selectors.mounted);
    const forceMounted = useStore(store, selectors.forceMounted);

    const shouldRender = mounted || keepMounted || forceMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <ComboboxPortalContext.Provider value={keepMounted}>
            <FloatingPortal {...portalProps} />
        </ComboboxPortalContext.Provider>
    );
}

export namespace ComboboxPortal {
    export type State = {};
}

export type ComboboxPortalProps = {
    /**
     * Whether to keep the portal mounted in the DOM while the popup is hidden.
     * @default false
     */
    keepMounted?: boolean;
} & FloatingPortal.Props<ComboboxPortal.State>;

export namespace ComboboxPortal {
    export type Props = ComboboxPortalProps;
}
