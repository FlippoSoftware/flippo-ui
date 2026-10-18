import type * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import {
    Button,
    Checkbox,
    FlippoProvider,
    Icon,
    Input,
    Popover,
    SegmentedControl,
    Select,
    Switch,
    Toggle,
    useControlSize,
    useTheme
} from '~@src';
import { Page, Row, Section, t } from '~@stories';

import type { ControlSize, ThemeSetting } from '~@src';

type Props = { theme: ThemeSetting; size: ControlSize };

const FILTERS = () => ({ all: t('common.allCards'), mine: t('common.mine'), done: t('common.completed') });

// A theme of the story's own. In an application it comes from the stylesheet: `@include fl.theme('sepia', light, …)`.
const SEPIA_CSS = `
[data-theme='sepia'] {
    color-scheme: light;
    --fl-color-bg-0: #efe4cc;
    --fl-color-bg-1: #f6edd9;
    --fl-color-bg-2: #ead9b8;
    --fl-color-bg-3: #fbf5e8;
    --fl-color-text-primary: #3b2f1e;
    --fl-color-text-strong: #2a2114;
}`;

/**
 * A row of mixed controls aligned at the top: the checkbox and the switch (through their labels), the segmented control
 * and the toggle (through their margins) take the height of the row, centred.
 */
