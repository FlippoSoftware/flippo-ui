import React from 'react';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { REASONS } from '~@lib/reason';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { ACTIVE_COMPOSITE_ITEM } from '../../Composite/constants';
import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useButton } from '../../use-button/useButton';
import { useSegmentedControlContext } from '../root/SegmentedControlRootContext';

import { SegmentedControlItemDataAttributes } from './SegmentedControlItemDataAttributes';

const stateAttributesMapping = {
    selected(value: boolean): Record<string, string> {
        if (value) {
            return { [SegmentedControlItemDataAttributes.selected]: '' };
        }
        return { [SegmentedControlItemDataAttributes.unselected]: '' };
    },
    disabled(value: boolean) {
        if (value) {
            return { [SegmentedControlItemDataAttributes.disabled]: '' } as Record<string, string>;
        }
        return null;
    }
};

/**
 * Represents a single option inside a SegmentedControl.Root.
 * Renders a `<button>` element with role="radio".
 *
 * @example
 * <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
 */
export function SegmentedControlItem(componentProps: SegmentedControlItem.Props) {
    const {
        value,
        disabled: disabledProp = false,
        render,
        className,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const context = useSegmentedControlContext(false);

    const selected = context.value === value;
    const disabled = disabledProp || context.disabled;
    const readOnly = context.readOnly;

    const { getButtonProps, buttonRef } = useButton({ disabled, native: nativeButton });

    const state: SegmentedControlItem.State = React.useMemo(
        () => ({ selected, disabled }),
        [selected, disabled]
    );

    const itemProps = {
        'role': 'radio',
        'aria-checked': selected,
        'aria-disabled': disabled || undefined,
        [ACTIVE_COMPOSITE_ITEM as string]: selected ? '' : undefined,
        onClick(event: React.MouseEvent) {
            if (readOnly || disabled || selected) return;
            const details = createChangeEventDetails(REASONS.none, event.nativeEvent);
            context.setValue(value, details);
        }
    };

    const refs = [ref, buttonRef];
    const props = [itemProps, elementProps, getButtonProps];

    return (
        <CompositeItem
            tag={'button'}
            render={render}
            className={className}
            state={state}
            refs={refs}
            props={props}
            stateAttributesMapping={stateAttributesMapping}
        />
    );
}

export type SegmentedControlItemState = {
    /** Whether this item is currently selected. */
    selected: boolean;
    /** Whether the item should ignore user interaction. */
    disabled: boolean;
};

export type SegmentedControlItemProps = {
    /**
     * The unique value that identifies this item within the group.
     */
    value: string;
    /**
     * Whether this item should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
} & NativeButtonProps
  & HeadlessUIComponentProps<'button', SegmentedControlItem.State>;

export namespace SegmentedControlItem {
    export type State = SegmentedControlItemState;
    export type Props = SegmentedControlItemProps;
}
