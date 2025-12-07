import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCheckboxGroupContext } from '../../CheckboxGroup/CheckboxGroupContext';
import { LabelableProvider } from '../../LabelableProvider';
import { useFieldRootContext } from '../root/FieldRootContext';
import { fieldValidityMapping } from '../utils/constants';

import type { FieldRoot } from '../root/FieldRoot';

import { FieldItemContext } from './FieldItemContext';

import type { FieldItemContextValue } from './FieldItemContext';

/**
 * Groups individual items in a checkbox group or radio group with a label and description.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Field](https://base-ui.com/react/components/field)
 */
export function FieldItem(componentProps: FieldItem.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        disabled: disabledProp = false,
        ...elementProps
    } = componentProps;

    const { state, disabled: rootDisabled } = useFieldRootContext(false);

    const disabled = rootDisabled || disabledProp;

    const checkboxGroupContext = useCheckboxGroupContext();
    // checkboxGroupContext.parent is truthy even if no parent checkbox is involved
    const parentId = checkboxGroupContext?.parent.id;
    // this a more reliable check
    const hasParentCheckbox = checkboxGroupContext?.allValues !== undefined;

    const initialControlId = hasParentCheckbox ? parentId : undefined;

    const fieldItemContext: FieldItemContextValue = React.useMemo(() => ({ disabled }), [disabled]);

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: elementProps,
        customStyleHookMapping: fieldValidityMapping
    });

    return (
        <LabelableProvider initialControlId={initialControlId}>
            <FieldItemContext.Provider value={fieldItemContext}>{element}</FieldItemContext.Provider>
        </LabelableProvider>
    );
}

export type FieldItemProps = {
    /**
     * Whether the wrapped control should ignore user interaction.
     * The `disabled` prop on `<Field.Root>` takes precedence over this.
     * @default false
     */
    disabled?: boolean;
} & HeadlessUIComponentProps<'div', FieldItem.State>;

export namespace FieldItem {
    export type State = FieldRoot.State;
    export type Props = FieldItemProps;
}
