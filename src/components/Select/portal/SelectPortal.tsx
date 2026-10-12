import React from 'react';

import { useTracker } from '~@lib/core';
import { FloatingPortal } from '~@lib/floating';

import { useSelectRoot } from '../root/SelectRootContext';

import { SelectPortalContext } from './SelectPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectPortal(componentProps: SelectPortal.Props) {
    const root = useSelectRoot();
    const track = useTracker();
    const { mounted, forceMount } = track(() => root.store.state);

    const shouldRender = mounted || forceMount;
    if (!shouldRender) {
        return null;
    }

    return (
        <SelectPortalContext.Provider value={true}>
            <FloatingPortal {...componentProps} />
        </SelectPortalContext.Provider>
    );
}

export namespace SelectPortal {
    export type State = {};
}

export type SelectPortalProps = {} & FloatingPortal.Props<SelectPortal.State>;

export namespace SelectPortal {
    export type Props = SelectPortalProps;
}
