'use client';
import { list } from '@flippo-software/component-styles/list';
import { List as Primitive } from '@flippo-ui/headless-components/list';

import { createStyler } from '../../lib/Styled';

import type { StyledComponent } from '../../lib/Styled';

const styled = createStyler(list, 'list');
export const Root: StyledComponent<typeof Primitive.Root, typeof list> = styled(Primitive.Root, 'root');
export const Item: StyledComponent<typeof Primitive.Item, typeof list> = styled(Primitive.Item, 'item');
export const Marker: StyledComponent<typeof Primitive.Marker, typeof list> = styled(Primitive.Marker, 'marker');
export const Subheader: StyledComponent<typeof Primitive.Subheader, typeof list> = styled(Primitive.Subheader, 'subheader');
