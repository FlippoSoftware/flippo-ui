import { describe, expect, it } from 'vitest';

import { CollapsibleMachine } from '~@components/collapsible/root/CollapsibleMachine';
import { CollapsibleRootDataAttributes } from '~@components/collapsible/root/CollapsibleRootDataAttributes';
import { ComboboxClearDataAttributes } from '~@components/combobox/clear/ComboboxClearDataAttributes';
import { ComboboxClearMachine } from '~@components/combobox/clear/ComboboxClearMachine';
import { ComboboxItemIndicatorDataAttributes } from '~@components/combobox/item-indicator/ComboboxItemIndicatorDataAttributes';
import { FieldsetMachine } from '~@components/fieldset/root/FieldsetMachine';
import { FieldsetRootDataAttributes } from '~@components/fieldset/root/FieldsetRootDataAttributes';
import { MenubarDataAttributes } from '~@components/menubar/root/MenubarDataAttributes';
import { MenubarMachine } from '~@components/menubar/root/MenubarMachine';
import { SelectItemIndicatorMachine } from '~@components/select/item-indicator/SelectItemIndicatorMachine';
import { getSeparatorProps } from '~@components/separator/root/getSeparatorProps';
import { SeparatorDataAttributes } from '~@components/separator/root/SeparatorDataAttributes';

function attributesOf(...states: object[]): string[] {
    return [...new Set(states.flatMap((state) => Object.keys(state).filter((name) => name.startsWith('data-'))))].sort();
}

describe('the documentation enums describe the emitted state attributes', () => {
    it('covers both visibility transitions and the disabled state of a collapsible and clear button', () => {
        expect(
            attributesOf(
                CollapsibleMachine.attrs({ open: true, disabled: true, transitionStatus: 'starting' }),
                CollapsibleMachine.attrs({ open: false, disabled: false, transitionStatus: 'ending' })
            )
        ).toEqual(Object.values(CollapsibleRootDataAttributes).sort());
        expect(
            attributesOf(
                ComboboxClearMachine.attrs({ open: true, disabled: true, transitionStatus: 'starting' }),
                ComboboxClearMachine.attrs({ open: false, disabled: false, transitionStatus: 'ending' })
            )
        ).toEqual(Object.values(ComboboxClearDataAttributes).sort());
    });

    it('covers selection transitions, fieldset disabled state and separator orientation', () => {
        expect(
            attributesOf(
                SelectItemIndicatorMachine.attrs({ selected: true, transitionStatus: 'starting' }),
                SelectItemIndicatorMachine.attrs({ selected: false, transitionStatus: 'ending' })
            )
        ).toEqual(Object.values(ComboboxItemIndicatorDataAttributes).sort());
        const fieldset = new FieldsetMachine({ disabled: true });
        expect(attributesOf(fieldset.getRootProps())).toEqual(Object.values(FieldsetRootDataAttributes));
        expect(attributesOf(FieldsetMachine.legendAttrs(fieldset.getState(), 'legend'))).toEqual(Object.values(FieldsetRootDataAttributes));
        expect(attributesOf(getSeparatorProps({ orientation: 'vertical' }))).toEqual(Object.values(SeparatorDataAttributes));
    });

    it('documents the menubar string-valued submenu flag', () => {
        const state = MenubarMachine.attrs({ orientation: 'horizontal', modal: true, hasSubmenuOpen: false });
        expect(attributesOf(state)).toEqual(Object.values(MenubarDataAttributes).sort());
        expect(state[MenubarDataAttributes.hasSubmenuOpen]).toBe('false');
    });
});
