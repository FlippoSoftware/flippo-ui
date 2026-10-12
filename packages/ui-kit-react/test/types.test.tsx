import * as React from 'react';

import { expectTypeOf, it } from 'vitest';

import { Button, Combobox, Select, Text } from '../src';

it('preserves value types, multiple selection and polymorphic presentation refs', () => {
    // TypeScript checks the relationship; these elements need not mount for the assertion.
    const single = (
        <Select.Root
            value='one'
            onValueChange={(value) => {
                expectTypeOf(value).toEqualTypeOf<string | null>();
            }}
            size='small'
        />
    );
    const multiple = (
        <Combobox.Root
            multiple={true}
            value={['one']}
            onValueChange={(value) => {
                expectTypeOf(value).toEqualTypeOf<string[]>();
            }}
            appearance='inverted'
        />
    );
    const text = (
        <Text as='a' href='/profile' ref={React.createRef<HTMLAnchorElement>()}>
            Profile
        </Text>
    );
    const link = <Button href='/profile'>Profile</Button>;
    expectTypeOf(single).toMatchTypeOf<React.ReactElement>();
    expectTypeOf(multiple).toMatchTypeOf<React.ReactElement>();
    expectTypeOf(text).toMatchTypeOf<React.ReactElement>();
    expectTypeOf(link).toMatchTypeOf<React.ReactElement>();
});
