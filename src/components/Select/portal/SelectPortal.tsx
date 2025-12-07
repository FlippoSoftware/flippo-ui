import React from 'react';

import { useStore } from '@flippo-ui/hooks';

import { FloatingPortal } from '~@packages/floating-ui-react';

import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';

import { SelectPortalContext } from './SelectPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectPortal(componentProps: SelectPortal.Props) {
    const { store } = useSelectRootContext();
    const mounted = useStore(store, selectors.mounted);
    const forceMount = useStore(store, selectors.forceMount);

    const shouldRender = mounted || forceMount;
    if (!shouldRender) {
        return null;
    }

    return (
        <SelectPortalContext.Provider value>
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
