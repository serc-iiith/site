'use client';

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableListProps<T> {
    items: T[];
    getId: (item: T) => string;
    onReorder: (orderedIds: string[]) => void;
    renderItem: (item: T) => React.ReactNode;
    disabled?: boolean;
}

function Row({
    id,
    disabled,
    children,
}: {
    id: string;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        disabled,
    });
    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
            className="flex items-stretch gap-2"
        >
            <button
                type="button"
                className="flex items-center px-1 text-[color:var(--secondary-color)] cursor-grab active:cursor-grabbing disabled:opacity-30"
                disabled={disabled}
                aria-label="Drag to reorder"
                {...attributes}
                {...listeners}
            >
                <GripVertical size={16} />
            </button>
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );
}

export default function SortableList<T>({
    items,
    getId,
    onReorder,
    renderItem,
    disabled = false,
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const ids = items.map(getId);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;
        onReorder(arrayMove(ids, oldIndex, newIndex));
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    {items.map((item) => (
                        <Row key={getId(item)} id={getId(item)} disabled={disabled}>
                            {renderItem(item)}
                        </Row>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
