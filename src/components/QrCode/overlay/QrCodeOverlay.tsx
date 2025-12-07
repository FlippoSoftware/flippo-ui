import React from 'react';

import { useOpenChangeComplete, useStatusTransition } from '@flippo-ui/hooks';

import type { StatusTransition } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useQrCodeRootContext } from '../root/QrCodeRootContext';
import { qrCodeOverlayStyleHookMapping } from '../utils/styleHooks';

import type { QrCodeRoot } from '../root/QrCodeRoot';
import type { QrCodeRootContextValue } from '../root/QrCodeRootContext';

/**
 * Overlay container for logos, text, or other elements that should appear on top of the QR code.
 * Renders a `<div>` element by default.
 */
export function QrCodeOverlay(componentProps: QrCodeOverlay.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children: childrenProp,
        ref,
        ...elementProps
    } = componentProps;

    const overlayRef = React.useRef<HTMLDivElement>(null);

    const {
        status,
        value,
        size,
        error
    } = useQrCodeRootContext();

    const { transitionStatus, mounted, setMounted } = useStatusTransition({
        status,
        shouldBeMounted: (status) => status !== 'idle' && status !== 'generated'
    });

    const rendered = status !== 'idle' && status !== 'generated';

    useOpenChangeComplete({
        open: rendered,
        ref: overlayRef,
        onComplete: () => {
            if (!rendered)
                setMounted(false);
        }
    });

    const children = typeof childrenProp === 'function'
        ? childrenProp({
            size,
            status,
            error,
            value
        })
        : childrenProp;

    const state: QrCodeOverlay.State = React.useMemo(
        () => ({
            status,
            value,
            transitionStatus
        }),
        [status, transitionStatus, value]
    );

    const element = useRenderElement('div', componentProps, {
        enabled: mounted,
        state,
        ref: [overlayRef, ref],
        props: [elementProps, { children }],
        customStyleHookMapping: qrCodeOverlayStyleHookMapping
    });

    return element;
}

export namespace QrCodeOverlay {
    export type State = QrCodeRoot.State & {
        transitionStatus: StatusTransition;
    };

    export type OverlayChildrenProps = {
        status: State['status'];
        value: State['value'];
        error: unknown | null;
        size: QrCodeRootContextValue['size'];
    };

    export type Props = {
        children?: React.ReactNode | ((props: OverlayChildrenProps) => React.ReactNode);
    } & Omit<HeadlessUIComponentProps<'div', State>, 'children'>;
}
