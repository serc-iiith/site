import React, { useState } from 'react';

// Define event interface
interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    description: string;
    type: 'conference' | 'workshop' | 'seminar' | 'other';
    image: string;
    isPast: boolean;
    presenters?: string[];
    url?: string;
}

interface EventCalendarProps {
    events: Event[];
    onSelectDate: (date: Date) => void;
    currentMonth?: Date;
    onMonthChange?: (date: Date) => void;
}

const EventCalendar = ({
    events,
    onSelectDate,
    currentMonth: propCurrentMonth,
    onMonthChange
}: EventCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(propCurrentMonth || new Date());
    const [hoveredEvents, setHoveredEvents] = useState<Event[]>([]);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    // Get the days in the current month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // Navigate to previous month
    const goToPrevMonth = () => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
        setCurrentMonth(newMonth);
        if (onMonthChange) {
            onMonthChange(newMonth);
        }
    };

    // Navigate to next month
    const goToNextMonth = () => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        setCurrentMonth(newMonth);
        if (onMonthChange) {
            onMonthChange(newMonth);
        }
    };

    // Format the month and year for display
    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Get events for a specific day
    const getEventsForDay = (day: number) => {
        const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day &&
                eventDate.getMonth() === dateToCheck.getMonth() &&
                eventDate.getFullYear() === dateToCheck.getFullYear();
        });
    };

    // Handle day click
    const handleDayClick = (day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onSelectDate(selectedDate);
    };

    // Handle day hover to show event tooltip
    const handleDayHover = (
        e: React.MouseEvent,
        day: number
    ) => {
        const dayEvents = getEventsForDay(day);
        if (dayEvents.length > 0) {
            setHoveredEvents(dayEvents);
            setHoverPosition({ x: e.clientX, y: e.clientY });
        } else {
            setHoveredEvents([]);
        }
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        setHoveredEvents([]);
    };

    // Generate calendar grid
    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
        const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div
                    key={`empty-${i}`}
                    className="h-10 border-[0.5px] border-[var(--border-color)] bg-[var(--foreground)]"
                >
                </div>
            );
        }

        // Add cells for each day in the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDay(day);
            const hasEvent = dayEvents.length > 0;
            const isToday = new Date().getDate() === day &&
                new Date().getMonth() === currentMonth.getMonth() &&
                new Date().getFullYear() === currentMonth.getFullYear();

            days.push(
                <div
                    key={day}
                    className={`h-10 border-[0.5px] border-[var(--border-color)] relative transition-all
                              ${hasEvent ? 'cursor-pointer hover:bg-[var(--primary-color)]/10' : ''}
                              ${isToday ? 'bg-[var(--primary-color)]/5' : 'bg-[var(--foreground)]'}`}
                    onClick={() => hasEvent && handleDayClick(day)}
                    onMouseMove={(e) => handleDayHover(e, day)}
                    onMouseLeave={handleMouseLeave}
                >
                    <span className={`absolute top-1 left-1 text-sm ${isToday ? 'font-bold text-[var(--primary-color)]' : ''}`}>
                        {day}
                    </span>
                    {hasEvent && (
                        <div className={`absolute bottom-1 right-1 h-2 w-2 rounded-full 
                                        ${isToday ? 'bg-[var(--primary-color)]' : 'bg-[var(--info-color)]'}`}>
                        </div>
                    )}
                    {dayEvents.length > 1 && (
                        <div className="absolute bottom-1 left-1 text-xs text-[var(--info-color)] font-medium">
                            +{dayEvents.length}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    // React to prop changes
    React.useEffect(() => {
        if (propCurrentMonth &&
            (propCurrentMonth.getMonth() !== currentMonth.getMonth() ||
                propCurrentMonth.getFullYear() !== currentMonth.getFullYear())) {
            setCurrentMonth(propCurrentMonth);
        }
    }, [propCurrentMonth]);

    return (
        <div className="bg-background rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden">
            {/* Calendar header */}
            <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
                <button
                    onClick={goToPrevMonth}
                    className="p-2 rounded-full hover:bg-[var(--foreground)] transition-colors"
                    aria-label="Previous month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <h3 className="text-[var(--text-color)] font-medium">{formatMonthYear(currentMonth)}</h3>
                <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full hover:bg-[var(--foreground)] transition-colors"
                    aria-label="Next month"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 border-b border-[var(--border-color)]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center py-2 text-xs font-medium text-[var(--tertiary-color)]">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
                {renderCalendarDays()}
            </div>

            {/* Event tooltip */}
            {hoveredEvents.length > 0 && (
                <div
                    className="fixed z-50 bg-[var(--primary-color)] text-white px-3 py-2 rounded shadow-lg pointer-events-none max-w-xs"
                    style={{
                        left: `${hoverPosition.x + 10}px`,
                        top: `${hoverPosition.y + 10}px`
                    }}
                >
                    <div className="max-h-40 overflow-y-auto">
                        {hoveredEvents.map((event, index) => (
                            <div key={event.id} className={index > 0 ? "mt-2 pt-2 border-t border-white/20" : ""}>
                                <p className="font-medium text-sm">{event.title}</p>
                                <p className="text-xs opacity-90">
                                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCalendar;
