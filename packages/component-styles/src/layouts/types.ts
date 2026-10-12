import type { Properties } from 'csstype';

type CSSProperties = Properties<string | number>;
/**
 * CSS properties for flex container children
 */
export type FlexChildProps = {
    /** CSS flex-grow */
    grow?: CSSProperties['flexGrow'];
    /** CSS flex-shrink */
    shrink?: CSSProperties['flexShrink'];
    /** CSS flex-basis */
    basis?: CSSProperties['flexBasis'];
    /** CSS flex (shorthand) */
    flex?: CSSProperties['flex'];
    /** CSS align-self */
    alignSelf?: CSSProperties['alignSelf'];
    /** CSS order */
    order?: CSSProperties['order'];
};

/**
 * CSS properties for grid container children
 */
export type GridChildProps = {
    /** Column span shorthand — sets gridColumn: 'span N'. Overridden by explicit gridColumn prop. */
    colSpan?: number;
    /** Row span shorthand — sets gridRow: 'span N'. Overridden by explicit gridRow prop. */
    rowSpan?: number;
    /** CSS grid-column */
    gridColumn?: CSSProperties['gridColumn'];
    /** CSS grid-column-start */
    gridColumnStart?: CSSProperties['gridColumnStart'];
    /** CSS grid-column-end */
    gridColumnEnd?: CSSProperties['gridColumnEnd'];
    /** CSS grid-row */
    gridRow?: CSSProperties['gridRow'];
    /** CSS grid-row-start */
    gridRowStart?: CSSProperties['gridRowStart'];
    /** CSS grid-row-end */
    gridRowEnd?: CSSProperties['gridRowEnd'];
    /** CSS grid-area */
    gridArea?: CSSProperties['gridArea'];
    /** CSS justify-self */
    justifySelf?: CSSProperties['justifySelf'];
    /** CSS align-self */
    alignSelf?: CSSProperties['alignSelf'];
    /** CSS place-self */
    placeSelf?: CSSProperties['placeSelf'];
    /** CSS order */
    order?: CSSProperties['order'];
};

/**
 * CSS properties for flex container
 */
export type FlexContainerProps = {
    /** CSS display: flex | inline-flex */
    inline?: boolean;
    /** CSS flex-direction */
    direction?: CSSProperties['flexDirection'];
    /** CSS flex-wrap */
    wrap?: CSSProperties['flexWrap'];
    /** CSS flex-flow (shorthand) */
    flow?: CSSProperties['flexFlow'];
    /** CSS justify-content */
    justify?: CSSProperties['justifyContent'];
    /** CSS align-items */
    align?: CSSProperties['alignItems'];
    /** CSS align-content */
    alignContent?: CSSProperties['alignContent'];
    /** CSS gap */
    gap?: CSSProperties['gap'];
    /** CSS row-gap */
    rowGap?: CSSProperties['rowGap'];
    /** CSS column-gap */
    columnGap?: CSSProperties['columnGap'];
};

/**
 * CSS properties for grid container
 */
export type GridContainerProps = {
    /** CSS display: grid | inline-grid */
    inline?: boolean;
    /** CSS grid-template-columns. Number generates repeat(N, 1fr); string is raw CSS. */
    columns?: number | CSSProperties['gridTemplateColumns'];
    /** CSS grid-template-rows */
    rows?: CSSProperties['gridTemplateRows'];
    /** CSS grid-template-areas */
    areas?: CSSProperties['gridTemplateAreas'];
    /** CSS grid-template (shorthand) */
    template?: CSSProperties['gridTemplate'];
    /** CSS grid-auto-columns */
    autoColumns?: CSSProperties['gridAutoColumns'];
    /** CSS grid-auto-rows */
    autoRows?: CSSProperties['gridAutoRows'];
    /** CSS grid-auto-flow */
    autoFlow?: CSSProperties['gridAutoFlow'];
    /** CSS justify-items */
    justifyItems?: CSSProperties['justifyItems'];
    /** CSS align-items */
    align?: CSSProperties['alignItems'];
    /** CSS place-items */
    placeItems?: CSSProperties['placeItems'];
    /** CSS justify-content */
    justify?: CSSProperties['justifyContent'];
    /** CSS align-content */
    alignContent?: CSSProperties['alignContent'];
    /** CSS place-content */
    placeContent?: CSSProperties['placeContent'];
    /** CSS gap */
    gap?: CSSProperties['gap'];
    /** CSS row-gap */
    rowGap?: CSSProperties['rowGap'];
    /** CSS column-gap */
    columnGap?: CSSProperties['columnGap'];
    /** Spacing between items using design system scale (spacing={2} → var(--f-spacing-2)). Overridden by explicit gap prop. */
    spacing?: number | CSSProperties['gap'];
};

