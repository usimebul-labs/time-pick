import { useCalendarQuery } from "@/common/queries/useCalendarQuery";
import { useEffect, useState } from "react";

export function useJoinHeader(id: string) {
    const [calendarTitle, setCalendarTitle] = useState<string>("");
    const [hostName, setHostName] = useState<string>("");
    const [hostAvatar, setHostAvatar] = useState<string>("");

    const { data } = useCalendarQuery(id);
    const calendar = data?.calendar;

    useEffect(() => {
        if (calendar) {
            setCalendarTitle(calendar.title);
            setHostName(calendar.hostName || "");
            setHostAvatar(calendar.hostAvatarUrl || "");
        }
    }, [calendar]);


    return {
        calendarTitle,
        hostName,
        hostAvatar,
    };
}
