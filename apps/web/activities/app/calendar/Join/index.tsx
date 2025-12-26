'use client';

import { ActivityLayout } from "@/common/components/ActivityLayout";
import { GuestForm } from "./components/GuestForm";
import { JoinHeader } from "./components/JoinHeader";
import { useJoin } from "./hooks/useJoin";

export default function Join({ params: { id } }: { params: { id: string } }) {
    const {
        name,
        setName,
        loading,
        calendarTitle,
        hostName,
        hostAvatar,
        handleSubmit,
        handleLoginRedirect
    } = useJoin(id);

    return (
        <ActivityLayout title="모임 참여">
            <div className="flex flex-col h-full bg-slate-50 p-6">
                <div className="flex-1 flex flex-col justify-start max-w-sm mx-auto w-full pt-10">
                    <JoinHeader
                        hostAvatar={hostAvatar}
                        hostName={hostName}
                        calendarTitle={calendarTitle}
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
        </ActivityLayout>
    );
}
