'use client';
import { card as recipe } from '@flippo-software/component-styles/card';

import { presentation } from '../../lib/Presentation';

import type { Presentation } from '../../lib/Presentation';
export const Root: Presentation<'div', typeof recipe, 'card'> = presentation('div', recipe, 'root', 'card', 'card');
export const Title: Presentation<'h3', typeof recipe, 'box'> = presentation('h3', recipe, 'title', 'box', 'card');
export const Description: Presentation<'p', typeof recipe, 'box'> = presentation('p', recipe, 'description', 'box', 'card');
export const Content: Presentation<'div', typeof recipe, 'box'> = presentation('div', recipe, 'content', 'box', 'card');
export const Footer: Presentation<'div', typeof recipe, 'box'> = presentation('div', recipe, 'footer', 'box', 'card');
