import { ActivityComponentType } from '@stackflow/react';
import { AppScreen } from '@stackflow/plugin-basic-ui';
import { Calendar } from '@repo/ui';
import { useState } from 'react';

const CalendarTest: ActivityComponentType = () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [type, setType] = useState<'monthly' | 'weekly'>('monthly');
    const [minDateStr, setMinDateStr] = useState<string>(formatDate(today));
    const [maxDateStr, setMaxDateStr] = useState<string>(formatDate(lastDayOfMonth));
    const [startHour, setStartHour] = useState<number>(9);
    const [endHour, setEndHour] = useState<number>(18);
    const [enabledDays, setEnabledDays] = useState<string[]>(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

    const minDate = minDateStr ? new Date(minDateStr) : undefined;
    const maxDate = maxDateStr ? new Date(maxDateStr) : undefined;

    const handleDayToggle = (day: string) => {
        setEnabledDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    return (
        <AppScreen appBar={{ title: 'Calendar Test' }}>
            <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
                <div className="flex flex-col gap-4 border p-4 rounded-lg">
                    <h2 className="text-lg font-bold">Controls</h2>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={type === 'monthly'}
                                    onChange={() => setType('monthly')}
                                />
                                Monthly
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={type === 'weekly'}
                                    onChange={() => setType('weekly')}
                                />
                                Weekly
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Enabled Days</label>
                        <div className="flex flex-wrap gap-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <label key={day} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={enabledDays.includes(day)}
                                        onChange={() => handleDayToggle(day)}
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold">Min Date</label>
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={minDateStr}
                                onChange={(e) => setMinDateStr(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold">Max Date</label>
                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={maxDateStr}
                                onChange={(e) => setMaxDateStr(e.target.value)}
                            />
                        </div>
                    </div>

                    {type === 'weekly' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">Start Hour</label>
                                <input
                                    type="number"
                                    className="border p-2 rounded"
                                    min={0}
                                    max={23}
                                    value={startHour}
                                    onChange={(e) => setStartHour(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">End Hour</label>
                                <input
                                    type="number"
                                    className="border p-2 rounded"
                                    min={0}
                                    max={23}
                                    value={endHour}
                                    onChange={(e) => setEndHour(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-h-[400px] border rounded-lg overflow-hidden">
                    <Calendar
                        type={type}
                        selectedDates={selectedDates}
                        onSelectDates={setSelectedDates}
                        minDate={minDate}
                        maxDate={maxDate}
                        startHour={startHour}
                        endHour={endHour}
                        enabledDays={enabledDays}
                    />
                </div>

                <div className="border p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">Selected Dates ({selectedDates.length})</h2>
                    <div className="flex flex-wrap gap-2">
                        {selectedDates.length === 0 ? (
                            <p className="text-gray-500">No dates selected</p>
                        ) : (
                            selectedDates.map((date, index) => (
                                <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                    {date.toLocaleDateString()}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppScreen>
    );
};

export default CalendarTest;
