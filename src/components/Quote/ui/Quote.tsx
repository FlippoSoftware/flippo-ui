import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';

import type { PolymorphicComponentPropsWithRef } from '~@lib/types';

const state = {
    slot: 'quote'
};

/**
 * Quote — inline quotation wrapper. Renders `<q>` by default.
 * The browser automatically adds locale-aware opening/closing quotation marks via CSS `content`.
 *
 * @example
 * <Text>He said <Quote>hello world</Quote> and left.</Text>
 *
 * @example
 * // With a citation URL
 * <Quote cite="https://example.com">Cited text</Quote>
 */
export function Quote(props: Quote.Props) {
    const { as: Tag = 'q', ref, ...otherProps } = props;

    const element = useRender({
        defaultTagName: Tag,
        ref,
        props: otherProps,
        state
    });

    return element;
}

export namespace Quote {
    export type Props<ElementType extends React.ElementType = 'q'> = PolymorphicComponentPropsWithRef<ElementType>;
}
