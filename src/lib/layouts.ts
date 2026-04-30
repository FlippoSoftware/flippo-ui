import type {
    BoxProps,
    CenterLayoutProps,
    ContainerLayoutProps,
    FlexChildProps,
    FlexContainerProps,
    FlexItemProps,
    FlexLayoutProps,
    GridChildProps,
    GridContainerProps,
    GridItemProps,
    GridLayoutProps,
    LayoutProps,
    MarginProps,
    OverflowProps,
    PaddingProps,
    PositionProps,
    SectionLayoutProps,
    SizingProps,
    WithStyle
} from './types';

/**
 * Result type for extract functions
 */
export type ExtractedLayoutProps<T, LayoutProps> = {
    style: React.CSSProperties;
    otherProps: Omit<T, keyof LayoutProps | 'style'>;
};

/**
 * Extract flex child props from component props and convert to style
 */
export function extractFlexChildProps<T extends FlexChildProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, FlexChildProps> {
    const {
        grow,
        shrink,
        basis,
        flex,
        alignSelf,
        order,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        flexGrow: grow,
        flexShrink: shrink,
        flexBasis: basis,
        flex,
        alignSelf,
        order,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof FlexChildProps | 'style'> };
}

/**
 * Extract grid child props from component props and convert to style
 */
export function extractGridChildProps<T extends GridChildProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, GridChildProps> {
    const {
        gridColumn,
        gridColumnStart,
        gridColumnEnd,
        gridRow,
        gridRowStart,
        gridRowEnd,
        gridArea,
        justifySelf,
        alignSelf,
        placeSelf,
        order,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        gridColumn,
        gridColumnStart,
        gridColumnEnd,
        gridRow,
        gridRowStart,
        gridRowEnd,
        gridArea,
        justifySelf,
        alignSelf,
        placeSelf,
        order,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof GridChildProps | 'style'> };
}

/**
 * Extract flex container props from component props and convert to style
 */
export function extractFlexContainerProps<T extends FlexContainerProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, FlexContainerProps> {
    const {
        inline,
        direction,
        wrap,
        flow,
        justify,
        align,
        alignContent,
        gap,
        rowGap,
        columnGap,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: direction,
        flexWrap: wrap,
        flexFlow: flow,
        justifyContent: justify,
        alignItems: align,
        alignContent,
        gap,
        rowGap,
        columnGap,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof FlexContainerProps | 'style'> };
}

/**
 * Extract grid container props from component props and convert to style
 */
export function extractGridContainerProps<T extends GridContainerProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, GridContainerProps> {
    const {
        inline,
        columns,
        rows,
        areas,
        template,
        autoColumns,
        autoRows,
        autoFlow,
        justifyItems,
        align,
        placeItems,
        justify,
        alignContent,
        placeContent,
        gap,
        rowGap,
        columnGap,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        display: inline ? 'inline-grid' : 'grid',
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gridTemplateAreas: areas,
        gridTemplate: template,
        gridAutoColumns: autoColumns,
        gridAutoRows: autoRows,
        gridAutoFlow: autoFlow,
        justifyItems,
        alignItems: align,
        placeItems,
        justifyContent: justify,
        alignContent,
        placeContent,
        gap,
        rowGap,
        columnGap,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof GridContainerProps | 'style'> };
}

/**
 * Extract flex item props (container + child) from component props
 */
export function extractFlexItemProps<T extends FlexItemProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, FlexItemProps> {
    const {
        // Container
        inline,
        direction,
        wrap,
        flow,
        justify,
        align,
        alignContent,
        gap,
        rowGap,
        columnGap,
        // Child
        grow,
        shrink,
        basis,
        flex,
        alignSelf,
        order,
        // Style
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        // Container
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: direction,
        flexWrap: wrap,
        flexFlow: flow,
        justifyContent: justify,
        alignItems: align,
        alignContent,
        gap,
        rowGap,
        columnGap,
        // Child
        flexGrow: grow,
        flexShrink: shrink,
        flexBasis: basis,
        flex,
        alignSelf,
        order,
        // User style (overrides)
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof FlexItemProps | 'style'> };
}

/**
 * Extract grid item props (container + child) from component props
 */
