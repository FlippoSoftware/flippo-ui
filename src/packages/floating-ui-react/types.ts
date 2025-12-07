import type * as React from 'react';

import type {
    UseFloatingReturn as UsePositionFloatingReturn,
    UseFloatingOptions as UsePositionOptions,
    VirtualElement
} from '@floating-ui/react-dom';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';

import type { FloatingRootStore } from './components/FloatingRootStore';
import type { FloatingTreeStore } from './components/FloatingTreeStore';
import type { ExtendedUserProps } from './hooks/useInteractions';

export * from '.';
export type { FloatingDelayGroupProps } from './components/FloatingDelayGroup';
export type { FloatingFocusManagerProps } from './components/FloatingFocusManager';
export type { UseFloatingPortalNodeProps } from './components/FloatingPortal';
export type { FloatingNodeProps, FloatingTreeProps } from './components/FloatingTree';
export type { UseClientPointProps } from './hooks/useClientPoint';
export type { UseDismissProps } from './hooks/useDismiss';
export type { UseFloatingRootContextOptions } from './hooks/useFloatingRootContext';
export type { UseFocusProps } from './hooks/useFocus';
export type { HandleClose, HandleCloseContext, UseHoverProps } from './hooks/useHover';
export type { UseHoverFloatingInteractionProps } from './hooks/useHoverFloatingInteraction';
export type { UseHoverReferenceInteractionProps } from './hooks/useHoverReferenceInteraction';
export type { UseInteractionsReturn } from './hooks/useInteractions';
export type { UseListNavigationProps } from './hooks/useListNavigation';
export type { UseRoleProps } from './hooks/useRole';
export type { UseTypeaheadProps } from './hooks/useTypeahead';
export type { SafePolygonOptions } from './safePolygon';
export type {
    AlignedPlacement,
    Alignment,
    ArrowOptions,
    AutoPlacementOptions,
    AutoUpdateOptions,
    Axis,
    Boundary,
    ClientRectObject,
    ComputePositionConfig,
    ComputePositionReturn,
    Coords,
    DetectOverflowOptions,
    Dimensions,
    ElementContext,
    ElementRects,
    Elements,
    FlipOptions,
    FloatingElement,
    HideOptions,
    InlineOptions,
    Length,
    Middleware,
    MiddlewareArguments,
    MiddlewareData,
    MiddlewareReturn,
    MiddlewareState,
    NodeScroll,
    OffsetOptions,
    Padding,
    Placement,
    Platform,
    Rect,
    ReferenceElement,
    RootBoundary,
    ShiftOptions,
    Side,
    SideObject,
    SizeOptions,
    Strategy,
    VirtualElement
} from '@floating-ui/react-dom';
export {
    arrow,
    autoPlacement,
    autoUpdate,
    computePosition,
    detectOverflow,
    flip,
    getOverflowAncestors,
    hide,
    inline,
    limitShift,
    offset,
    platform,
    shift,
    size
} from '@floating-ui/react-dom';

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type Delay = number | Partial<{ open: number; close: number }>;

export type NarrowedElement<T> = T extends Element ? T : Element;

export type ExtendedRefs = {
    reference: React.RefObject<ReferenceType | null>;
    floating: React.RefObject<HTMLElement | null>;
    domReference: React.RefObject<NarrowedElement<ReferenceType> | null>;
    setReference: (node: ReferenceType | null) => void;
    setFloating: (node: HTMLElement | null) => void;
    setPositionReference: (node: ReferenceType | null) => void;
};

export type ExtendedElements = {
    reference: ReferenceType | null;
    floating: HTMLElement | null;
    domReference: NarrowedElement<ReferenceType> | null;
};

export type FloatingEvents = {
    emit: <T extends string>(event: T, data?: any) => void;
    on: (event: string, handler: (data: any) => void) => void;
    off: (event: string, handler: (data: any) => void) => void;
};

export type ContextData = {
    openEvent?: Event;
    floatingContext?: FloatingContext;
    /** @deprecated use `onTypingChange` prop in `useTypeahead` */
    typing?: boolean;
    [key: string]: any;
};

export type FloatingRootContext<Reason extends string = string> = FloatingRootStore<Reason>;

export type FloatingContext<Reason extends string = string> = Omit<
    UsePositionFloatingReturn<ReferenceType>,
  'refs' | 'elements'
> & {
    open: boolean;
    onOpenChange: (open: boolean, eventDetails: HeadlessUIChangeEventDetails<Reason>) => void;
    events: FloatingEvents;
    dataRef: React.RefObject<ContextData>;
    nodeId: string | undefined;
    floatingId: string | undefined;
    refs: ExtendedRefs;
    elements: ExtendedElements;
    rootStore: FloatingRootContext<Reason>;
};

export type FloatingNodeType = {
    id: string | undefined;
    parentId: string | null;
    context?: FloatingContext;
};

export type FloatingTreeType = FloatingTreeStore;

export type ElementProps = {
    reference?: React.HTMLProps<Element>;
    floating?: React.HTMLProps<HTMLElement>;
    item?:
      | React.HTMLProps<HTMLElement>
      | ((props: ExtendedUserProps) => React.HTMLProps<HTMLElement>);
    trigger?: React.HTMLProps<Element>;
};

export type ReferenceType = Element | VirtualElement;

export type UseFloatingData = Prettify<UseFloatingReturn>;

export type UseFloatingReturn = Prettify<
  UsePositionFloatingReturn & {
      /**
       * `FloatingContext`
       */
      context: Prettify<FloatingContext>;
      /**
       * Object containing the reference and floating refs and reactive setters.
       */
      refs: ExtendedRefs;
      elements: ExtendedElements;
  }
>;

export type UseFloatingOptions = {
    rootContext?: FloatingRootContext;
    /**
     * Object of external elements as an alternative to the `refs` object setters.
     */
    elements?: {
    /**
     * Externally passed reference element. Store in state.
     */
        reference?: ReferenceType | null;
        /**
         * Externally passed floating element. Store in state.
         */
        floating?: HTMLElement | null;
    };
    /**
     * An event callback that is invoked when the floating element is opened or
     * closed.
     */
    onOpenChange?: (open: boolean, eventDetails: HeadlessUIChangeEventDetails<string>) => void;
    /**
     * Unique node id when using `FloatingTree`.
     */
    nodeId?: string;
    /**
     * External FlatingTree to use when the one provided by context can't be used.
     */
    externalTree?: FloatingTreeStore;
} & Omit<UsePositionOptions, 'elements'>;
