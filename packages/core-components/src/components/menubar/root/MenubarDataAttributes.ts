export enum MenubarDataAttributes {
    /**
     * The orientation of the menubar.
     * @type {'horizontal' | 'vertical'}
     */
    orientation = 'data-orientation',
    /**
     * Present when the menubar uses modal behaviour.
     */
    modal = 'data-modal',
    /**
     * Whether a submenu is open.
     * @type {'true' | 'false'}
     */
    hasSubmenuOpen = 'data-has-submenu-open'
}
