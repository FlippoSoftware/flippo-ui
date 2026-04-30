import React from 'react';

import { useForcedRerendering } from '../useForcedRerendering';
import { useIsoLayoutEffect } from '../useIsoLayoutEffect';

export function useTextSelection(): Selection | null {
    const forceUpdate = useForcedRerendering();
    const [selection, setSelection] = React.useState<Selection | null>(null);

    const handleSelectionChange = () => {
        setSelection(document.getSelection());
        forceUpdate();
    };

    useIsoLayoutEffect(() => {
        setSelection(document.getSelection());
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    return selection;
}