/**
 * Combined props for element that is both a flex/grid container and a child
 */
export type FlexItemProps = FlexContainerProps & FlexChildProps;
export type GridItemProps = GridContainerProps & GridChildProps;

/**
 * Props with optional style
 */
export type WithStyle = { style?: CSSProperties };

// ============================================================================
// Layout Props (Radix-style)
// ============================================================================

/**
 * Margin props (shorthand like Radix/Tailwind)
 */
export type MarginProps = {
    /** Margin on all sides */
    m?: CSSProperties['margin'];
    /** Margin horizontal (left & right) */
    mx?: CSSProperties['marginLeft'];
    /** Margin vertical (top & bottom) */
    my?: CSSProperties['marginTop'];
    /** Margin top */
    mt?: CSSProperties['marginTop'];
    /** Margin right */
    mr?: CSSProperties['marginRight'];
    /** Margin bottom */
    mb?: CSSProperties['marginBottom'];
    /** Margin left */
    ml?: CSSProperties['marginLeft'];
};

/**
 * Padding props (shorthand like Radix/Tailwind)
 */
export type PaddingProps = {
    /** Padding on all sides */
    p?: CSSProperties['padding'];
    /** Padding horizontal (left & right) */
    px?: CSSProperties['paddingLeft'];
    /** Padding vertical (top & bottom) */
    py?: CSSProperties['paddingTop'];
    /** Padding top */
    pt?: CSSProperties['paddingTop'];
    /** Padding right */
    pr?: CSSProperties['paddingRight'];
    /** Padding bottom */
    pb?: CSSProperties['paddingBottom'];
    /** Padding left */
    pl?: CSSProperties['paddingLeft'];
};

/**
 * Sizing props
 */
export type SizingProps = {
    /** CSS width */
    width?: CSSProperties['width'];
    /** CSS height */
    height?: CSSProperties['height'];
    /** CSS min-width */
    minWidth?: CSSProperties['minWidth'];
    /** CSS max-width */
    maxWidth?: CSSProperties['maxWidth'];
    /** CSS min-height */
    minHeight?: CSSProperties['minHeight'];
    /** CSS max-height */
    maxHeight?: CSSProperties['maxHeight'];
};

/**
 * Position props
 */
export type PositionProps = {
    /** CSS position */
    position?: CSSProperties['position'];
    /** CSS inset (shorthand for top/right/bottom/left) */
    inset?: CSSProperties['inset'];
    /** CSS top */
    top?: CSSProperties['top'];
    /** CSS right */
    right?: CSSProperties['right'];
    /** CSS bottom */
    bottom?: CSSProperties['bottom'];
    /** CSS left */
    left?: CSSProperties['left'];
    /** CSS z-index */
    zIndex?: CSSProperties['zIndex'];
};

/**
 * Overflow props
 */
export type OverflowProps = {
    /** CSS overflow */
    overflow?: CSSProperties['overflow'];
    /** CSS overflow-x */
    overflowX?: CSSProperties['overflowX'];
    /** CSS overflow-y */
    overflowY?: CSSProperties['overflowY'];
};

/**
 * Display props
 */
export type DisplayProps = {
    /** CSS display */
    display?: CSSProperties['display'];
};

/**
 * Combined layout props for Box component (like Radix)
 */
export type LayoutProps = MarginProps & PaddingProps & SizingProps & PositionProps & OverflowProps & DisplayProps;

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
export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * Section size presets
 */
export type SectionSize = 'sm' | 'md' | 'lg' | 'xl';

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
    /** Horizontal alignment of the container (default: 'center') */
    align?: 'left' | 'center' | 'right';
};

/**
 * Center props - flexbox centering container
 */
export type CenterLayoutProps = Omit<LayoutProps, 'display'>;
