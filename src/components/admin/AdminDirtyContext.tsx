'use client';

import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';

interface AdminDirtyValue {
    /** Whether any registered editor currently has unsaved changes. */
    isDirty: boolean;
    /** An editor publishes its dirty state under a stable id. */
    setDirty: (id: string, dirty: boolean) => void;
    /** Returns true if it's safe to navigate away (prompts if anything is dirty). */
    confirmNavigation: () => boolean;
}

export const AdminDirtyContext = createContext<AdminDirtyValue | null>(null);

export const AdminDirtyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dirtyIds = useRef<Set<string>>(new Set());
    const [isDirty, setIsDirty] = useState(false);

    const setDirty = useCallback((id: string, dirty: boolean) => {
        if (dirty) dirtyIds.current.add(id);
        else dirtyIds.current.delete(id);
        setIsDirty(dirtyIds.current.size > 0);
    }, []);

    const confirmNavigation = useCallback(() => {
        if (dirtyIds.current.size === 0) return true;
        return window.confirm('You have unsaved changes. Leave anyway?');
    }, []);

    const value = useMemo(
        () => ({ isDirty, setDirty, confirmNavigation }),
        [isDirty, setDirty, confirmNavigation],
    );

    return <AdminDirtyContext.Provider value={value}>{children}</AdminDirtyContext.Provider>;
};
