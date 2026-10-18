import type * as React from 'react';

import { avatar as recipe } from '@flippo-software/component-styles/avatar';

import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

const PHOTO =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23545be8'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%23fff'/%3E%3Cpath d='M12 80a28 28 0 0 1 56 0' fill='%23fff'/%3E%3C/svg%3E";

function Person(props: Props & { src?: string; initials?: string; name?: string }): React.JSX.Element {
    const { src, initials = t('common.eg'), name = t('common.egorGorochkin'), ...rest } = props;
    return (
        <Avatar.Root {...rest}>
            {src && <Avatar.Image src={src} alt={name} />}
            <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Person {...args} src={PHOTO} />
        </div>
    );
}

const meta = {
    title: 'Display/Avatar',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: { component: 'avatar.description' }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const SIZES = ['x-small', 'small', 'medium', 'large', 'x-large'] as const;
const TEAM = () =>
    [
        [t('common.eg'), PHOTO],
        [t('common.nz'), undefined],
        [t('common.rs'), undefined],
        [t('avatar.content.ak'), PHOTO]
    ] as const;

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('avatar.sections.sizes.title')}>
                <Row label='photo'>
                    {SIZES.map((size) => (
                        <Person key={size} size={size} src={PHOTO} />
                    ))}
                </Row>
                <Row label='initials'>
                    {SIZES.map((size) => (
                        <Person key={size} size={size} />
                    ))}
                </Row>
            </Section>
            <Section title={t('avatar.sections.shape.title')}>
                <Row label='circle'>
                    <Person src={PHOTO} />
                    <Person />
                </Row>
                <Row label='square'>
                    <Person shape='square' src={PHOTO} />
                    <Person shape='square' />
                </Row>
            </Section>
            <Section title={t('avatar.sections.members.title')} description={t('avatar.sections.members.description')}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {TEAM().map(([initials, src], index) => (
                        <span
                            key={initials}
                            style={{
                                marginInlineStart: index ? -8 : 0,
                                borderRadius: '50%',
                                boxShadow: '0 0 0 2px var(--fl-color-bg-0)',
                                display: 'inline-flex'
                            }}
                        >
                            <Person size='small' initials={initials} src={src} />
                        </span>
                    ))}
                    <span className='sb-caption' style={{ marginInlineStart: 8 }}>
                        +2
                    </span>
                </div>
            </Section>
        </Page>
    )
};
