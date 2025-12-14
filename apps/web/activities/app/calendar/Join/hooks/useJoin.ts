import { useEventQuery } from "@/hooks/queries/useEventQuery";
import { useFlow } from "@/stackflow";
import { useGuestStore } from "@/stores/guest";
import { useEffect, useState } from "react";

export function useJoin(id: string) {
    const { replace } = useFlow();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [eventTitle, setEventTitle] = useState<string>("");
    const [hostName, setHostName] = useState<string>("");
    const [hostAvatar, setHostAvatar] = useState<string>("");

    const { data } = useEventQuery(id);
    const event = data?.event;

    useEffect(() => {
        if (event) {
            setEventTitle(event.title);
            setHostName(event.hostName || "");
            setHostAvatar(event.hostAvatarUrl || "");
        }
    }, [event]);

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
        eventTitle,
        hostName,
        hostAvatar,
        handleSubmit,
        handleLoginRedirect
    };
}
