import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { SelectGroupContext } from './SelectGroupContext';

import type { SelectGroupContextValue } from './SelectGroupContext';

/**
 * Groups related select items with the corresponding label.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectGroup(componentProps: SelectGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const [labelId, setLabelId] = React.useState<string | undefined>();

    const contextValue: SelectGroupContextValue = React.useMemo(
        () => ({
            labelId,
            setLabelId
        }),
        [labelId, setLabelId]
    );

    const element = useRenderElement('div', componentProps, {
        ref,
        props: [{
            'role': 'group',
            'aria-labelledby': labelId
        }, elementProps]
    });

    return <SelectGroupContext.Provider value={contextValue}>{element}</SelectGroupContext.Provider>;
}

export type SelectGroupState = {};
export type SelectGroupProps = {} & HeadlessUIComponentProps<'div', SelectGroup.State>;

export namespace SelectGroup {
    export type State = SelectGroupState;
    export type Props = SelectGroupProps;
}
