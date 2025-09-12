import React from 'react';

import { MailGmailIcon, PlusIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { StoryCombine } from '../../StoryCombine';
import { Link } from '../ui/Link';

const meta: Meta<typeof Link> = {
    argTypes: {
        children: { control: 'object', name: 'React.ReactNode' },
        variant: { control: 'select', options: ['neutral', 'brand'] }
    },
    component: Link,
    parameters: {
        docs: {
            description: {
                component:
                    'The component is a wrapper for Link from the atomic-router-react library (https://atomic-router.github.io/react/api/link.html ).'
            }
        }
    },
    title: 'UIKit/Link'
};

export default meta;

type LinkStory = StoryObj<typeof meta>;

const COMMON_ARGS = {
    href: 'http://localhost:6006/?path=/story/uikit-link-link--link-story-combine'
};

const NEUTRAL_ARGS = {
    children: 'Link',
    variant: 'neutral',
    ...COMMON_ARGS
};

export const NeutralLink: LinkStory = {
    args: NEUTRAL_ARGS
};

export const NeutralLinkWithIcon: LinkStory = {
    args: { ...NEUTRAL_ARGS, children: (
        <React.Fragment>
            <PlusIcon />
            { 'Link ' }
        </React.Fragment>
    ) }
};

const BRAND_ARGS = {
    children: 'Link',
    variant: 'brand',
    ...COMMON_ARGS
};

export const BrandLink: LinkStory = {
    args: BRAND_ARGS
};

export const BrandLinkWithIcon: LinkStory = {
    args: {
        ...BRAND_ARGS,
        children: (
            <React.Fragment>
                <PlusIcon />
                {'Link '}
            </React.Fragment>
        )
    }
};

export const BrandLinkWithEmailLogo: LinkStory = {
    args: { ...BRAND_ARGS, children: (
        <React.Fragment>
            <MailGmailIcon />
            {'Link '}
        </React.Fragment>
    ) }
};

const VARIANTS: StoryCombine.Group<Link.Props>['variants'] = [{ components:
    [{ children: 'Link' }], name: 'Default' }, { components: [{ children: (
    <React.Fragment>
        <PlusIcon />
        {'Link '}
    </React.Fragment>
) }], name: 'With an icon' }, { components: [{ children: (
    <React.Fragment>
        <MailGmailIcon />
        {'Link '}
    </React.Fragment>
) }], name: 'With an icon with a built-in fill' }];

const GROUPS: StoryCombine.Props<Link.Props> = {
    args: { href: 'http://localhost:6006/?path=/story/uikit-link-link--link-story-combine' },
    component: Link,
    groups: [{
        groupArgs: {
            variant: 'neutral'
        },
        name: 'Neutral',
        variants: VARIANTS
    }, {
        groupArgs: {
            variant: 'brand'
        },
        name: 'Brand',
        variants: VARIANTS
    }]
};

export const LinkStoryCombine: LinkStory = {
    render: () => <StoryCombine {...GROUPS} />
};
