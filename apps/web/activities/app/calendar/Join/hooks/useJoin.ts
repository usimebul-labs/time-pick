import { useCalendarQuery } from "@/common/queries/useCalendarQuery";
import { useFlow } from "@/stackflow";
import { useGuestStore } from "@/common/stores/useGuestStore";
import { useEffect, useState } from "react";

export function useJoin(id: string) {
    const { replace } = useFlow();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        // Defer creation: Save to store and redirect to Select
        useGuestStore.getState().setPendingGuest(id, name);
        replace("Select", { id }, { animate: false });
    };

    const handleLoginRedirect = () => {
        replace("Login", { next: `/app/calendar/${id}` });
    };

    return {
        name,
        setName,
        loading,
        calendarTitle,
        hostName,
        hostAvatar,
        handleSubmit,
        handleLoginRedirect
    };
}
