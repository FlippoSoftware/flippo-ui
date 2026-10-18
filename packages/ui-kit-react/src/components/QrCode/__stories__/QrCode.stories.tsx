import * as React from 'react';

import { qrCode as recipe } from '@flippo-software/component-styles/qr-code';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, QrCode, Spinner } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { value?: string; size?: number };

const SET_URL = 'https://flippo.app/s/ux-laws-exam';

function Overlay(): React.JSX.Element {
    return (
        <QrCode.Overlay>
            {({ status }) =>
                status === 'error' ? (
                    <span style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
                        <Icon name='circle-xmark-fill' />

                        {t('qrCode.content.couldNotCreateThe')}
                    </span>
                ) : (
                    <Spinner aria-label={t('qrCode.labels.creatingTheCode')} />
                )
            }
        </QrCode.Overlay>
    );
}

function Share(props: Props & { onGenerate?: () => Promise<void> }): React.JSX.Element {
    const { value = SET_URL, size = 200, ...rest } = props;
    return (
        <QrCode.Root {...rest} value={value} size={size}>
            <QrCode.Frame />
            <Overlay />
            <QrCode.Actions>
                <QrCode.DownloadTrigger>
                    <Icon name='arrow-outward' />

                    {t('qrCode.content.download')}
                </QrCode.DownloadTrigger>
                <QrCode.ClipboardTrigger>
                    <Icon name='copy' />

                    {t('qrCode.content.copy')}
                </QrCode.ClipboardTrigger>
            </QrCode.Actions>
        </QrCode.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Share {...args} />
        </div>
    );
}

const BRAND = {
    '--fl-qr-code-color': 'var(--fl-color-brand-light)',
    '--fl-qr-code-corner-color': 'var(--fl-color-brand-light-subtle)'
} as React.CSSProperties;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Regenerates on demand with a slow `onGenerate`, so the loading overlay is visible. */
function Regenerate(): React.JSX.Element {
    const [key, setKey] = React.useState(0);
    return (
        <div className='sb-items sb-items--column' style={{ alignItems: 'center' }}>
            <Share key={key} size={160} onGenerate={() => wait(1500)} />
            <Button size='small' variant='label' onClick={() => setKey((current) => current + 1)}>
                <Icon name='shuffle' />

                {t('qrCode.content.regenerate')}
            </Button>
        </div>
    );
}

const meta = {
    title: 'Display/QrCode',
    component: Example,
    args: { value: SET_URL, size: 200 },
    argTypes: {
        ...variantControls(recipe),
        value: { control: 'text' },
        size: { control: { type: 'range', min: 120, max: 320, step: 20 } }
    },
    parameters: {
        docs: {
            description: {
                component: 'qrCode.description'
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
            <Section title={t('qrCode.sections.sizes.title')}>
                <Row label='size'>
                    <QrCode.Root value={SET_URL} size={120}>
                        <QrCode.Frame />
                    </QrCode.Root>
                    <QrCode.Root value={SET_URL} size={180}>
                        <QrCode.Frame />
                    </QrCode.Root>
                </Row>
            </Section>
            <Section title={t('qrCode.sections.states.title')} description={t('qrCode.sections.states.description')}>
                <Row label='loading'>
                    <Regenerate />
                </Row>
                <Row label='error'>
                    <Share size={160} onGenerate={() => Promise.reject(new Error('offline'))} />
                </Row>
            </Section>
            <Section title={t('qrCode.sections.customColour.title')} description={t('qrCode.sections.customColour.description')}>
                <Row label='brand'>
                    <QrCode.Root value={SET_URL} size={140} style={BRAND}>
                        <QrCode.Frame />
                    </QrCode.Root>
                </Row>
            </Section>
        </Page>
    )
};
