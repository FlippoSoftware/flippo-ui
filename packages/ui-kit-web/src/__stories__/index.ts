/**
 * Helpers shared by the stories of the kit (`~@stories`): the gallery layout, the controls of the recipe variants and
 * the markup builders. Stories import the kit itself from `~@src`.
 */

// Texts of the stories by key, in the toolbar's language (`tools/storybook/i18n.ts`).
export { t } from '@flippo-software/workspace-tools/storybook/i18n';

export { cardText, checkbox, radio, search, textInput, toggleSwitch } from './choice';
export { renderExample, variantControls } from './helpers';
export { button, card, grid, icon, page, resizable, resizableSection, row, section, triggerButton } from './kit';
export { menuCheckbox, menuItem, menuPopup, menuRadio, separator } from './menus';

export type { VariantProps } from './helpers';
