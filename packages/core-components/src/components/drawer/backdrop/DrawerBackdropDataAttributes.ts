export enum DrawerBackdropDataAttributes {
    /**
     * Present when the drawer is open.
     */
    open = 'data-open',
    /**
     * Present when the drawer is closed.
     */
    closed = 'data-closed',
    /**
     * Present when the backdrop is animating in.
     */
    starting = 'data-starting',
    /**
     * Present when the backdrop is animating out.
     */
    ending = 'data-ending',
    /**
     * Present when the drawer has snap points.
     */
    snapPoints = 'data-snap-points',
    /**
     * Present when the drawer is dismissed by swiping right.
     */
    swipeDirectionRight = 'data-swipe-direction-right',
    /**
     * Present when the drawer is dismissed by swiping left.
     */
    swipeDirectionLeft = 'data-swipe-direction-left',
    /**
     * Present when the drawer is dismissed by swiping up.
     */
    swipeDirectionUp = 'data-swipe-direction-up',
    /**
     * Present when the drawer is dismissed by swiping down.
     */
    swipeDirectionDown = 'data-swipe-direction-down'
}
