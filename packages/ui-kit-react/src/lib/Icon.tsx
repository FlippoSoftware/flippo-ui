import type * as React from 'react';

import { ICONS } from '@flippo-software/component-styles/icons';

import type { IconName } from '@flippo-software/component-styles/icons';

/** A Flippo icon (24×24, `currentColor`), sized by the part's CSS. */
export function Icon({ name, ...props }: { name: IconName } & React.SVGProps<SVGSVGElement>): React.JSX.Element {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='1em'
            height='1em'
            fill='none'
            aria-hidden={true}
            data-icon={name}
            // The markup is a constant of component-styles, never user input.
            // biome-ignore lint/security/noDangerouslySetInnerHtml: static icon paths
            dangerouslySetInnerHTML={{ __html: ICONS[name] }}
            {...props}
        />
    );
}

/** The check mark and the minus sign of checkbox indicators; CSS shows the one that matches the state. */
export const CHECK_ICONS: React.JSX.Element = (
    <>
        <Icon name='check' />
        <Icon name='minus' />
    </>
);

const elements = new Map<IconName, React.JSX.Element>();

/** The shared element of an icon, for the default children of styled parts. */
export function icon(name: IconName): React.JSX.Element {
    let element = elements.get(name);
    if (!element) {
        element = <Icon name={name} />;
        elements.set(name, element);
    }
    return element;
}
