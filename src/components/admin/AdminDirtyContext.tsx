'use client';

import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';

interface AdminDirtyValue {
    /** Whether some editor currently has unsaved changes. */
    isDirty: boolean;
    /** Editors call this to publish their dirty state. */
    setDirty: (dirty: boolean) => void;
    /** Returns true if it's safe to navigate away (prompts if dirty). */
    confirmNavigation: () => boolean;
}

export const AdminDirtyContext = createContext<AdminDirtyValue | null>(null);

export const AdminDirtyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDirty, setIsDirty] = useState(false);
    const dirtyRef = useRef(false);

    const setDirty = useCallback((dirty: boolean) => {
        dirtyRef.current = dirty;
        setIsDirty(dirty);
    }, []);

    const confirmNavigation = useCallback(() => {
        if (!dirtyRef.current) return true;
        const ok = window.confirm('You have unsaved changes. Leave this section?');
        if (ok) setDirty(false);
        return ok;
    }, [setDirty]);

    const value = useMemo(
        () => ({ isDirty, setDirty, confirmNavigation }),
        [isDirty, setDirty, confirmNavigation],
    );

    return <AdminDirtyContext.Provider value={value}>{children}</AdminDirtyContext.Provider>;
};
