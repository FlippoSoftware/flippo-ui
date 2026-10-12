import { SegmentedControlItemMachine } from '@flippo-software/core-components/segmented-control';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

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
 * An option of a segmented control.
 * Renders a `<button>` element.
 */
export function SegmentedControlItem(componentProps: SegmentedControlItem.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        value,
        disabled,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const { control } = useSegmentedControlContext(false);

    const item = useMachine((options) => new SegmentedControlItemMachine(control, options), {
        value,
        disabled,
        nativeButton
    });
    const state: SegmentedControlItem.State = useMachineState(item);
    const track = useTracker();

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, item.setElement],
        props: [elementProps, (props) => track(() => toReactProps(item.getProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });
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
} & NativeButtonProps &
    HeadlessUIComponentProps<'button', SegmentedControlItem.State>;

export namespace SegmentedControlItem {
    export type State = SegmentedControlItemState;
    export type Props = SegmentedControlItemProps;
}
