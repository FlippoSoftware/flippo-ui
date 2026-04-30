import type { ComponentPropsWithRef, ElementType } from 'react';
import type React from 'react';

// Для экспорта полиморфных типов в других компонентах
export type PolymorphicComponentProps<
    T extends ElementType,
    Props = Record<string, unknown>
> = Props & ComponentPropsWithRef<T> & { as?: T };

export type PolymorphicComponentPropsWithRef<
    T extends ElementType = 'div',
    Props = Record<string, unknown>
> = PolymorphicComponentProps<T, Props>;

/**
 * CSS properties for flex container children
 */
export type FlexChildProps = {
    /** CSS flex-grow */
    grow?: React.CSSProperties['flexGrow'];
    /** CSS flex-shrink */
    shrink?: React.CSSProperties['flexShrink'];
    /** CSS flex-basis */
    basis?: React.CSSProperties['flexBasis'];
    /** CSS flex (shorthand) */
    flex?: React.CSSProperties['flex'];
    /** CSS align-self */
    alignSelf?: React.CSSProperties['alignSelf'];
    /** CSS order */
    order?: React.CSSProperties['order'];
};

/**
 * CSS properties for grid container children
 */
export type GridChildProps = {
    /** CSS grid-column */
    gridColumn?: React.CSSProperties['gridColumn'];
    /** CSS grid-column-start */
    gridColumnStart?: React.CSSProperties['gridColumnStart'];
    /** CSS grid-column-end */
    gridColumnEnd?: React.CSSProperties['gridColumnEnd'];
    /** CSS grid-row */
    gridRow?: React.CSSProperties['gridRow'];
    /** CSS grid-row-start */
    gridRowStart?: React.CSSProperties['gridRowStart'];
    /** CSS grid-row-end */
    gridRowEnd?: React.CSSProperties['gridRowEnd'];
    /** CSS grid-area */
    gridArea?: React.CSSProperties['gridArea'];
    /** CSS justify-self */
    justifySelf?: React.CSSProperties['justifySelf'];
    /** CSS align-self */
    alignSelf?: React.CSSProperties['alignSelf'];
    /** CSS place-self */
    placeSelf?: React.CSSProperties['placeSelf'];
    /** CSS order */
    order?: React.CSSProperties['order'];
};

/**
 * CSS properties for flex container
 */
export type FlexContainerProps = {
    /** CSS display: flex | inline-flex */
    inline?: boolean;
    /** CSS flex-direction */
    direction?: React.CSSProperties['flexDirection'];
    /** CSS flex-wrap */
    wrap?: React.CSSProperties['flexWrap'];
    /** CSS flex-flow (shorthand) */
    flow?: React.CSSProperties['flexFlow'];
    /** CSS justify-content */
    justify?: React.CSSProperties['justifyContent'];
    /** CSS align-items */
    align?: React.CSSProperties['alignItems'];
    /** CSS align-content */
    alignContent?: React.CSSProperties['alignContent'];
    /** CSS gap */
    gap?: React.CSSProperties['gap'];
    /** CSS row-gap */
    rowGap?: React.CSSProperties['rowGap'];
    /** CSS column-gap */
    columnGap?: React.CSSProperties['columnGap'];
};

/**
 * CSS properties for grid container
 */
export type GridContainerProps = {
    /** CSS display: grid | inline-grid */
    inline?: boolean;
    /** CSS grid-template-columns */
    columns?: React.CSSProperties['gridTemplateColumns'];
    /** CSS grid-template-rows */
    rows?: React.CSSProperties['gridTemplateRows'];
    /** CSS grid-template-areas */
    areas?: React.CSSProperties['gridTemplateAreas'];
    /** CSS grid-template (shorthand) */
    template?: React.CSSProperties['gridTemplate'];
    /** CSS grid-auto-columns */
    autoColumns?: React.CSSProperties['gridAutoColumns'];
    /** CSS grid-auto-rows */
    autoRows?: React.CSSProperties['gridAutoRows'];
    /** CSS grid-auto-flow */
    autoFlow?: React.CSSProperties['gridAutoFlow'];
    /** CSS justify-items */
    justifyItems?: React.CSSProperties['justifyItems'];
    /** CSS align-items */
    align?: React.CSSProperties['alignItems'];
    /** CSS place-items */
    placeItems?: React.CSSProperties['placeItems'];
    /** CSS justify-content */
    justify?: React.CSSProperties['justifyContent'];
    /** CSS align-content */
    alignContent?: React.CSSProperties['alignContent'];
    /** CSS place-content */
    placeContent?: React.CSSProperties['placeContent'];
    /** CSS gap */
    gap?: React.CSSProperties['gap'];
    /** CSS row-gap */
    rowGap?: React.CSSProperties['rowGap'];
    /** CSS column-gap */
    columnGap?: React.CSSProperties['columnGap'];
};

