import React from 'react';

import { Slider as SliderHeadless } from '@flippo-ui/headless-components/slider';

export function SliderRoot(props: SliderRoot.Props) {
    return <SliderHeadless.Root {...props} />;
}

export namespace SliderRoot {
    export type Props = SliderHeadless.Root.Props;
}
