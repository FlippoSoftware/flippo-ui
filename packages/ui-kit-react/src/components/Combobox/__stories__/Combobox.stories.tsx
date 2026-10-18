import type * as React from 'react';

import { combobox as recipe } from '@flippo-software/component-styles/combobox';

import type { Meta, StoryObj } from '@storybook/react';

import { Combobox } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const LAWS = () => [
    t('common.jakobSLaw'),
    t('common.fittsSLaw'),
    t('common.hickSLaw'),
    t('common.lawOfProximity'),
    t('common.millerSLaw'),
    t('common.aestheticEffect'),
    t('common.teslerSLaw')
];

function Laws(props: Props & { multiple?: boolean; defaultValue?: unknown }): React.JSX.Element {
    const { multiple, ...rest } = props;
    return (
        <Combobox.Root {...rest} items={LAWS()} multiple={multiple}>
            <Combobox.InputGroup>
                {multiple ? (
                    <Combobox.Chips>
                        <Combobox.Value>
                            {(values: string[]) =>
                                values.map((value) => (
                                    <Combobox.Chip key={value} aria-label={value}>
                                        <Combobox.ChipLabel>{value}</Combobox.ChipLabel>
                                        <Combobox.ChipRemove aria-label={`${t('combobox.content.remove')} ${value}`} />
                                    </Combobox.Chip>
                                ))
                            }
                        </Combobox.Value>
                        <Combobox.Input aria-label={t('combobox.labels.laws')} placeholder={t('combobox.placeholders.addALaw')} />
                    </Combobox.Chips>
                ) : (
                    <Combobox.Input aria-label={t('combobox.labels.law')} placeholder={t('combobox.placeholders.findALaw')} />
                )}
                <Combobox.Clear aria-label={t('common.clear')} />
                <Combobox.Trigger aria-label={t('combobox.labels.showTheLaws')} />
            </Combobox.InputGroup>
            <Combobox.Portal>
                <Combobox.Positioner>
                    <Combobox.Popup>
                        <Combobox.Empty>{t('combobox.content.nothingFound')}</Combobox.Empty>
                        <Combobox.List>
                            {(value: string) => (
                                <Combobox.Item key={value} value={value}>
                                    {value}
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            )}
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Laws {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Combobox',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'combobox.description'
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
            <Section title={t('combobox.sections.sizes.title')} description={t('combobox.sections.sizes.description')}>
                {(['large', 'medium', 'small'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <div className='sb-medium'>
                            <Laws size={size} />
                        </div>
                    </Row>
                ))}
            </Section>
            <Section title={t('combobox.sections.severalValues.title')} description={t('combobox.sections.severalValues.description')}>
                <div className='sb-medium'>
                    <Laws multiple={true} chips={true} defaultValue={[t('common.jakobSLaw'), t('common.hickSLaw')]} />
                </div>
            </Section>
            <Section title={t('combobox.sections.onACard.title')} description={t('combobox.sections.onACard.description')} raised={true}>
                <Row label='inverted'>
                    <div className='sb-medium'>
                        <Laws appearance='inverted' defaultValue={t('common.fittsSLaw')} />
                    </div>
                </Row>
                <Row label='disabled'>
                    <div className='sb-medium'>
                        <Laws appearance='inverted' disabled={true} defaultValue={t('common.fittsSLaw')} />
                    </div>
                </Row>
            </Section>
        </Page>
    )
};
