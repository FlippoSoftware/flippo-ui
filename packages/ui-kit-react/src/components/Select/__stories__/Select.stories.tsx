import type * as React from 'react';

import { select as recipe } from '@flippo-software/component-styles/select';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Field, Icon, Select } from '~@src';
import { Grid, Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const FILTERS = (): [string, string][] => [
    ['all', t('common.allCards')],
    ['mine', t('common.mine')],
    ['free', t('common.free')],
    ['assigned', t('select.content.assigned')],
    ['done', t('common.completed')],
    ['repeat', t('select.content.underReview')]
];

function Filter(props: Props & { defaultValue?: string | null; placeholder?: string }): React.JSX.Element {
    const { defaultValue = 'all', placeholder, ...rest } = props;
    return (
        <Select.Root {...rest} defaultValue={defaultValue} items={Object.fromEntries(FILTERS())}>
            <Select.Trigger aria-label={t('select.labels.cardFilter')}>
                <Select.Value placeholder={placeholder} />
                <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
                <Select.Positioner>
                    <Select.Popup>
                        <Select.List>
                            {FILTERS().map(([value, label]) => (
                                <Select.Item key={value} value={value} disabled={value === 'done'}>
                                    <Select.ItemText>{label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.List>
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}

const FOLDERS = (): [string, IconName, string][] => [
    ['self', 'learn', t('common.selfImprovement')],
    ['term', 'folder', t('common.term2')],
    ['exam', 'set', t('select.content.exams')]
];

function Folder(): React.JSX.Element {
    return (
        <Select.Root defaultValue='term' items={Object.fromEntries(FOLDERS().map(([value, , label]) => [value, label]))}>
            <Select.Trigger aria-label={t('select.labels.folder')}>
                <Select.Value />
                <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
                <Select.Positioner>
                    <Select.Popup>
                        <Select.Group>
                            <Select.GroupLabel>{t('select.content.yourFolders')}</Select.GroupLabel>
                            {FOLDERS().map(([value, icon, label]) => (
                                <Select.Item key={value} value={value}>
                                    <Icon name={icon} />
                                    <Select.ItemText>{label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Filter {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Select',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'select.description'
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
            <Section title={t('select.sections.sizes.title')} description={t('select.sections.sizes.description')}>
                {(['large', 'medium', 'small'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <div className='sb-narrow'>
                            <Filter size={size} />
                        </div>
                    </Row>
                ))}
            </Section>
            <Section
                title={t('select.sections.lookAndStates.title')}
                description={t('select.sections.lookAndStates.description')}
                raised={true}
            >
                <Grid min={260}>
                    <Filter appearance='inverted' />
                    <Filter appearance='inverted' defaultValue={null} placeholder={t('select.placeholders.chooseAFilter')} />
                    <Filter appearance='inverted' disabled={true} />
                </Grid>
            </Section>
            <Section title={t('select.sections.withAGroupAnd.title')} description={t('select.sections.withAGroupAnd.description')}>
                <div className='sb-narrow'>
                    <Field.Root>
                        <Field.Label>{t('select.content.folder')}</Field.Label>
                        <Folder />
                    </Field.Root>
                </div>
            </Section>
        </Page>
    )
};
