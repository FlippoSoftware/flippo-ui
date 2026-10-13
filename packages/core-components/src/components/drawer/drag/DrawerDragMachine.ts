import { effect, untracked } from '@flippo-software/store';

import { getStyleHookProps } from '~@attributes/getStyleHookProps';
import { popupStateMapping } from '~@attributes/popupStateMapping';
import { createChangeEventDetails } from '~@events/changeEventDetails';
import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';
import { mergeProps } from '~@props/mergeProps';

import type { DialogStore } from '~@components/dialog/store/DialogStore';
import type { Props } from '~@props/mergeProps';

import { DrawerPopupStateAttributes } from '../popup/DrawerPopupStateAttributes';

import type { DrawerStore } from '../store/DrawerStore';

import { DrawerGesture } from './DrawerGesture';

import type { DrawerDragEndDetails, DrawerGestureOptions } from './DrawerGesture';

export type DrawerDragOptions = Pick<DrawerGestureOptions, 'closeThreshold' | 'velocityThreshold' | 'scrollLockTimeout'> & {
    onDragEnd?: DrawerGestureOptions['onDragEnd'];
    onDragMove?: DrawerGestureOptions['onDragMove'];
    onDragStart?: DrawerGestureOptions['onDragStart'];
    onActiveSnapPointIndexChange?: ((index: number) => void) | undefined;
};

export type DrawerDragState = {
    dragging: boolean;
    open: boolean;
};

const drawerDragStateAttributesMapping = {
    ...popupStateMapping,
    dragging(value: boolean) {
        return value ? { [DrawerPopupStateAttributes.dragging]: '' } : null;
    }
};

/**
 * State machine of `Drawer.Drag`: the drag handle running the {@link DrawerGesture}.
 */
export class DrawerDragMachine extends Connectable {
    readonly gesture: DrawerGesture;

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<DrawerDragOptions>({} as DrawerDragOptions);

    private get options(): DrawerDragOptions {
        return this.optionsStore.state;
    }

    private set options(options: DrawerDragOptions) {
        this.optionsStore.setState(options);
    }

    private readonly drawerStore: DrawerStore;

    private readonly dialogStore: DialogStore<unknown>;

    constructor(drawerStore: DrawerStore, dialogStore: DialogStore<unknown>, options: DrawerDragOptions = {}) {
        super();
        this.drawerStore = drawerStore;
        this.dialogStore = dialogStore;
        this.options = options;
        this.gesture = new DrawerGesture(this.getGestureOptions());
    }

    protected override onConnect() {
        this.connectChild(this.gesture);
        this.syncDrawerStore();
        this.addCleanup(this.gesture.store.subscribe(() => this.syncDrawerStore()));
        // Follows the drawer and dialog stores (the options read them); applying them reads the gesture's own store.
        this.addCleanup(
            effect(() => {
                const options = this.getGestureOptions();
                untracked(() => this.gesture.setOptions(options));
            })
        );
    }

    setOptions(options: DrawerDragOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
        });
    }

    /**
     * Passes the options to the gesture after a commit.
     */
    afterCommit() {
        this.gesture.setOptions(this.getGestureOptions());
    }

    /**
     * Ref callback for the drag handle.
     */
    setElement = (element: HTMLElement | null) => {
        this.drawerStore.context.dragRef.current = element;
        this.gesture.setOptions(this.getGestureOptions());
    };

    getState(): DrawerDragState {
        return { dragging: this.drawerStore.select('isDragging'), open: this.dialogStore.select('open') };
    }

    static attrs(state: DrawerDragState) {
        return getStyleHookProps(state, drawerDragStateAttributesMapping);
    }

    getDragProps(elementProps: Props = {}): Props {
        return mergeProps(
            {
                onPointerDown: this.gesture.onPointerDown,
                onPointerMove: this.gesture.onPointerMove,
                onPointerUp: this.gesture.onPointerUp
            },
            elementProps,
            { 'aria-hidden': true }
        );
    }

    protected override onDisconnect() {}

    private getGestureOptions(): DrawerGestureOptions {
        const { drawerStore, dialogStore, options } = this;
        return {
            swipeDirection: drawerStore.select('direction'),
            containerRef: drawerStore.select('containerRef'),
            draggableRef: drawerStore.context.dragRef,
            closeThreshold: options.closeThreshold,
            velocityThreshold: options.velocityThreshold,
            scrollLockTimeout: options.scrollLockTimeout,
            enabled: drawerStore.select('shouldDrag') && dialogStore.select('open'),
            snapPoints: drawerStore.select('snapPoints'),
            activeSnapPointIndex: drawerStore.select('activeSnapPointIndex'),
            panel: dialogStore.select('popupElement'),
            onDragEnd: (event, details: DrawerDragEndDetails) => {
                if (details.shouldClose) {
                    dialogStore.setOpen(false, createChangeEventDetails('drag') as never);
                }
                drawerStore.context.dragEnd?.(!details.shouldClose);
                options.onDragEnd?.(event, details);
            },
            onDragMove: options.onDragMove,
            onDragStart: options.onDragStart,
            onActiveSnapPointIndexChange: (index) => {
                drawerStore.setActiveSnapPoint(index);
                options.onActiveSnapPointIndexChange?.(index);
            }
        };
    }

    private syncDrawerStore() {
        const { gesture, drawerStore } = this;
        const wasDragging = drawerStore.select('isDragging');
        drawerStore.update({
            popupStyle: gesture.getStyle(),
            popupDataAttributes: gesture.getDataAttributes()
        });
        if (wasDragging !== gesture.isGesturing) {
            drawerStore.setIsDragging(gesture.isGesturing);
        }
        if (drawerStore.select('dragOffset') !== gesture.offset) {
            drawerStore.setDragOffset(gesture.offset);
        }
    }
}
