import React from 'react';

import { mergedRef } from '@flippo-ui/hooks';

import { mergeProps } from './merge';

import type { ComponentRenderFn } from './types';

type AnyProps = Record<string, any>;

export type SlotProps = React.PropsWithChildren<React.HTMLAttributes<any> & { ref?: React.Ref<HTMLElement | null | undefined> }>;
export type SlotRenderFunctin = React.FunctionComponent<SlotProps> | ComponentRenderFn<SlotProps, Record<string, any>>;

export function createSlot(ownerName: string) {
    function Slot(props: SlotProps): React.ReactElement<Record<string, unknown>>;
    function Slot<State>(...args: Parameters<ComponentRenderFn<SlotProps, State>>): React.ReactElement<Record<string, unknown>>;
    function Slot(props: SlotProps, state?: Record<string, any>) {
        const { children, ref, ...slotProps } = props;

        if (React.isValidElement(children)) {
            const childrenRef = getElementRef(children);
            const props = mergeProps(slotProps, children.props as AnyProps, { _state: state });
            // do not pass ref to React.Fragment for React 19 compatibility
            if (children.type !== React.Fragment) {
                props.ref = ref ? mergedRef(ref, childrenRef) : childrenRef;
            }

            // eslint-disable-next-line react/no-clone-element
            return React.cloneElement(children, props);
        }

        // eslint-disable-next-line react/no-children-count, react/no-children-only
        return React.Children.count(children) > 1 ? React.Children.only(null) : null;
    }

    Slot.displayName = `${ownerName}.Slot`;
    return Slot;
}

// Before React 19 accessing `element.props.ref` will throw a warning and suggest using `element.ref`
// After React 19 accessing `element.ref` does the opposite.
// https://github.com/facebook/react/pull/28348
//
// Access the ref using the method that doesn't yield a warning.
function getElementRef(element: React.ReactElement) {
    // React <=18 in DEV
    let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get;
    let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning;
    if (mayWarn) {
        return (element as any).ref;
    }

    // React 19 in DEV
    getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get;
    mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning;
    if (mayWarn) {
        return (element.props as { ref?: React.Ref<unknown> }).ref;
    }

    // Not DEV
    return (element.props as { ref?: React.Ref<unknown> }).ref || (element as any).ref;
}
