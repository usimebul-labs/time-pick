import { useDashboardStore } from "../hooks/useDashboardStore";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@repo/ui";

import { DashboardCalendar } from "@/app/actions/calendar/types";

interface DashboardFilterProps {
    calendars: DashboardCalendar[];
}

export function DashboardFilter({ calendars }: DashboardFilterProps) {
    const { filter, setFilter, sort, setSort, isSelectionMode, toggleSelectionMode, selectedIds, selectAll, unselectAll } = useDashboardStore();

    const filters = [
        { id: 'all', label: '전체' },
        { id: 'created', label: '내가 만든' },
        { id: 'joined', label: '참여 중' },
        { id: 'confirmed', label: '확정됨' },
    ] as const;

    const currentFilterLabel = filters.find(f => f.id === filter)?.label;

    const handleSelectAll = () => {
        if (selectedIds.length === calendars.length) {
            unselectAll();
        } else {
            selectAll(calendars.map(c => c.id));
        }
    };

    // Check if ALL visible calendars are selected
    const isAllSelected = calendars.length > 0 && selectedIds.length === calendars.length;

    return (
        <div className="flex flex-col gap-3 mb-4 px-1">
            <div className="flex items-center justify-between">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 text-lg font-bold text-slate-900 transition-colors focus:outline-none">
                            {currentFilterLabel}
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-32">
                        {filters.map((f) => (
                            <DropdownMenuItem
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`text-sm ${filter === f.id ? 'font-bold' : ''}`}
                            >
                                {f.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-2">
                    {filter === 'created' && (
                        <>
                            {isSelectionMode && (
                                <button
                                    onClick={handleSelectAll}
                                    className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
                                >
                                    {isAllSelected ? "전체 해제" : "전체 선택"}
                                </button>
                            )}
                            <button
                                onClick={toggleSelectionMode}
                                className={`text-xs font-medium transition-colors focus:outline-none ${isSelectionMode ? 'text-red-500 hover:text-red-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {isSelectionMode ? '취소' : '선택'}
                            </button>
                            <div className="w-[1px] h-3 bg-slate-300" />
                        </>
                    )}
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none">
                                {sort === 'created' ? '최신순' : '마감순'}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-24">
                            <DropdownMenuItem
                                onClick={() => setSort('created')}
                                className={`text-xs ${sort === 'created' ? 'font-bold' : ''}`}
                            >
                                최신순
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSort('deadline')}
                                className={`text-xs ${sort === 'deadline' ? 'font-bold' : ''}`}
                            >
                                마감순
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
