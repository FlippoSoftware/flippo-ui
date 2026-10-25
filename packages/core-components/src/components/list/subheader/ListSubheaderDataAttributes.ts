export enum ListSubheaderDataAttributes {
    /**
     * The nonzero index of the item containing the subheader.
     * @type {number}
     */
    index = 'data-index',
    /**
     * The orientation of the list.
     * @type {'horizontal' | 'vertical'}
     */
    orientation = 'data-orientation',
    /**
     * The nonzero nesting level of the list.
     * @type {number}
     */
    nestedListNumber = 'data-nestedlistnumber',
    /**
     * The nonzero nesting level of the list item.
     * @type {number}
     */
    nestedListItemNumber = 'data-nestedlistitemnumber',
    /**
     * The type of the list.
     */
    type = 'data-type'
}
