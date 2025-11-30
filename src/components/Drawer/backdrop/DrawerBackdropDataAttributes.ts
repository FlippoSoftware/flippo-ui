import { DrawerGestureDataAttributes } from '../drag/DrawerGestureDataAttributes';

export enum DrawerBackdropDataAttributes {
    open = 'data-open',
    closed = 'data-closed',
    starting = 'data-starting',
    ending = 'data-ending',

    snapPoints = DrawerGestureDataAttributes.snapPoints,
    swipeDirectionRight = DrawerGestureDataAttributes.swipeDirectionRight,
    swipeDirectionLeft = DrawerGestureDataAttributes.swipeDirectionLeft,
    swipeDirectionUp = DrawerGestureDataAttributes.swipeDirectionUp,
    swipeDirectionDown = DrawerGestureDataAttributes.swipeDirectionDown
}
