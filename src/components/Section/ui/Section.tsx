import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { extractSectionLayoutProps } from '~@lib/layouts';

import type { SectionLayoutProps } from '~@lib/types';

/**
 * Section — a semantic block with vertical padding for page-level rhythm.
 *
 * Sizes (paddingBlock):
 * - sm → var(--f-spacing-6)
 * - md → var(--f-spacing-10)  (default)
 * - lg → var(--f-spacing-16)
 * - xl → var(--f-spacing-24)
 *
 * @example
 * <Section size="lg">
 *   <Container>
 *     <h2>Title</h2>
 *   </Container>
 * </Section>
 *
 * @example
 * // Hero section with extra vertical space
 * <Section size="xl" as="header">
 *   <Container size="xl">...</Container>
 * </Section>
 */
export function Section<ElementType extends keyof React.JSX.IntrinsicElements = 'section'>(
    props: Section.Props<ElementType>
) {
    const { as: Tag = 'section', ref, ...restProps } = props;

    const { style, otherProps } = extractSectionLayoutProps(restProps);

    const element = useRender({
        defaultTagName: Tag,
        ref: ref as React.Ref<Element>,
        props: [{ style }, otherProps]
    });

    return element;
}

export type SectionComponentProps<ElementType extends keyof React.JSX.IntrinsicElements = 'section'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & SectionLayoutProps
    & {
        /** HTML element to render */
        as?: ElementType;
    };

export namespace Section {
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'section'> = SectionComponentProps<ElementType>;
}
