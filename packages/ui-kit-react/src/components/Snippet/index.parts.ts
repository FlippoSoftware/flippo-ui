'use client';
import { snippet as recipe } from '@flippo-software/component-styles/snippet';
import { Snippet as Primitive } from '@flippo-ui/headless-components/snippet';

import { icon } from '../../lib/Icon';
import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'snippet');
export type Variants = RecipeVariants<typeof recipe>;
export const CopyButton: StyledComponent<typeof Primitive.CopyButton, typeof recipe> = styled(Primitive.CopyButton, 'copyButton', false, {
    defaults: { children: icon('copy') }
});
export const Line: StyledComponent<typeof Primitive.Line, typeof recipe> = styled(Primitive.Line, 'line', false);
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
const SymbolPart: StyledComponent<typeof Primitive.Symbol, typeof recipe> = styled(Primitive.Symbol, 'symbol', false);

export { SymbolPart as Symbol };
