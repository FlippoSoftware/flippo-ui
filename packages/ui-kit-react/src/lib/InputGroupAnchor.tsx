'use client';
import * as React from 'react';

/**
 * The popup of a combobox is anchored to the whole input group (the field's box) rather than the input inside it, so
 * it is as wide as the field and aligned with it. The root holds the ref, the input group fills it, the positioner
 * uses it unless it gets an `anchor` (core falls back to the input when there is no group).
 */
const AnchorContext = React.createContext<React.RefObject<HTMLElement | null> | null>(null);

export function withAnchorRoot<P extends object>(Root: (props: P) => React.ReactElement): (props: P) => React.ReactElement {
    function AnchorRoot(props: P) {
        const anchor = React.useRef<HTMLElement | null>(null);
        return (
            <AnchorContext value={anchor}>
                <Root {...props} />
            </AnchorContext>
        );
    }
    return AnchorRoot;
}

export function withAnchorTarget<P extends { ref?: React.Ref<HTMLDivElement> | undefined }, C extends (props: P) => React.ReactElement>(
    Group: C & ((props: P) => React.ReactElement)
): C {
    const Target: (props: P) => React.ReactElement = Group;
    function AnchorTarget(props: P) {
        const anchor = React.useContext(AnchorContext);
        const { ref } = props;
        const setRef = React.useCallback(
            (node: HTMLDivElement | null) => {
                if (anchor) anchor.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
            },
            [anchor, ref]
        );
        return <Target {...props} ref={setRef} />;
    }
    return AnchorTarget as unknown as C;
}

export function withAnchor<P extends { anchor?: unknown }, C extends (props: P) => React.ReactElement>(
    Positioner: C & ((props: P) => React.ReactElement)
): C {
    const Inner: (props: P) => React.ReactElement = Positioner;
    function AnchoredPositioner(props: P) {
        const anchor = React.useContext(AnchorContext);
        return <Inner {...props} anchor={props.anchor ?? anchor ?? undefined} />;
    }
    return AnchoredPositioner as unknown as C;
}