export function extractGridItemProps<T extends GridItemProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, GridItemProps> {
    const {
        // Container
        inline,
        columns,
        rows,
        areas,
        template,
        autoColumns,
        autoRows,
        autoFlow,
        justifyItems,
        align,
        placeItems,
        justify,
        alignContent,
        placeContent,
        gap,
        rowGap,
        columnGap,
        // Child
        gridColumn,
        gridColumnStart,
        gridColumnEnd,
        gridRow,
        gridRowStart,
        gridRowEnd,
        gridArea,
        justifySelf,
        alignSelf,
        placeSelf,
        order,
        // Style
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        // Container
        display: inline ? 'inline-grid' : 'grid',
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gridTemplateAreas: areas,
        gridTemplate: template,
        gridAutoColumns: autoColumns,
        gridAutoRows: autoRows,
        gridAutoFlow: autoFlow,
        justifyItems,
        alignItems: align,
        placeItems,
        justifyContent: justify,
        alignContent,
        placeContent,
        gap,
        rowGap,
        columnGap,
        // Child
        gridColumn,
        gridColumnStart,
        gridColumnEnd,
        gridRow,
        gridRowStart,
        gridRowEnd,
        gridArea,
        justifySelf,
        alignSelf,
        placeSelf,
        order,
        // User style (overrides)
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof GridItemProps | 'style'> };
}

/**
 * Keys for extracting layout props from component props
 */
export const FLEX_CHILD_PROPS_KEYS: (keyof FlexChildProps)[] = [
    'grow',
    'shrink',
    'basis',
    'flex',
    'alignSelf',
    'order'
];

export const GRID_CHILD_PROPS_KEYS: (keyof GridChildProps)[] = [
    'gridColumn',
    'gridColumnStart',
    'gridColumnEnd',
    'gridRow',
    'gridRowStart',
    'gridRowEnd',
    'gridArea',
    'justifySelf',
    'alignSelf',
    'placeSelf',
    'order'
];

export const FLEX_CONTAINER_PROPS_KEYS: (keyof FlexContainerProps)[] = [
    'inline',
    'direction',
    'wrap',
    'flow',
    'justify',
    'align',
    'alignContent',
    'gap',
    'rowGap',
    'columnGap'
];

export const GRID_CONTAINER_PROPS_KEYS: (keyof GridContainerProps)[] = [
    'inline',
    'columns',
    'rows',
    'areas',
    'template',
    'autoColumns',
    'autoRows',
    'autoFlow',
    'justifyItems',
    'align',
    'placeItems',
    'justify',
    'alignContent',
    'placeContent',
    'gap',
    'rowGap',
    'columnGap'
];

// ============================================================================
// Layout Props Extract Functions (Radix-style)
// ============================================================================

/**
 * Extract margin props and convert to style
 */
export function extractMarginProps<T extends MarginProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, MarginProps> {
    const {
        m,
        mx,
        my,
        mt,
        mr,
        mb,
        ml,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        margin: m,
        marginTop: mt ?? my,
        marginRight: mr ?? mx,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof MarginProps | 'style'> };
}

/**
 * Extract padding props and convert to style
 */
export function extractPaddingProps<T extends PaddingProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, PaddingProps> {
    const {
        p,
        px,
        py,
        pt,
        pr,
        pb,
        pl,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        padding: p,
        paddingTop: pt ?? py,
        paddingRight: pr ?? px,
        paddingBottom: pb ?? py,
        paddingLeft: pl ?? px,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof PaddingProps | 'style'> };
}

/**
 * Extract sizing props and convert to style
 */
export function extractSizingProps<T extends SizingProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, SizingProps> {
    const {
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof SizingProps | 'style'> };
}

/**
 * Extract position props and convert to style
 */
export function extractPositionProps<T extends PositionProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, PositionProps> {
    const {
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof PositionProps | 'style'> };
}

/**
 * Extract overflow props and convert to style
 */
export function extractOverflowProps<T extends OverflowProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, OverflowProps> {
    const {
        overflow,
        overflowX,
        overflowY,
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        overflow,
        overflowX,
        overflowY,
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof OverflowProps | 'style'> };
}

/**
 * Extract all layout props (for Box component)
 */
