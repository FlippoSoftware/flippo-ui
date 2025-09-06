'use client';

import React from 'react';

import { useMergedRef, useOpenChangeComplete } from '@flippo-ui/hooks';

import type { TInteraction, TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '@lib/hooks';
import { InternalBackdrop } from '@lib/InternalBackdrop';
import { popupStateMapping } from '@lib/popupStateMapping';
import { transitionStatusMapping } from '@lib/styleHookMapping';
import { FloatingFocusManager } from '@packages/floating-ui-react';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '@lib/types';

import { useDialogPortalContext } from '../portal/DialogPortalContext';
import { useDialogRootContext } from '../root/DialogRootContext';

import { DialogPopupCssVars } from './DialogPopupCssVars';
import { DialogPopupDataAttributes } from './DialogPopupDataAttributes';
import { useDialogPopup } from './useDialogPopup';

const customStyleHookMapping: CustomStyleHookMapping<DialogPopup.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping,
    nestedDialogOpen(value) {
        return value ? { [DialogPopupDataAttributes.nestedDialogOpen]: '' } : null;
    }
};

/**
 * A container for the dialog contents.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogPopup(componentProps: DialogPopup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        finalFocus,
        initialFocus,
        ref,
        ...elementProps
    } = componentProps;

    const {
        descriptionElementId,
        dismissible,
        floatingRootContext,
        getPopupProps,
        modal,
        mounted,
        nested,
        nestedOpenDialogCount,
        setOpen,
        open,
        openMethod,
        popupRef,
        setPopupElement,
        titleElementId,
        transitionStatus,
        onOpenChangeComplete,
        internalBackdropRef
    } = useDialogRootContext();

    useDialogPortalContext();

    useOpenChangeComplete({
        open,
        ref: popupRef,
        onComplete() {
            if (open) {
                onOpenChangeComplete?.(true);
            }
        }
    });

    const mergedRef = useMergedRef(ref, popupRef);

    const { popupProps, resolvedInitialFocus } = useDialogPopup({
        descriptionElementId,
        initialFocus,
        mounted,
        setOpen,
        openMethod,
        ref: mergedRef,
        setPopupElement,
        titleElementId
    });

    const nestedDialogOpen = nestedOpenDialogCount > 0;

    const state: DialogPopup.State = React.useMemo(
        () => ({
            open,
            nested,
            transitionStatus,
            nestedDialogOpen
        }),
        [
            open,
            nested,
            transitionStatus,
            nestedDialogOpen
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        props: [
            getPopupProps(),
            popupProps,
            {
                style: {
                    [DialogPopupCssVars.nestedDialogs]: nestedOpenDialogCount
                } as React.CSSProperties
            },
            elementProps
        ],
        customStyleHookMapping
    });

    return (
        <React.Fragment>
            {mounted && modal === true && (
                <InternalBackdrop ref={internalBackdropRef} inert={!open} />
            )}
            <FloatingFocusManager
                context={floatingRootContext}
                disabled={!mounted}
                closeOnFocusOut={dismissible}
                initialFocus={resolvedInitialFocus}
                returnFocus={finalFocus}
                modal={modal !== false}
                restoreFocus={'popup'}
            >
                {element}
            </FloatingFocusManager>
        </React.Fragment>
    );
}

export namespace DialogPopup {
    export type State = {
        /**
         * Whether the dialog is currently open.
         */
        open: boolean;
        transitionStatus: TransitionStatus;
        /**
         * Whether the dialog is nested within a parent dialog.
         */
        nested: boolean;
        /**
         * Whether the dialog has nested dialogs open.
         */
        nestedDialogOpen: boolean;
    };

    export type Props = {
        /**
         * Determines the element to focus when the dialog is opened.
         * By default, the first focusable element is focused.
         */
        initialFocus?:
          | React.RefObject<HTMLElement | null>
          | ((interactionType: TInteraction) => React.RefObject<HTMLElement | null>);
        /**
         * Determines the element to focus when the dialog is closed.
         * By default, focus returns to the trigger.
         */
        finalFocus?: React.RefObject<HTMLElement | null>;
    } & HeadlessUIComponentProps<'div', State>;
}
