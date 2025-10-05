import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { MenuGroupContext } from './MenuGroupContext';

/**
 * Groups related menu items with the corresponding label.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuGroup(componentProps: MenuGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const [labelId, setLabelId] = React.useState<string | undefined>(undefined);

    const context = React.useMemo(() => ({ setLabelId }), [setLabelId]);

    const element = useRenderElement('div', componentProps, {
        ref,
        props: {
            'role': 'group',
            'aria-labelledby': labelId,
            ...elementProps
        }
    });

    return <MenuGroupContext value={context}>{element}</MenuGroupContext>;
}

export namespace MenuGroup {
    export type State = object;

    export type Props = {
    /**
     * The content of the component.
     */
        children?: React.ReactNode;
    } & HeadlessUIComponentProps<'div', State>;
}
