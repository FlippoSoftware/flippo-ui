import { DrawerGestureDataAttributes } from '../drag/DrawerGestureDataAttributes';

export enum DrawerPopupDataAttributes {
    open = 'data-open',
    closed = 'data-closed',
    starting = 'data-starting',
    ending = 'data-ending',
    nested = 'data-nested',
    nestedDrawerOpen = 'data-nested-drawer-open',
    dragging = 'data-dragging',
    direction = 'data-direction',

    snapPoints = DrawerGestureDataAttributes.snapPoints,
    swipeDirectionRight = DrawerGestureDataAttributes.swipeDirectionRight,
    swipeDirectionLeft = DrawerGestureDataAttributes.swipeDirectionLeft,
    swipeDirectionUp = DrawerGestureDataAttributes.swipeDirectionUp,
    swipeDirectionDown = DrawerGestureDataAttributes.swipeDirectionDown
}
