import type * as React from 'react';

import { separator as recipe } from '@flippo-software/component-styles/separator';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Separator, Text } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-narrow'>
            <div className='sb-card'>
                <Text weight='stronger'>{t('separator.content.account')}</Text>
                <Separator {...args} />
                <Text weight='stronger'>{t('common.notifications')}</Text>
            </div>
        </div>
    );
}

const meta = {
    title: 'Layout/Separator',
    component: Example,
    args: { spacing: 'small' },
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'separator.description'
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
            <Section title={t('separator.sections.horizontal.title')} description={t('separator.sections.horizontal.description')}>
                {(['none', 'small', 'medium'] as const).map((inset) => (
                    <Row key={inset} label={`inset ${inset}`} fill={true}>
                        <div className='sb-card' style={{ gap: 0 }}>
                            <Text>{t('common.top')}</Text>
                            <Separator inset={inset} spacing='medium' />
                            <Text>{t('common.bottom')}</Text>
                        </div>
                    </Row>
                ))}
            </Section>
            <Section title={t('separator.sections.vertical.title')} description={t('separator.sections.vertical.description')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Button variant='label' iconOnly={true} aria-label={t('common.bold')}>
                        <Icon name='format-bold' />
                    </Button>
                    <Button variant='label' iconOnly={true} aria-label={t('common.italic')}>
                        <Icon name='format-italic' />
                    </Button>
                    <Separator orientation='vertical' spacing='small' inset='small' />
                    <Button variant='label' iconOnly={true} aria-label={t('common.list')}>
                        <Icon name='format-list-ul' />
                    </Button>
                </div>
            </Section>
        </Page>
    )
};
