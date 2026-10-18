import type * as React from 'react';

import { autocomplete as recipe } from '@flippo-software/component-styles/autocomplete';

import type { Meta, StoryObj } from '@storybook/react';

import { Autocomplete, Icon } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const SETS = () => [
    t('common.uxLawsExam'),
    t('common.newSet'),
    'C++',
    t('common.englishB2'),
    t('autocomplete.content.historyOfArt'),
    t('autocomplete.content.psychologyOfPerception')
];

function Search(props: Props): React.JSX.Element {
    return (
        <Autocomplete.Root {...props} items={SETS()}>
            <Autocomplete.InputGroup>
                <Icon name='magnifier' className='fl-combobox-icon' />
                <Autocomplete.Input aria-label={t('common.searchSets')} placeholder={t('common.searchSets')} />
                <Autocomplete.Clear aria-label={t('common.clear')} />
            </Autocomplete.InputGroup>
            <Autocomplete.Portal>
                <Autocomplete.Positioner>
                    <Autocomplete.Popup>
                        <Autocomplete.Empty>{t('autocomplete.content.noSetsFound')}</Autocomplete.Empty>
                        <Autocomplete.List>
                            {(value: string) => (
                                <Autocomplete.Item key={value} value={value}>
                                    <Icon name='set' />
                                    {value}
                                </Autocomplete.Item>
                            )}
                        </Autocomplete.List>
                    </Autocomplete.Popup>
                </Autocomplete.Positioner>
            </Autocomplete.Portal>
        </Autocomplete.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Search {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Autocomplete',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'autocomplete.description'
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
            <Section title={t('autocomplete.sections.searchBar.title')} description={t('autocomplete.sections.searchBar.description')}>
                {(['large', 'medium', 'small'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <div className='sb-medium'>
                            <Search size={size} />
                        </div>
                    </Row>
                ))}
            </Section>
            <Section
                title={t('autocomplete.sections.onACard.title')}
                description={t('autocomplete.sections.onACard.description')}
                raised={true}
            >
                <Row label='inverted'>
                    <div className='sb-medium'>
                        <Search appearance='inverted' />
                    </div>
                </Row>
                <Row label='disabled'>
                    <div className='sb-medium'>
                        <Search appearance='inverted' disabled={true} />
                    </div>
                </Row>
            </Section>
        </Page>
    )
};
