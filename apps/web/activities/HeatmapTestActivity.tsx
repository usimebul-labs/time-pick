import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActivityComponentType } from "@stackflow/react";
import { Calendar } from "@repo/ui";
import { addDays, setHours, startOfToday } from "date-fns";
import { useState } from "react";

const HeatmapTestActivity: ActivityComponentType = () => {
    const today = startOfToday();
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const totalParticipants = 10;
    const heatmapData: Record<string, { count: number; participants: any[] }> = {
        [today.toISOString()]: { count: 10, participants: [] },
        [addDays(today, 1).toISOString()]: { count: 8, participants: [] },
        [addDays(today, 2).toISOString()]: { count: 5, participants: [] },
        [addDays(today, 3).toISOString()]: { count: 2, participants: [] },
        [addDays(today, 4).toISOString()]: { count: 0, participants: [] },
        [addDays(today, 5).toISOString()]: { count: 12, participants: [] },

        [setHours(today, 10).toISOString()]: { count: 10, participants: [] },
        [setHours(today, 11).toISOString()]: { count: 8, participants: [] },
        [setHours(today, 12).toISOString()]: { count: 5, participants: [] },
        [setHours(today, 14).toISOString()]: { count: 3, participants: [] },

        [setHours(addDays(today, 1), 9).toISOString()]: { count: 7, participants: [] },
        [setHours(addDays(today, 1), 15).toISOString()]: { count: 9, participants: [] },
    };

    return (
        <AppScreen appBar={{ title: "히트맵 테스트" }}>
            <div className="p-4 flex flex-col gap-8 h-full overflow-y-auto pb-20">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Monthly View</h2>
                    <Calendar
                        type="monthly"
                        selectedDates={selectedDates}
                        onSelectDates={setSelectedDates}
                        heatmapData={heatmapData}
                        totalParticipants={totalParticipants}
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Weekly View</h2>
                    <Calendar
                        type="weekly"
                        selectedDates={selectedDates}
                        onSelectDates={setSelectedDates}
                        heatmapData={heatmapData}
                        totalParticipants={totalParticipants}
                        startHour={9}
                        endHour={18}
                    />
                </div>
            </div>
        </AppScreen>
    );
};

export default HeatmapTestActivity;
