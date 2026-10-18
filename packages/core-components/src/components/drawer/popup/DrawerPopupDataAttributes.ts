export enum DrawerPopupDataAttributes {
    /**
     * Present when the drawer is open.
     */
    open = 'data-open',
    /**
     * Present when the drawer is closed.
     */
    closed = 'data-closed',
    /**
     * Present when the drawer is animating in.
     */
    starting = 'data-starting',
    /**
     * Present when the drawer is animating out.
     */
    ending = 'data-ending',
    /**
     * Present when the drawer is open inside another drawer.
     */
    nested = 'data-nested',
    /**
     * Present when a drawer is open inside this one.
     */
    nestedDrawerOpen = 'data-nested-drawer-open',
    /**
     * Present while the drawer is dragged.
     */
    dragging = 'data-dragging',
    /**
     * The side the drawer is dismissed to.
     * @type {'up' | 'down' | 'left' | 'right'}
     */
    direction = 'data-direction',
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