/**
 * Combined props for element that is both a flex/grid container and a child
 */
export type FlexItemProps = FlexContainerProps & FlexChildProps;
export type GridItemProps = GridContainerProps & GridChildProps;

/**
 * Props with optional style
 */
export type WithStyle = { style?: React.CSSProperties };

// ============================================================================
// Layout Props (Radix-style)
// ============================================================================

/**
 * Margin props (shorthand like Radix/Tailwind)
 */
export type MarginProps = {
    /** Margin on all sides */
    m?: React.CSSProperties['margin'];
    /** Margin horizontal (left & right) */
    mx?: React.CSSProperties['marginLeft'];
    /** Margin vertical (top & bottom) */
    my?: React.CSSProperties['marginTop'];
    /** Margin top */
    mt?: React.CSSProperties['marginTop'];
    /** Margin right */
    mr?: React.CSSProperties['marginRight'];
    /** Margin bottom */
    mb?: React.CSSProperties['marginBottom'];
    /** Margin left */
    ml?: React.CSSProperties['marginLeft'];
};

/**
 * Padding props (shorthand like Radix/Tailwind)
 */
export type PaddingProps = {
    /** Padding on all sides */
    p?: React.CSSProperties['padding'];
    /** Padding horizontal (left & right) */
    px?: React.CSSProperties['paddingLeft'];
    /** Padding vertical (top & bottom) */
    py?: React.CSSProperties['paddingTop'];
    /** Padding top */
    pt?: React.CSSProperties['paddingTop'];
    /** Padding right */
    pr?: React.CSSProperties['paddingRight'];
    /** Padding bottom */
    pb?: React.CSSProperties['paddingBottom'];
    /** Padding left */
    pl?: React.CSSProperties['paddingLeft'];
};

/**
 * Sizing props
 */
export type SizingProps = {
    /** CSS width */
    width?: React.CSSProperties['width'];
    /** CSS height */
    height?: React.CSSProperties['height'];
    /** CSS min-width */
    minWidth?: React.CSSProperties['minWidth'];
    /** CSS max-width */
    maxWidth?: React.CSSProperties['maxWidth'];
    /** CSS min-height */
    minHeight?: React.CSSProperties['minHeight'];
    /** CSS max-height */
    maxHeight?: React.CSSProperties['maxHeight'];
};

/**
 * Position props
 */
export type PositionProps = {
    /** CSS position */
    position?: React.CSSProperties['position'];
    /** CSS inset (shorthand for top/right/bottom/left) */
    inset?: React.CSSProperties['inset'];
    /** CSS top */
    top?: React.CSSProperties['top'];
    /** CSS right */
    right?: React.CSSProperties['right'];
    /** CSS bottom */
    bottom?: React.CSSProperties['bottom'];
    /** CSS left */
    left?: React.CSSProperties['left'];
    /** CSS z-index */
    zIndex?: React.CSSProperties['zIndex'];
};

/**
 * Overflow props
 */
export type OverflowProps = {
    /** CSS overflow */
    overflow?: React.CSSProperties['overflow'];
    /** CSS overflow-x */
    overflowX?: React.CSSProperties['overflowX'];
    /** CSS overflow-y */
    overflowY?: React.CSSProperties['overflowY'];
};

/**
 * Display props
 */
export type DisplayProps = {
    /** CSS display */
    display?: React.CSSProperties['display'];
};

/**
 * Combined layout props for Box component (like Radix)
 */
export type LayoutProps = MarginProps
  & PaddingProps
  & SizingProps
  & PositionProps
  & OverflowProps
  & DisplayProps;

/**
 * Box props - layout container with all layout props
 */
export type BoxProps = LayoutProps & FlexChildProps & GridChildProps;

/**
 * Flex component props - flex container + layout props (without display since flex sets it)
 */
export type FlexLayoutProps = FlexItemProps & Omit<LayoutProps, 'display'>;

/**
 * Grid component props - grid container + layout props (without display since grid sets it)
 */
export type GridLayoutProps = GridItemProps & Omit<LayoutProps, 'display'>;

/**
 * Container size presets
 */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Section size presets
 */
export type SectionSize = 'sm' | 'md' | 'lg';

/**
 * Section props - vertical spacing section
 */
export type SectionLayoutProps = LayoutProps & {
    /** Section vertical padding size */
    size?: SectionSize;
};

/**
 * Container props - centered max-width container
 */
export type ContainerLayoutProps = LayoutProps & {
    /** Container max-width size */
    size?: ContainerSize;
};

/**
 * Center props - flexbox centering container
 */
export type CenterLayoutProps = Omit<LayoutProps, 'display'>;
