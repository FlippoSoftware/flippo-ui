import { tabs as recipe } from '@flippo-software/component-styles/tabs';
import * as Primitive from '@flippo-software/web-components/tabs';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const TabsElement: StyledConstructor<typeof Primitive.TabsElement, typeof recipe> = styled(
    Primitive.TabsElement,
    recipe,
    'tabs',
    'root',
    true
);
export const TabsListElement: StyledConstructor<typeof Primitive.TabsListElement, typeof recipe> = styled(
    Primitive.TabsListElement,
    recipe,
    'tabs',
    'list',
    false
);
export const TabsTabElement: StyledConstructor<typeof Primitive.TabsTabElement, typeof recipe> = styled(
    Primitive.TabsTabElement,
    recipe,
    'tabs',
    'tab',
    false
);
export const TabsIndicatorElement: StyledConstructor<typeof Primitive.TabsIndicatorElement, typeof recipe> = styled(
    Primitive.TabsIndicatorElement,
    recipe,
    'tabs',
    'indicator',
    false
);
export const TabsPanelElement: StyledConstructor<typeof Primitive.TabsPanelElement, typeof recipe> = styled(
    Primitive.TabsPanelElement,
    recipe,
    'tabs',
    'panel',
    false
);
export const TabsCountElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'tabs',
    'count'
);
export const elements: {
    readonly root: typeof TabsElement;
    readonly list: typeof TabsListElement;
    readonly tab: typeof TabsTabElement;
    readonly indicator: typeof TabsIndicatorElement;
    readonly panel: typeof TabsPanelElement;
    readonly count: typeof TabsCountElement;
} = {
    root: TabsElement,
    list: TabsListElement,
    tab: TabsTabElement,
    indicator: TabsIndicatorElement,
    panel: TabsPanelElement,
    count: TabsCountElement
} as const;
export function define(options: DefineOptions) {
    registerElements('tabs', elements, options);
}
export type TabsElement = InstanceType<typeof TabsElement>;
export type TabsListElement = InstanceType<typeof TabsListElement>;
export type TabsTabElement = InstanceType<typeof TabsTabElement>;
export type TabsIndicatorElement = InstanceType<typeof TabsIndicatorElement>;
export type TabsPanelElement = InstanceType<typeof TabsPanelElement>;
export type TabsCountElement = InstanceType<typeof TabsCountElement>;
