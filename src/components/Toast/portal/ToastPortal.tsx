'use client';

import React from 'react';

import { FloatingPortalLite } from '@lib/FloatingPortalLite';

export function ToastPortal(props: ToastPortal.Props) {
    const { children, container } = props;

    return <FloatingPortalLite root={container}>{children}</FloatingPortalLite>;
}

export namespace ToastPortal {
    export type Props = React.PropsWithChildren<{
        container?: HTMLElement | null | React.RefObject<HTMLElement | null>;
    }>;
}
