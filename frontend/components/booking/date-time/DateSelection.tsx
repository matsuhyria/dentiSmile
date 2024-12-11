'use client';

import Calendar, { TileDisabledFunc } from 'react-calendar';
import './Calendar.css';

interface DateSelectionProps {
    setSelectedDate: (date: Date | null) => void;
    selectedDate: Date | null;
    disabled?: boolean;
    clinicId: string;
    monthlyAvailability: Record<string, number>; // Object mapping dates (ISO format) to availability counts
}

export default function DateSelection({
    setSelectedDate,
    selectedDate,
    disabled,
    monthlyAvailability
}: DateSelectionProps) {
    const isTileDisabled: TileDisabledFunc = ({ date }) => {
        const day = date.getDay();

        // Disable if it's a weekend
        if (day === 0 || day === 6) {
            return true;
        }

        return false;
    };

    function tileClassName({ date }: { date: Date }) {
        const isoDate = date.toISOString().split('T')[0];

        // Highlight dates based on availability
        if (monthlyAvailability[isoDate] && monthlyAvailability[isoDate] > 0) {
            return 'bg-green-50 text-green-700';
        }
        return '';
    }

    return (
        <Calendar
            onChange={(value) => {
                if (!disabled) {
                    if (Array.isArray(value)) {
                        if (value[0]) setSelectedDate(value[0]);
                    } else if (value) {
                        setSelectedDate(value);
                    }
                }
            }}
            value={selectedDate}
            tileDisabled={isTileDisabled}
            tileClassName={tileClassName}
            minDate={new Date()}
        />
    );
}
