import { useIsoLayoutEffect } from '../useIsoLayoutEffect';

export function useDocumentTitle(title: string) {
    useIsoLayoutEffect(() => {
        if (typeof title === 'string' && title.trim().length > 0) {
            document.title = title.trim();
        }
    }, [title]);
}