export function extractLayoutProps<T extends LayoutProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, LayoutProps> {
    const {
        // Margin
        m,
        mx,
        my,
        mt,
        mr,
        mb,
        ml,
        // Padding
        p,
        px,
        py,
        pt,
        pr,
        pb,
        pl,
        // Sizing
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        // Position
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        // Overflow
        overflow,
        overflowX,
        overflowY,
        // Display
        display,
        // Style
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        // Display
        display,
        // Margin
        margin: m,
        marginTop: mt ?? my,
        marginRight: mr ?? mx,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        // Padding
        padding: p,
        paddingTop: pt ?? py,
        paddingRight: pr ?? px,
        paddingBottom: pb ?? py,
        paddingLeft: pl ?? px,
        // Sizing
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        // Position
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        // Overflow
        overflow,
        overflowX,
        overflowY,
        // User style
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof LayoutProps | 'style'> };
}

/**
 * Extract Box props (layout + flex child + grid child)
 */
export function extractBoxProps<T extends BoxProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, BoxProps> {
    const {
        // Margin
        m,
        mx,
        my,
        mt,
        mr,
        mb,
        ml,
        // Padding
        p,
        px,
        py,
        pt,
        pr,
        pb,
        pl,
        // Sizing
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        // Position
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        // Overflow
        overflow,
        overflowX,
        overflowY,
        // Display
        display,
        // Flex child
        grow,
        shrink,
        basis,
        flex,
        alignSelf,
        order,
        // Grid child
        gridColumn,
        gridColumnStart,
        gridColumnEnd,
        gridRow,
        gridRowStart,
        gridRowEnd,
        gridArea,
        justifySelf,
        placeSelf,
        // Style
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        // Display
        display,
        // Margin
        margin: m,
        marginTop: mt ?? my,
        marginRight: mr ?? mx,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        // Padding
        padding: p,
        paddingTop: pt ?? py,
        paddingRight: pr ?? px,
        paddingBottom: pb ?? py,
        paddingLeft: pl ?? px,
        // Sizing
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        // Position
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        // Overflow
        overflow,
        overflowX,
        overflowY,
        // Flex child
        flexGrow: grow,
        flexShrink: shrink,
        flexBasis: basis,
        flex,
        alignSelf,
        order,
        // Grid child
        gridColumn,
        gridColumnStart,
        gridColumnEnd,
        gridRow,
        gridRowStart,
        gridRowEnd,
        gridArea,
        justifySelf,
        placeSelf,
        // User style
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof BoxProps | 'style'> };
}

/**
 * Extract Flex layout props (flex container + flex child + layout props)
 */
export function extractFlexLayoutProps<T extends FlexLayoutProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, FlexLayoutProps> {
    const {
        // Flex container
        inline,
        direction,
        wrap,
        flow,
        justify,
        align,
        alignContent,
        gap,
        rowGap,
        columnGap,
        // Flex child
        grow,
        shrink,
        basis,
        flex,
        alignSelf,
        order,
        // Margin
        m,
        mx,
        my,
        mt,
        mr,
        mb,
        ml,
        // Padding
        p,
        px,
        py,
        pt,
        pr,
        pb,
        pl,
        // Sizing
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        // Position
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        // Overflow
        overflow,
        overflowX,
        overflowY,
        // Style
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        // Flex container
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: direction,
        flexWrap: wrap,
        flexFlow: flow,
        justifyContent: justify,
        alignItems: align,
        alignContent,
        gap,
        rowGap,
        columnGap,
        // Flex child
        flexGrow: grow,
        flexShrink: shrink,
        flexBasis: basis,
        flex,
        alignSelf,
        order,
        // Margin
        margin: m,
        marginTop: mt ?? my,
        marginRight: mr ?? mx,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        // Padding
        padding: p,
        paddingTop: pt ?? py,
        paddingRight: pr ?? px,
        paddingBottom: pb ?? py,
        paddingLeft: pl ?? px,
        // Sizing
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        // Position
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        // Overflow
        overflow,
        overflowX,
        overflowY,
        // User style
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof FlexLayoutProps | 'style'> };
}

/**
 * Extract Grid layout props (grid container + grid child + layout props)
 */
