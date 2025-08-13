'use client';

import React from 'react';

import { FloatingPortalLite } from '@lib/FloatingPortalLite';

import { useTooltipRootContext } from '../root/TooltipRootContext';

import { TooltipPortalContext } from './TooltipPortalContext';

export function TooltipPortal(props: NTooltipPortal.Props) {
    const { children, keepMounted = false, container } = props;

    const { mounted } = useTooltipRootContext();

    const shouldRender = mounted || keepMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <TooltipPortalContext value={keepMounted}>
            <FloatingPortalLite root={container}>{children}</FloatingPortalLite>
        </TooltipPortalContext>
    );
}

export namespace NTooltipPortal {
    export type Props = {
        children?: React.ReactNode;
        keepMounted?: boolean;
        container?: HTMLElement | null | React.RefObject<HTMLElement | null>;
    };
}
