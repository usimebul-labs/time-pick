import { useCalendarQuery } from "@/common/queries/useCalendarQuery";

export function useConfirmInit(id: string) {
    const { data, isLoading } = useCalendarQuery(id);
    const calendar = data?.calendar;
    const participants = data?.participants || [];

    return {
        calendar,
        participants,
        isLoading
    };
}