function ControlRow(): React.JSX.Element {
    return (
        <div className='sb-items' style={{ alignItems: 'flex-start' }}>
            <Input.Root placeholder={t('common.setName')}>
                <Input.Body>
                    <Input.Slot aria-label={t('common.setName')} />
                </Input.Body>
            </Input.Root>
            <Select.Root defaultValue='all' items={FILTERS()}>
                <Select.Trigger aria-label={t('common.filter')}>
                    <Select.Value />
                    <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                    <Select.Positioner>
                        <Select.Popup>
                            <Select.List>
                                {Object.entries(FILTERS()).map(([value, label]) => (
                                    <Select.Item key={value} value={value}>
                                        <Select.ItemText>{label}</Select.ItemText>
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.List>
                        </Select.Popup>
                    </Select.Positioner>
                </Select.Portal>
            </Select.Root>
            <Checkbox.Label>
                <Checkbox.Root defaultChecked={true}>
                    <Checkbox.Indicator />
                </Checkbox.Root>

                {t('common.mineOnly')}
            </Checkbox.Label>
            <Switch.Label>
                <Switch.Root>
                    <Switch.Thumb />
                </Switch.Root>

                {t('common.hideDone')}
            </Switch.Label>
            <SegmentedControl.Root defaultValue='week' aria-label={t('common.period')}>
                <SegmentedControl.Item value='day'>{t('common.day')}</SegmentedControl.Item>
                <SegmentedControl.Item value='week'>{t('common.week')}</SegmentedControl.Item>
            </SegmentedControl.Root>
            <Toggle aria-label={t('common.favourites')}>
                <Icon name='star' />
            </Toggle>
            <Button>{t('common.find')}</Button>
        </div>
    );
}

/** What the hooks report, and the theme switcher of `useTheme`. */
function Status(): React.JSX.Element {
    const { theme, resolvedTheme, colorScheme, themes, setTheme } = useTheme();
    const { size, height } = useControlSize();
    const select = useControlSize('select');
    return (
        <div className='sb-items sb-items--column' style={{ alignItems: 'flex-start' }}>
            <code>
                useTheme(): theme={theme}, resolvedTheme={resolvedTheme}, colorScheme={colorScheme}
            </code>
            <code>
                useControlSize(): {size}, {height}px · useControlSize(&apos;select&apos;): {select.size}, {select.height}px
            </code>
            <div className='sb-items'>
                {['system', ...themes].map((name) => (
                    <Button key={name} size='small' variant={name === theme ? 'primary' : 'outlined'} onClick={() => setTheme(name)}>
                        {name}
                    </Button>
                ))}
            </div>
        </div>
    );
}

function Example({ theme, size }: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <style>{SEPIA_CSS}</style>
            {/* Scoped: in an application the outermost provider puts the theme on <html>; here the toolbar owns it. */}
            <FlippoProvider scoped={true} theme={theme} size={size} themes={{ sepia: 'light' }}>
                <div
                    className='sb-items sb-items--column'
                    style={{ alignItems: 'stretch', padding: 16, background: 'var(--fl-color-bg-0)' }}
                >
                    <ControlRow />
                    <Status />
                </div>
            </FlippoProvider>
        </div>
    );
}

const meta = {
    title: 'Utilities/FlippoProvider',
    component: Example,
    args: { theme: 'sepia', size: 'medium' },
    argTypes: {
        theme: { control: 'inline-radio', options: ['system', 'light', 'dark', 'sepia'] },
        size: { control: 'inline-radio', options: ['small', 'medium', 'large'] }
    },
    parameters: {
        docs: {
            description: {
                component: 'flippoProvider.description'
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
            <style>{SEPIA_CSS}</style>
            <Section title={t('flippoProvider.sections.sizeGrid.title')} description={t('flippoProvider.sections.sizeGrid.description')}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <FlippoProvider size={size}>
                            <ControlRow />
                        </FlippoProvider>
                    </Row>
                ))}
            </Section>
            <Section title={t('flippoProvider.sections.longLabel.title')} description={t('flippoProvider.sections.longLabel.description')}>
                <Row label='medium'>
                    <div className='sb-items' style={{ alignItems: 'flex-start', maxInlineSize: 560 }}>
                        <Input.Root placeholder='Email'>
                            <Input.Body>
                                <Input.Slot aria-label='Email' />
                            </Input.Body>
                        </Input.Root>
                        <Checkbox.Label style={{ maxInlineSize: 260 }}>
                            <Checkbox.Root>
                                <Checkbox.Indicator />
                            </Checkbox.Root>

                            {t('flippoProvider.content.getNotifiedAboutNew')}
                        </Checkbox.Label>
                    </div>
                </Row>
            </Section>
            <Section
                title={t('flippoProvider.sections.compactLabel.title')}
                description={t('flippoProvider.sections.compactLabel.description')}
            >
                <Row label='compact'>
                    <div className='sb-items sb-items--column' style={{ alignItems: 'flex-start', gap: 4 }}>
                        {[t('common.english'), t('common.german'), t('common.spanish')].map((language) => (
                            <Checkbox.Label key={language} compact={true}>
                                <Checkbox.Root>
                                    <Checkbox.Indicator />
                                </Checkbox.Root>
                                {language}
                            </Checkbox.Label>
                        ))}
                    </div>
                </Row>
            </Section>
            <Section
                title={t('flippoProvider.sections.themeOfAPart.title')}
                description={t('flippoProvider.sections.themeOfAPart.description')}
            >
                {(['dark', 'sepia'] as const).map((theme) => (
                    <Row key={theme} label={theme}>
                        <FlippoProvider scoped={true} theme={theme} themes={{ sepia: 'light' }}>
                            <div style={{ padding: 16, borderRadius: 16, background: 'var(--fl-color-bg-0)' }}>
                                <Popover.Root>
                                    <Popover.Trigger render={<Button variant='secondary' />}>
                                        {t('flippoProvider.content.openPopover')}
                                    </Popover.Trigger>
                                    <Popover.Portal>
                                        <Popover.Positioner sideOffset={8}>
                                            <Popover.Popup>
                                                <Popover.Title>
                                                    {t('flippoProvider.content.theme')} {theme}
                                                </Popover.Title>
                                                <Popover.Description>{t('flippoProvider.content.thePortalIsOutside')}</Popover.Description>
                                            </Popover.Popup>
                                        </Popover.Positioner>
                                    </Popover.Portal>
                                </Popover.Root>
                            </div>
                        </FlippoProvider>
                    </Row>
                ))}
            </Section>
        </Page>
    )
};
