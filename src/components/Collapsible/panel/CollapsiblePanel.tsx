import React from 'react';

import { useIsoLayoutEffect, useOpenChangeComplete } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { warn } from '~@lib/warn';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCollapsibleRootContext } from '../root/CollapsibleRootContext';
import { collapsibleStyleHookMapping } from '../root/styleHooks';

import type { CollapsibleRoot } from '../root/CollapsibleRoot';

import { CollapsiblePanelCssVars } from './CollapsiblePanelCssVars';
import { useCollapsiblePanel } from './useCollapsiblePanel';

/**
 * A panel with the collapsible contents.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Collapsible](https://base-ui.com/react/components/collapsible)
 */
export function CollapsiblePanel(componentProps: CollapsiblePanelProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        hiddenUntilFound: hiddenUntilFoundProp,
        keepMounted: keepMountedProp,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useIsoLayoutEffect(() => {
            if (hiddenUntilFoundProp && keepMountedProp === false) {
                warn(
                    'The `keepMounted={false}` prop on a Collapsible will be ignored when using `hiddenUntilFound` since it requires the Panel to remain mounted even when closed.'
                );
            }
        }, [hiddenUntilFoundProp, keepMountedProp]);
    }

    const {
        abortControllerRef,
        animationTypeRef,
        height,
        mounted,
        onOpenChange,
        open,
        panelId,
        panelRef,
        runOnceAnimationsFinish,
        setDimensions,
        setHiddenUntilFound,
        setKeepMounted,
        setMounted,
        setPanelIdState,
        setOpen,
        setVisible,
        state,
        transitionDimensionRef,
        visible,
        width,
        transitionStatus
    } = useCollapsibleRootContext();

    const hiddenUntilFound = hiddenUntilFoundProp ?? false;
    const keepMounted = keepMountedProp ?? false;

    useIsoLayoutEffect(() => {
        if (idProp) {
            setPanelIdState(idProp);
            return () => {
                setPanelIdState(undefined);
            };
        }
        return undefined;
    }, [idProp, setPanelIdState]);

    useIsoLayoutEffect(() => {
        setHiddenUntilFound(hiddenUntilFound);
    }, [setHiddenUntilFound, hiddenUntilFound]);

    useIsoLayoutEffect(() => {
        setKeepMounted(keepMounted);
    }, [setKeepMounted, keepMounted]);

    const { props } = useCollapsiblePanel({
        abortControllerRef,
        animationTypeRef,
        externalRef: ref,
        height,
        hiddenUntilFound,
        id: panelId,
        keepMounted,
        mounted,
        onOpenChange,
        open,
        panelRef,
        runOnceAnimationsFinish,
        setDimensions,
        setMounted,
        setOpen,
        setVisible,
        transitionDimensionRef,
        visible,
        width
    });

    useOpenChangeComplete({
        open: open && transitionStatus === 'idle',
        ref: panelRef,
        onComplete() {
            if (!open) {
                return;
            }

            setDimensions({ height: undefined, width: undefined });
        }
    });

    const panelState: CollapsiblePanel.State = React.useMemo(
        () => ({
            ...state,
            transitionStatus
        }),
        [state, transitionStatus]
    );

    const element = useRenderElement('div', componentProps, {
        state: panelState,
        ref: [ref, panelRef],
        props: [props, {
            style: {
                [CollapsiblePanelCssVars.collapsiblePanelHeight as string]:
                        height === undefined ? 'auto' : `${height}px`,
                [CollapsiblePanelCssVars.collapsiblePanelWidth as string]:
                        width === undefined ? 'auto' : `${width}px`
            }
        }, elementProps],
        customStyleHookMapping: collapsibleStyleHookMapping
    });

    const shouldRender = keepMounted || hiddenUntilFound || (!keepMounted && mounted);

    if (!shouldRender) {
        return null;
    }

    return element;
}

export type CollapsiblePanelState = {
    transitionStatus: TransitionStatus;
} & CollapsibleRoot.State;

export type CollapsiblePanelProps = {
    /**
     * Allows the browser’s built-in page search to find and expand the panel contents.
     *
     * Overrides the `keepMounted` prop and uses `hidden="until-found"`
     * to hide the element without removing it from the DOM.
     *
     * @default false
     */
    hiddenUntilFound?: boolean;
    /**
     * Whether to keep the element in the DOM while the panel is hidden.
     * This prop is ignored when `hiddenUntilFound` is used.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'div', CollapsiblePanel.State>;

export namespace CollapsiblePanel {
    export type State = CollapsiblePanelState;
    export type Props = CollapsiblePanelProps;
}
