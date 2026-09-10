import { useCallback, useContext, useEffect } from 'react';
import { AdminDirtyContext } from '@/components/admin/AdminDirtyContext';

/**
 * Guards against losing in-progress edits.
 *
 * Pass whether the current form is dirty. While it is:
 *  - a `beforeunload` handler warns on tab close / reload
 *  - `confirmDiscard()` returns false unless the user confirms (call it before
 *    Cancel, switching records, or switching admin sections)
 *  - the shared AdminDirtyContext is kept in sync so `admin/page.tsx` can block
 *    a section switch
 */
export function useUnsavedChanges(isDirty: boolean) {
    const ctx = useContext(AdminDirtyContext);

    useEffect(() => {
        ctx?.setDirty(isDirty);
        return () => ctx?.setDirty(false);
    }, [isDirty, ctx]);

    useEffect(() => {
        if (!isDirty) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    return useCallback(() => {
        if (!isDirty) return true;
        return window.confirm('You have unsaved changes. Discard them?');
    }, [isDirty]);
}
