import { differenceInCalendarDays, parseISO } from "date-fns";


export const getDDay = (deadline: string) => {
    const today = new Date();
    const target = parseISO(deadline);
    const diff = differenceInCalendarDays(target, today);

    if (diff < 0) return null;

    const isUrgent = diff <= 3;
    const text = diff === 0 ? "D-Day" : `D-${diff}`;

    return text
};