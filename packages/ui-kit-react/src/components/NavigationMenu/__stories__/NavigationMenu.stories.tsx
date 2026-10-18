import type * as React from 'react';

import { navigationMenu as recipe } from '@flippo-software/component-styles/navigation-menu';

import type { Meta, StoryObj } from '@storybook/react';

import { NavigationMenu } from '~@src';
import { Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Site(props: Props): React.JSX.Element {
    return (
        <NavigationMenu.Root {...props}>
            <NavigationMenu.List>
                <NavigationMenu.Item value='learn'>
                    <NavigationMenu.Trigger>
                        {t('navigationMenu.content.learn')}
                        <NavigationMenu.Icon />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 220px))', gap: 4 }}>
                            <NavigationMenu.Link href='#sets'>
                                {t('navigationMenu.content.sets')}
                                <NavigationMenu.LinkDescription>
                                    {t('navigationMenu.content.cardsOnTopicsFrom')}
                                </NavigationMenu.LinkDescription>
                            </NavigationMenu.Link>
                            <NavigationMenu.Link href='#repeat'>
                                {t('navigationMenu.content.review')}
                                <NavigationMenu.LinkDescription>
                                    {t('navigationMenu.content.spacedRepetitionForToday')}
                                </NavigationMenu.LinkDescription>
                            </NavigationMenu.Link>
                            <NavigationMenu.Link href='#exam'>
                                {t('navigationMenu.content.testYourself')}
                                <NavigationMenu.LinkDescription>{t('navigationMenu.content.aTestOnEvery')}</NavigationMenu.LinkDescription>
                            </NavigationMenu.Link>
                            <NavigationMenu.Link href='#stats'>
                                {t('navigationMenu.content.statistics')}
                                <NavigationMenu.LinkDescription>
                                    {t('navigationMenu.content.progressOverTheWeek')}
                                </NavigationMenu.LinkDescription>
                            </NavigationMenu.Link>
                        </div>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item value='create'>
                    <NavigationMenu.Trigger>
                        {t('navigationMenu.content.create')}
                        <NavigationMenu.Icon />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href='#new'>
                            {t('common.newSet')}
                            <NavigationMenu.LinkDescription>{t('navigationMenu.content.fromScratchOrFrom')}</NavigationMenu.LinkDescription>
                        </NavigationMenu.Link>
                        <NavigationMenu.Link href='#import'>
                            {t('navigationMenu.content.import')}
                            <NavigationMenu.LinkDescription>{t('navigationMenu.content.fromCsvAnkiOr')}</NavigationMenu.LinkDescription>
                        </NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Link
                        href='#community'
                        className='fl-navigation-menu-trigger fl-interactive fl-focus-ring fl-text-body-minus-stronger'
                    >
                        {t('common.community')}
                    </NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Portal>
                <NavigationMenu.Positioner>
                    <NavigationMenu.Popup>
                        <NavigationMenu.Viewport />
                    </NavigationMenu.Popup>
                </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
        </NavigationMenu.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Site {...args} />
        </div>
    );
}

const meta = {
    title: 'Navigation/NavigationMenu',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'navigationMenu.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section
                title={t('navigationMenu.sections.mainNavigation.title')}
                description={t('navigationMenu.sections.mainNavigation.description')}
            >
                <div style={{ minHeight: 260 }}>
                    <Site />
                </div>
            </Section>
        </Page>
    )
};
