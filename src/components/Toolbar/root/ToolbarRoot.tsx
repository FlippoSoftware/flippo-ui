import React from 'react';

import type { HeadlessUIComponentProps, HTMLProps, Orientation } from '~@lib/types';

import { CompositeRoot } from '../../Composite/root/CompositeRoot';

import type { CompositeMetadata } from '../../Composite/list/CompositeList';

import { ToolbarRootContext } from './ToolbarRootContext';

import type { ToolbarRootContextValue } from './ToolbarRootContext';

/**
 * A container for grouping a set of controls, such as buttons, toggle groups, or menus.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Toolbar](https://base-ui.com/react/components/toolbar)
 */
export function ToolbarRoot(componentProps: ToolbarRoot.Props) {
    const {
        cols = 1,
        disabled = false,
        loop = true,
        orientation = 'horizontal',
        className,
        render,
        ref,
        ...elementProps
    } = componentProps;

    const [itemMap, setItemMap] = React.useState(
        () => new Map<Node, CompositeMetadata<ToolbarRoot.ItemMetadata> | null>()
    );

    const disabledIndices = React.useMemo(() => {
        const output: number[] = [];
        for (const itemMetadata of itemMap.values()) {
            if (itemMetadata?.index && !itemMetadata.focusableWhenDisabled) {
                output.push(itemMetadata.index);
            }
        }
        return output;
    }, [itemMap]);

    const toolbarRootContext: ToolbarRootContextValue = React.useMemo(
        () => ({
            disabled,
            orientation,
            setItemMap
        }),
        [disabled, orientation, setItemMap]
    );

    const state = React.useMemo(() => ({ disabled, orientation }), [disabled, orientation]);

    const defaultProps: HTMLProps = {
        'aria-orientation': orientation,
        'role': 'toolbar'
    };

    return (
        <ToolbarRootContext value={toolbarRootContext}>
            <CompositeRoot
              render={render}
              className={className}
              state={state}
              refs={[ref]}
              props={[defaultProps, elementProps]}
              cols={cols}
              disabledIndices={disabledIndices}
              loop={loop}
              onMapChange={setItemMap}
              orientation={orientation}
            />
        </ToolbarRootContext>
    );
}

export namespace ToolbarRoot {
    export type ItemMetadata = {
        focusableWhenDisabled: boolean;
    };

    export type State = {
        disabled: boolean;
        orientation: Orientation;
    };

    export type Props = {
        /**
         * The number of columns. When greater than 1, the toolbar is arranged into
         * a grid.
         * @default 1
         */
        cols?: number;
        disabled?: boolean;
        /**
         * The orientation of the toolbar.
         * @default 'horizontal'
         */
        orientation?: Orientation;
        /**
         * If `true`, using keyboard navigation will wrap focus to the other end of the toolbar once the end is reached.
         *
         * @default true
         */
        loop?: boolean;
    } & HeadlessUIComponentProps<'div', State>;
}
