import React from 'react';

import { SpinnerIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { QrCode } from '..';
import { Button } from '../../Button';

const meta: Meta<typeof QrCode.Root> = {
    title: 'Widgets/QrCode',
    component: QrCode.Root
};

export default meta;

type QrCodeStory = StoryObj<typeof QrCode.Root>;

export const Default: QrCodeStory = {
    render: (args) => (
        <QrCode.Root
          {...args} onGenerate={async () => { return new Promise((resolve) => setTimeout(resolve, 5000)); }} size={200} value={'https://www.google.com'} options={{
                type: 'svg',
                dotsOptions: {
                    color: 'var(--f-color-text-2)',
                    type: 'extra-rounded'
                },
                backgroundOptions: {
                    color: 'transparent'
                },
                cornersSquareOptions: {
                    color: 'var(--f-color-text-2)',
                    type: 'extra-rounded'
                },
                cornersDotOptions: {
                    color: 'var(--f-color-text-2)',
                    type: 'extra-rounded'
                }
            }}
        >
            <QrCode.Border />
            <QrCode.Frame>
                <QrCode.Overlay>
                    {(props) => {
                        const { status, error } = props;

                        if (status === 'loading') {
                            return <SpinnerIcon width={24} height={24} />;
                        }

                        if (error) {
                            return error.toString();
                        }

                        return null;
                    }}
                </QrCode.Overlay>
            </QrCode.Frame>
        </QrCode.Root>
    )
};
