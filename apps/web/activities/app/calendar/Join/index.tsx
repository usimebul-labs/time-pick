'use client';

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { GuestForm } from "./components/GuestForm";
import { JoinHeader } from "./components/JoinHeader";
import { useJoin } from "./useJoin";

export default function Join({ params: { id } }: { params: { id: string } }) {
    const {
        name,
        setName,
        loading,
        eventTitle,
        hostName,
        hostAvatar,
        handleSubmit,
        handleLoginRedirect
    } = useJoin(id);

    return (
        <AppScreen appBar={{ title: "모임 참여" }}>
            <div className="flex flex-col h-full bg-gray-50 p-6">
                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                    <JoinHeader
                        hostAvatar={hostAvatar}
                        hostName={hostName}
                        eventTitle={eventTitle}
                    />

                    <GuestForm
                        name={name}
                        setName={setName}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onLoginRedirect={handleLoginRedirect}
                    />
                </div>
            </div>
        </AppScreen>
    );
}
