import React from 'react';

import type { Align, Side } from '~@lib/hooks/useAnchorPositioning';

export type ComboboxPositionerContextValue = {
    side: Side;
    align: Align;
    arrowRef: React.RefObject<Element | null>;
    arrowUncentered: boolean;
    arrowStyles: React.CSSProperties;
    anchorHidden: boolean;
    isPositioned: boolean;
};

export const ComboboxPositionerContext = React.createContext<ComboboxPositionerContextValue | undefined>(
    undefined
);

export function useComboboxPositionerContext(optional?: false): ComboboxPositionerContextValue;
export function useComboboxPositionerContext(optional: true): ComboboxPositionerContextValue | undefined;
export function useComboboxPositionerContext(optional?: boolean) {
    const context = React.use(ComboboxPositionerContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: <Combobox.Popup> and <Combobox.Arrow> must be used within the <Combobox.Positioner> component'
        );
    }
    return context;
}
