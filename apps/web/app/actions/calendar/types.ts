
export type CreateCalendarState = {
    message?: string;
    error?: string;
    fieldErrors?: {
        title?: string[];
        startDate?: string[];
        endDate?: string[];
    };
    calendarId?: string;
};

export type DashboardCalendar = {
    id: string;
    title: string;
    deadline: string | null;
    isConfirmed: boolean;
    participants: {
        name: string;
        avatarUrl: string | null;
        userId: string | null;
    }[];
};

export type CalendarDetail = {
    id: string;
    title: string;
    description: string | null;
    type: "monthly" | "weekly";
    startDate: string;
    endDate: string;
    startTime: string | null;
    endTime: string | null;
    excludedDays: number[];
    excludeHolidays: boolean;
    excludedDates: string[];
    deadline: string | null;
    hostId: string | null;
    hostName: string | null;
    hostAvatarUrl: string | null;
    isConfirmed: boolean;
};

export type ParticipantDetail = {
    id: string;
    name: string;
    availabilities: string[]; // Store slots as ISO strings
};

export type ParticipantSummary = {
    id: string;
    name: string;
    avatarUrl: string | null;
    isGuest: boolean;
    availabilities: string[];
    email?: string | null;
    createdAt: string;
};

export type UpdateCalendarState = {
    success?: boolean;
    error?: string;
    conflictedParticipants?: { id: string; name: string }[];
    requiresConfirmation?: boolean;
};

export type ConfirmCalendarState = {
    success?: boolean;
    error?: string;
};

export type ConfirmedCalendarResult = {
    calendar: {
        id: string;
        title: string;
        description: string | null;
    };
    event: {
        startAt: string; // ISO
        endAt: string;   // ISO
        message: {
            location?: string;
            transport?: string;
            parking?: string;
            fee?: string;
            bank?: string;
            inquiry?: string;
            memo?: string;
        } | null;
    };
    participants: ParticipantSummary[]; // Only those in confirmation.participantIds
};
