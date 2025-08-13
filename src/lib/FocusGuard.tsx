'use client';
import * as React from 'react';

import { useIsoLayoutEffect } from '@flippo_ui/hooks';

import { isSafari } from './detectBrowser';
import { visuallyHidden } from './visuallyHidden';

import type { HeadlessUIComponentProps, HTMLProps } from './types';

/**
 * @internal
 */
export function FocusGuard({ ref, ...props }: Pick<HeadlessUIComponentProps<'span', object>, 'ref'> & HTMLProps) {
    const [role, setRole] = React.useState<'button' | undefined>();

    useIsoLayoutEffect(() => {
        if (isSafari) {
            // Unlike other screen readers such as NVDA and JAWS, the virtual cursor
            // on VoiceOver does trigger the onFocus event, so we can use the focus
            // trap element. On Safari, only buttons trigger the onFocus event.
            setRole('button');
        }
    }, []);

    const restProps = {
        ref,
        'tabIndex': 0,
        // Role is only for VoiceOver
        role,
        'aria-hidden': role ? undefined : true,
        'style': visuallyHidden
    };

    return <span {...props} {...restProps} data-base-ui-focus-guard={''} />;
}
