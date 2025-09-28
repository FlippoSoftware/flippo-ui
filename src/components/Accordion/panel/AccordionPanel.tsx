'use client';

import React from 'react';

import { useIsoLayoutEffect, useOpenChangeComplete } from '@flippo-ui/hooks';
import { useRenderElement } from '@lib/hooks';
import { warn } from '@lib/warn';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { HeadlessUIComponentProps } from '@lib/types';

import { useCollapsiblePanel } from '../../Collapsible/panel/useCollapsiblePanel';
import { useCollapsibleRootContext } from '../../Collapsible/root/CollapsibleRootContext';
import { useAccordionItemContext } from '../item/AccordionItemContext';
import { accordionStyleHookMapping } from '../item/styleHooks';
import { useAccordionRootContext } from '../root/AccordionRootContext';

import type { AccordionItem } from '../item/AccordionItem';
import type { AccordionRoot } from '../root/AccordionRoot';

import { AccordionPanelCssVars } from './AccordionPanelCssVars';

/**
 * A collapsible panel with the accordion item contents.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */
export function AccordionPanel(componentProps: AccordionPanel.Props) {
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

    const { hiddenUntilFound: contextHiddenUntilFound, keepMounted: contextKeepMounted }
        = useAccordionRootContext();

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
        setOpen,
        setVisible,
        transitionDimensionRef,
        visible,
        width,
        setPanelIdState,
        transitionStatus
    } = useCollapsibleRootContext();

    const hiddenUntilFound = hiddenUntilFoundProp ?? contextHiddenUntilFound;
    const keepMounted = keepMountedProp ?? contextKeepMounted;

    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useIsoLayoutEffect(() => {
            if (keepMountedProp === false && hiddenUntilFound) {
                warn(
                    'The `keepMounted={false}` prop on a Accordion.Panel will be ignored when using `contextHiddenUntilFound` on the Panel or the Root since it requires the panel to remain mounted when closed.'
                );
            }
        }, [hiddenUntilFound, keepMountedProp]);
    }

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

    useOpenChangeComplete({
        open: open && transitionStatus === 'idle',
        ref: panelRef,
        onComplete() {
            if (!open) {
                return;
            }

            setDimensions({ width: undefined, height: undefined });
        }
    });

    const { props } = useCollapsiblePanel({
        abortControllerRef,
        animationTypeRef,
        externalRef: ref as React.RefObject<HTMLElement>,
        height,
        hiddenUntilFound,
        id: idProp ?? panelId,
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

    const { state, triggerId } = useAccordionItemContext();

    const panelState: AccordionPanel.State = React.useMemo(
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
            'aria-labelledby': triggerId,
            'role': 'region',
            'style': {
                [AccordionPanelCssVars.accordionPanelHeight as string]:
                        height === undefined ? 'auto' : `${height}px`,
                [AccordionPanelCssVars.accordionPanelWidth as string]:
                        width === undefined ? 'auto' : `${width}px`
            }
        }, elementProps],
        customStyleHookMapping: accordionStyleHookMapping
    });

    const shouldRender = keepMounted || hiddenUntilFound || (!keepMounted && mounted);
    if (!shouldRender) {
        return null;
    }

    return element;
}

export namespace AccordionPanel {
    export type State = {
        transitionStatus: TransitionStatus;
    } & AccordionItem.State;

    export type Props = HeadlessUIComponentProps<'div', AccordionItem.State> & Pick<AccordionRoot.Props, 'hiddenUntilFound' | 'keepMounted'>;
}
