import { useDashboardStore } from "../hooks/useDashboardStore";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@repo/ui";

export function DashboardFilter() {
    const { filter, setFilter, sort, setSort } = useDashboardStore();

    const filters = [
        { id: 'all', label: '전체' },
        { id: 'created', label: '내가 만든' },
        { id: 'joined', label: '참여 중' },
        { id: 'confirmed', label: '확정됨' },
    ] as const;

    return (
        <div className="flex flex-col gap-3 mb-4 px-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {filters.map((f) => (
                        <button key={f.id} onClick={() => setFilter(f.id)}
                            className={`
                                whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
                                ${filter === f.id
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }
                            `}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

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
    );
}
