import type * as React from 'react';

import { popover as recipe } from '@flippo-software/component-styles/popover';

import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, Button, Icon, Popover } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

const PEOPLE = () =>
    [
        [t('common.eg'), t('common.egorGorochkin'), t('popover.content.owner')],
        [t('common.nz'), t('popover.content.nastyaZavalova'), t('popover.content.3Cards')],
        [t('common.rs'), t('popover.content.robertShumelov'), t('popover.content.1Card')]
    ] as const;

function Participants(props: Props & { side?: 'top' | 'bottom' | 'left' | 'right' }): React.JSX.Element {
    const { side, ...rest } = props;
    return (
        <Popover.Root {...rest}>
            <Popover.Trigger render={<Button variant='secondary' />}>
                <Icon name='person-add' />
                {t('popover.content.6Members')}
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner side={side}>
                    <Popover.Popup>
                        <Popover.Arrow />
                        <Popover.Title>{t('popover.content.setMembers')}</Popover.Title>
                        <Popover.Description>{t('popover.content.3Of7Cards')}</Popover.Description>
                        <div className='sb-items sb-items--column' style={{ gap: 10, marginBlock: 6 }}>
                            {PEOPLE().map(([initials, name, note]) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Avatar.Root size='small'>
                                        <Avatar.Fallback>{initials}</Avatar.Fallback>
                                    </Avatar.Root>
                                    <span style={{ display: 'grid' }}>
                                        <span style={{ color: 'var(--fl-color-text-primary)' }}>{name}</span>
                                        <span className='sb-caption'>{note}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Button size='small'>
                            <Icon name='person-add' />

                            {t('common.invite')}
                        </Button>
                        <Popover.Close aria-label={t('common.close')} />
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Participants {...args} />
        </div>
    );
}

const meta = {
    title: 'Overlays/Popover',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: { component: 'popover.description' }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('popover.sections.sides.title')} description={t('popover.sections.sides.description')}>
                <Row label='side'>
                    <Participants side='bottom' />
                    <Participants side='top' />
                    <Participants side='right' />
                </Row>
            </Section>
        </Page>
    )
};
