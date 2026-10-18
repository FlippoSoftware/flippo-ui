import * as React from 'react';

import { progress as recipe } from '@flippo-software/component-styles/progress';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Progress } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { value?: number | null; label?: string };

function Bar(props: Props): React.JSX.Element {
    const { value = 65, label = t('progress.content.loadingCards'), ...rest } = props;
    return (
        <Progress.Root {...rest} value={value}>
            <Progress.Label>{label}</Progress.Label>
            <Progress.Value />
            <Progress.Track>
                <Progress.Indicator />
            </Progress.Track>
        </Progress.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-medium'>
            <Bar {...args} />
        </div>
    );
}

function Upload(): React.JSX.Element {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
        if (value === 0 || value >= 100) {
            return;
        }
        const id = setTimeout(() => setValue((current) => Math.min(100, current + 7)), 180);
        return () => clearTimeout(id);
    }, [value]);
    return (
        <div className='sb-items sb-items--column'>
            <Bar value={value} label={value >= 100 ? t('progress.content.setLoaded') : t('progress.content.importFromAFile')} />
            <Button size='small' variant='secondary' onClick={() => setValue(1)} disabled={value > 0 && value < 100}>
                {value >= 100 ? t('progress.content.tryAgain') : t('progress.content.import')}
            </Button>
        </div>
    );
}

const meta = {
    title: 'Feedback/Progress',
    component: Example,
    args: { value: 65 },
    argTypes: { ...variantControls(recipe), value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
    parameters: {
        docs: {
            description: {
                component: 'progress.description'
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
            <Section title={t('progress.sections.states.title')} description={t('progress.sections.states.description')}>
                <Row label='65%' fill={true}>
                    <Bar value={65} />
                </Row>
                <Row label='complete' fill={true}>
                    <Bar value={100} label={t('progress.labels.setLoaded')} />
                </Row>
                <Row label='indeterminate' fill={true}>
                    <Bar value={null} label={t('progress.labels.preparing')} />
                </Row>
            </Section>
            <Section title={t('progress.sections.sizes.title')} description={t('progress.sections.sizes.description')}>
                <Row label='medium' fill={true}>
                    <Bar value={40} size='medium' />
                </Row>
                <Row label='large' fill={true}>
                    <Bar value={40} size='large' />
                </Row>
            </Section>
            <Section title={t('progress.sections.liveExample.title')} description={t('progress.sections.liveExample.description')}>
                <div className='sb-medium'>
                    <Upload />
                </div>
            </Section>
        </Page>
    )
};
