import { useGuestStore } from "@/common/stores/useGuestStore";
import { useFlow } from "@/stackflow";
import { useState } from "react";

export function useGuestForm(id: string) {
    const { replace } = useFlow();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

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
        handleSubmit,
        handleLoginRedirect
    };
}
