import React from 'react';

type GroupCollectionContextValue = {
    items: readonly any[];
};

const GroupCollectionContext = React.createContext<GroupCollectionContextValue | undefined>(undefined);

export function useGroupCollectionContext() {
    return React.use(GroupCollectionContext);
}

export function GroupCollectionProvider(props: GroupCollectionProvider.Props) {
    const { children, items } = props;

    const contextValue = React.useMemo(() => ({ items }), [items]);

    return (
        <GroupCollectionContext.Provider value={contextValue}>
            {children}
        </GroupCollectionContext.Provider>
    );
}

namespace GroupCollectionProvider {
    export type Props = {
        children: React.ReactNode;
        items: readonly any[];
    };
}