export function extractGridLayoutProps<T extends GridLayoutProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, GridLayoutProps> {
    const {
        // Grid container
        inline,
        columns,
        rows,
        areas,
        template,
        autoColumns,
        autoRows,
        autoFlow,
        justifyItems,
        align,
        placeItems,
        justify,
        alignContent,
        placeContent,
        gap,
        rowGap,
        columnGap,
        // Grid child
        gridColumn,
        gridColumnStart,
        gridColumnEnd,
        gridRow,
        gridRowStart,
        gridRowEnd,
        gridArea,
        justifySelf,
        alignSelf,
        placeSelf,
        order,
        // Margin
        m,
        mx,
        my,
        mt,
        mr,
        mb,
        ml,
        // Padding
        p,
        px,
        py,
        pt,
        pr,
        pb,
        pl,
        // Sizing
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        // Position
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        // Overflow
        overflow,
        overflowX,
        overflowY,
        // Style
        style: styleProp,
        ...otherProps
    } = props;

    const style: React.CSSProperties = {
        // Grid container
        display: inline ? 'inline-grid' : 'grid',
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gridTemplateAreas: areas,
        gridTemplate: template,
        gridAutoColumns: autoColumns,
        gridAutoRows: autoRows,
        gridAutoFlow: autoFlow,
        justifyItems,
        alignItems: align,
        placeItems,
        justifyContent: justify,
        alignContent,
        placeContent,
        gap,
        rowGap,
        columnGap,
        // Grid child
        gridColumn,
        gridColumnStart,
        gridColumnEnd,
        gridRow,
        gridRowStart,
        gridRowEnd,
        gridArea,
        justifySelf,
        alignSelf,
        placeSelf,
        order,
        // Margin
        margin: m,
        marginTop: mt ?? my,
        marginRight: mr ?? mx,
        marginBottom: mb ?? my,
        marginLeft: ml ?? mx,
        // Padding
        padding: p,
        paddingTop: pt ?? py,
        paddingRight: pr ?? px,
        paddingBottom: pb ?? py,
        paddingLeft: pl ?? px,
        // Sizing
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        // Position
        position,
        inset,
        top,
        right,
        bottom,
        left,
        zIndex,
        // Overflow
        overflow,
        overflowX,
        overflowY,
        // User style
        ...styleProp
    };

    return { style, otherProps: otherProps as Omit<T, keyof GridLayoutProps | 'style'> };
}

/**
 * Section size to padding mapping
 */
const SECTION_SIZE_MAP: Record<string, string> = {
    sm: 'var(--f-spacing-6)',
    md: 'var(--f-spacing-10)',
    lg: 'var(--f-spacing-16)'
};

/**
 * Extract Section layout props
 */
export function extractSectionLayoutProps<T extends SectionLayoutProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, SectionLayoutProps> {
    const { size = 'md', ...restProps } = props;
    const { style: layoutStyle, otherProps } = extractLayoutProps(restProps);

    const sectionPadding = SECTION_SIZE_MAP[size] ?? SECTION_SIZE_MAP.md;

    const style: React.CSSProperties = {
        paddingTop: sectionPadding,
        paddingBottom: sectionPadding,
        ...layoutStyle
    };

    return { style, otherProps: otherProps as Omit<T, keyof SectionLayoutProps | 'style'> };
}

/**
 * Container size to max-width mapping
 */
const CONTAINER_SIZE_MAP: Record<string, string> = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%'
};

/**
 * Extract Container layout props
 */
export function extractContainerLayoutProps<T extends ContainerLayoutProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, ContainerLayoutProps> {
    const { size = 'lg', ...restProps } = props;
    const { style: layoutStyle, otherProps } = extractLayoutProps(restProps);

    const containerMaxWidth = CONTAINER_SIZE_MAP[size] ?? CONTAINER_SIZE_MAP.lg;

    const style: React.CSSProperties = {
        width: '100%',
        maxWidth: containerMaxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
        ...layoutStyle
    };

    return { style, otherProps: otherProps as Omit<T, keyof ContainerLayoutProps | 'style'> };
}

/**
 * Extract Center layout props (flexbox centering container)
 */
export function extractCenterLayoutProps<T extends CenterLayoutProps & WithStyle>(
    props: T
): ExtractedLayoutProps<T, CenterLayoutProps> {
    const { style: layoutStyle, otherProps } = extractLayoutProps(props);

    const style: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...layoutStyle
    };

    return { style, otherProps: otherProps as Omit<T, keyof CenterLayoutProps | 'style'> };
}
