import React from 'react';

import { useEventCallback, useOpenChangeComplete } from '@flippo-ui/hooks';
import { useRenderElement } from '~@lib/hooks';
import { InternalBackdrop } from '~@lib/InternalBackdrop';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import { FloatingFocusManager } from '~@packages/floating-ui-react';

import type { Interaction, TransitionStatus } from '@flippo-ui/hooks';
import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { COMPOSITE_KEYS } from '../../Composite/composite';
import { useDialogPortalContext } from '../portal/DialogPortalContext';
import { useDialogRootContext } from '../root/DialogRootContext';

import { DialogPopupCssVars } from './DialogPopupCssVars';
import { DialogPopupDataAttributes } from './DialogPopupDataAttributes';

const customStyleHookMapping: StateAttributesMapping<DialogPopup.State> = {
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

    const { store } = useDialogRootContext();

    const descriptionElementId = store.useState('descriptionElementId');
    const dismissible = store.useState('dismissible');
    const floatingRootContext = store.useState('floatingRootContext');
    const rootPopupProps = store.useState('popupProps');
    const modal = store.useState('modal');
    const mounted = store.useState('mounted');
    const nested = store.useState('nested');
    const nestedOpenDialogCount = store.useState('nestedOpenDialogCount');
    const open = store.useState('open');
    const openMethod = store.useState('openMethod');
    const titleElementId = store.useState('titleElementId');
    const transitionStatus = store.useState('transitionStatus');

    useDialogPortalContext();

    useOpenChangeComplete({
        open,
        ref: store.context.popupRef,
        onComplete() {
            if (open) {
                store.context.openChangeComplete?.(true);
            }
        }
    });

    // Default initial focus logic:
    // If opened by touch, focus the popup element to prevent the virtual keyboard from opening
    // (this is required for Android specifically as iOS handles this automatically).
    const defaultInitialFocus = useEventCallback((interactionType: Interaction) => {
        if (interactionType === 'touch') {
            return store.context.popupRef.current;
        }
        return true;
    });

    const resolvedInitialFocus = initialFocus === undefined ? defaultInitialFocus : initialFocus;

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
        props: [rootPopupProps, {
            'aria-labelledby': titleElementId ?? undefined,
            'aria-describedby': descriptionElementId ?? undefined,
            'role': 'dialog',
            'tabIndex': -1,
            'hidden': !mounted,
            onKeyDown(event: React.KeyboardEvent) {
                if (COMPOSITE_KEYS.has(event.key)) {
                    event.stopPropagation();
                }
            },
            'style': {
                [DialogPopupCssVars.nestedDialogs]: nestedOpenDialogCount
            } as React.CSSProperties
        }, elementProps],
        ref: [ref, store.context.popupRef, store.getElementSetter('popupElement')],
        customStyleHookMapping
    });

    return (
        <React.Fragment>
            {mounted && modal === true && (
                <InternalBackdrop ref={store.context.internalBackdropRef} inert={!open} />
            )}
            <FloatingFocusManager
                context={floatingRootContext}
                openInteractionType={openMethod}
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
         *
         * - `false`: Do not move focus.
         * - `true`: Move focus based on the default behavior (first tabbable element or popup).
         * - `RefObject`: Move focus to the ref element.
         * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
         *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
         */
        initialFocus?:
          | boolean
          | React.RefObject<HTMLElement | null>
          | ((openType: Interaction) => boolean | HTMLElement | null | void);
        /**
         * Determines the element to focus when the dialog is closed.
         *
         * - `false`: Do not move focus.
         * - `true`: Move focus based on the default behavior (trigger or previously focused element).
         * - `RefObject`: Move focus to the ref element.
         * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
         *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
         */
        finalFocus?:
          | boolean
          | React.RefObject<HTMLElement | null>
          | ((closeType: Interaction) => boolean | HTMLElement | null | void);
    } & HeadlessUIComponentProps<'div', State>;
}
