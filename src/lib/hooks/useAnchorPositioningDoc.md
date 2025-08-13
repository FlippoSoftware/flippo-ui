# `useAnchorPositioning` Hook Documentation

## Overview

The `useAnchorPositioning` hook provides positioning logic for floating UI elements (tooltips, popovers, etc.)
relative to an anchor element. It handles:

- Positioning calculations
- Collision avoidance
- Arrow positioning
- Responsive repositionings
- RTL language support

## Key Features

1. **Anchor Positioning**: Positions floating elements relative to anchor elements
2. **Collision Handling**: Automatically avoids viewport boundaries
3. **Arrow Positioning**: Calculates arrow position and centering
4. **RTL Support**: Handles right-to-left language layouts
5. **Dynamic Updates**: Repositions on layout changes

## Parameters

```ts
type Parameters = {
    anchor?: Element | VirtualElement | RefObject<Element | null> | (() => Element |               VirtualElement | null);
    positionMethod?: 'absolute' | 'fixed'; // CSS positioning method
    side?: TSide; // Positioning side (top/bottom/left/right/inline-start/inline-end)
    sideOffset?: number | OffsetFunction; // Distance from anchor
    align?: 'start' | 'end' | 'center'; // Alignment relative to anchor
    alignOffset?: number | OffsetFunction; // Offset along alignment axis
    collisionBoundary?: TBoundary; // Boundary for collision detection
    collisionPadding?: Padding; // Padding from collision boundary
    sticky?: boolean; // Maintain position when anchor scrolls out of view
    arrowPadding?: number; // Minimum padding between arrow and floating element edges
    trackAnchor?: boolean; // Track anchor position changes
    collisionAvoidance?: CollisionAvoidance; // Collision handling strategy
}
```

## Return Value

```ts
 type ReturnValue = {
    positionerStyles: React.CSSProperties; // Styles for positioning element
    arrowStyles: React.CSSProperties; // Styles for arrow element
    arrowRef: RefObject<Element | null>; // Ref for arrow element
    arrowUncentered: boolean; // If arrow is offset due to collisions
    side: TSide; // Actual rendered side after collision avoidance
    align: TAlign; // Actual rendered alignment
    anchorHidden: boolean; // If anchor is hidden (off-screen)
    refs: FloatingRefs; // Refs for floating elements
    context: FloatingContext; // Floating UI context
    isPositioned: boolean; // If positioning is complete
    update: () => void; // Force repositioning
}
```

## Usage Example

```js
import { useAnchorPositioning } from './useAnchorPositioning';

function Tooltip() {
    const anchorRef = useRef(null);
    const {
        positionerStyles,
        arrowStyles,
        arrowRef,
        arrowUncentered,
        side,
        align,
        anchorHidden,
        refs,
        isPositioned,
        update
    } = useAnchorPositioning({
        anchor: anchorRef,
        side: 'top',
        align: 'center',
        sideOffset: 8,
        collisionBoundary: 'clipping-ancestors',
        collisionPadding: 16,
        arrowPadding: 4,
        collisionAvoidance: {
            side: 'flip',
            align: 'shift',
            fallbackAxisSide: 'end'
        }
    });

    return (
        <>
            <button type={'button'} ref={anchorRef}>{'Anchor'}</button>

            {isPositioned && !anchorHidden && (
                <div ref={refs.setFloating} style={positionerStyles}>
                    {'Tooltip content'}
                    <div ref={arrowRef} style={arrowStyles} />
                </div>
            )}
        </>
    );
}
```

## Key Implementation Details

1. **Middleware Pipeline**:

   - `offset`: Handles main/cross axis offsets
   - `flip`: Handles collision avoidance
   - `shift`: Ensures content stays in viewport
   - `size`: Applies dimension CSS variables
   - `arrow`: Positions arrow element
   - `hide`: Handles hidden anchors
   - Custom `transformOrigin`: Calculates transform origin

2. **RTL Handling**:

   - Converts logical directions (`inline-start`/`inline-end`) to physical directions based on text direction

3. **Dynamic Updates**:

   - Uses `autoUpdate` from Floating UI to reposition on:
     - Anchor resizing
     - Viewport changes
     - Scroll events

4. **CSS Variables**:
   - `--available-width`: Available viewport width
   - `--available-height`: Available viewport height
   - `--anchor-width`: Anchor element width
   - `--anchor-height`: Anchor element height
   - `--transform-origin`: Transform origin for animations

## Best Practices

1. Always conditionally render floating content using `isPositioned` and `anchorHidden`
2. Use the `update` method when anchor content changes dynamically
3. For performance, set `trackAnchor: false` for static elements
4. Use arrow element for visual connection between anchor and floating content
5. Handle RTL languages using the `side` parameter's logical values
