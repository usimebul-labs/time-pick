import Holidays from 'date-holidays';

const hd = new Holidays('KR');

export function getHoliday(date: Date) {
    const holiday = hd.isHoliday(date);

    if (!holiday) return null;

    // TypeScript definition seems to imply it returns Array or false.
    if (Array.isArray(holiday)) {
        const publicHoliday = holiday.find(h => h.type === 'public');
        return publicHoliday ? publicHoliday.name : null;
    }

    return null;
}

export function isHoliday(date: Date) {
    return !!getHoliday(date);
}
