/**
 * Helpers shared by the stories of the kit (`~@stories`): the gallery layout and the controls of the recipe
 * variants. Stories import the kit itself from `~@src`.
 */

// Texts of the stories by key, in the toolbar's language (`tools/storybook/i18n.ts`).
export { t } from '@flippo-software/workspace-tools/storybook/i18n';

export type { RecipeVariants } from '~@lib/Styled';

export { variantControls } from './controls';
export { Card, Grid, Page, Resizable, Row, Section } from './kit';
