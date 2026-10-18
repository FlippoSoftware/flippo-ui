import type * as React from 'react';

import { input as recipe } from '@flippo-software/component-styles/input';

import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Search(props: Props & { defaultValue?: string; placeholder?: string; invalid?: boolean }): React.JSX.Element {
    const { invalid, placeholder = t('input.content.search'), ...rest } = props;
    return (
        <Input.Root {...rest} placeholder={placeholder}>
            <Input.Body data-invalid={invalid ? '' : undefined}>
                <Input.Icon aria-hidden='true' />
                <Input.Slot aria-label={placeholder} aria-invalid={invalid} />
                <Input.Clear aria-label={t('common.clear')} />
            </Input.Body>
        </Input.Root>
    );
}

function Plain(props: Props & { defaultValue?: string; placeholder?: string }): React.JSX.Element {
    return (
        <Input.Root placeholder={t('common.setName')} {...props}>
            <Input.Body>
                <Input.Slot aria-label={t('common.setName')} />
            </Input.Body>
        </Input.Root>
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
    title: 'Forms/Input',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'input.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function States(props: Props): React.JSX.Element {
    return (
        <>
            <Row fill={true} label='blank'>
                <Search {...props} />
            </Row>
            <Row fill={true} label='filled'>
                <Search {...props} defaultValue={t('common.uxLaws')} />
            </Row>
            <Row fill={true} label='wrong'>
                <Search {...props} defaultValue={t('input.content.jakobSLa')} invalid={true} />
            </Row>
            <Row fill={true} label='disabled'>
                <Search {...props} defaultValue={t('common.disabled')} disabled={true} />
            </Row>
        </>
    );
}

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Light' description={t('input.sections.light.description')}>
                <States appearance='light' />
            </Section>
            <Section title='Inverted' description={t('input.sections.inverted.description')} raised={true}>
                <States appearance='inverted' />
            </Section>
            <Section title={t('input.sections.sizes.title')} description={t('input.sections.sizes.description')}>
                {(['large', 'medium', 'small'] as const).map((size) => (
                    <Row key={size} fill={true} label={size}>
                        <Search size={size} defaultValue={t('common.jakobSLaw')} />
                    </Row>
                ))}
            </Section>
            <Section title='Underline' description={t('input.sections.underline.description')}>
                <Row fill={true} label='visible line'>
                    <Plain appearance='underline' defaultValue={t('common.uxLawsExam')} />
                </Row>
                <Row fill={true} label='invisible line'>
                    <Plain appearance='underline-invisible' defaultValue={t('common.uxLawsExam')} />
                </Row>
                <Row fill={true} label='blank'>
                    <Plain appearance='underline' placeholder={t('input.placeholders.enterATitle')} />
                </Row>
            </Section>
        </Page>
    )
};
