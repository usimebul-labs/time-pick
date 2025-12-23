export type RankedSlot = {
    rank: number;
    startTime: string; // Formatted for display
    endTime?: string;
    startISO: string;
    endISO?: string;
    participants: string[];
    count: number;
};
