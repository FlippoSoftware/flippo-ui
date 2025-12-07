import React from 'react';

import { useStore } from '@flippo-ui/hooks/use-store';

import { resolveSelectedLabel } from '~@lib/resolveValueLabel';

import { useComboboxRootContext } from '../root/ComboboxRootContext';
import { selectors } from '../store';

/**
 * The current value of the combobox.
 * Doesn't render its own HTML element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */
export function ComboboxValue(props: ComboboxValue.Props): React.ReactElement {
    const { children: childrenProp } = props;

    const store = useComboboxRootContext();

    const itemToStringLabel = useStore(store, selectors.itemToStringLabel);
    const selectedValue = useStore(store, selectors.selectedValue);
    const items = useStore(store, selectors.items);

    let returnValue = null;
    if (typeof childrenProp === 'function') {
        returnValue = childrenProp(selectedValue);
    }
    else if (childrenProp != null) {
        returnValue = childrenProp;
    }
    else {
        returnValue = resolveSelectedLabel(selectedValue, items, itemToStringLabel);
    }

    return <React.Fragment>{returnValue}</React.Fragment>;
}

export type ComboboxValueState = {};

export type ComboboxValueProps = {
    children?: React.ReactNode | ((selectedValue: any) => React.ReactNode);
};

export namespace ComboboxValue {
    export type State = ComboboxValueState;
    export type Props = ComboboxValueProps;
}
