import { DashboardSchedule, getUserSchedules, deleteEvent } from "@/app/actions/calendar";
import { createClient } from "@/lib/supabase/client";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    ShareCalendarDialog,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { User } from "@supabase/supabase-js";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, LogOut, MoreVertical, Plus, Settings, Share2, Users, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFlow } from "../../stackflow";

type DashboardProps = {};

const INITIAL_DISPLAY_COUNT = 3;

export default function Dashboard({ }: DashboardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [mySchedules, setMySchedules] = useState<DashboardSchedule[]>([]);
    const [joinedSchedules, setJoinedSchedules] = useState<DashboardSchedule[]>([]);
    const [loading, setLoading] = useState(true);

    // Show More State
    const [showAllMySchedules, setShowAllMySchedules] = useState(false);
    const [showAllJoinedSchedules, setShowAllJoinedSchedules] = useState(false);

    // Share Dialog State
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareEventId, setShareEventId] = useState<string | null>(null);

    // Menu Sheet State
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuScheduleId, setMenuScheduleId] = useState<string | null>(null);

    // Participant Sheet State
    const [participantSheetOpen, setParticipantSheetOpen] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<{ name: string; avatarUrl: string | null; userId: string | null }[]>([]);
    const [selectedParticipantCount, setSelectedParticipantCount] = useState(0);

    const supabase = createClient();
    const { push } = useFlow();

    useEffect(() => {
        const init = async () => {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // 2. Get Schedules
            if (user) {
                const { mySchedules, joinedSchedules, error } = await getUserSchedules();
                if (error) {
                    console.error(error);
                    // Handle error UI if needed
                } else {
                    setMySchedules(mySchedules);
                    setJoinedSchedules(joinedSchedules);
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    const handleCreateSchedule = () => {
        push("CreateBasicInfo", {});
    };

    const handleManage = (id: string) => {
        setMenuOpen(false); // Close menu if open
        // Navigate to result/management page
        push("Result", { id });
    };

    const handleConfirm = (id: string) => {
        setMenuOpen(false); // Close menu if open
        // Navigate to confirm page
        push("Confirm", { id });
    };

    const handleDelete = async (id: string) => {
        if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
            const { success, error } = await deleteEvent(id);
            if (success) {
                // Remove from state
                setMySchedules(prev => prev.filter(s => s.id !== id));
                setMenuOpen(false);
            } else {
                alert(error || "삭제 중 오류가 발생했습니다.");
            }
        }
    };

    const handleShare = (id: string) => {
        setShareEventId(id);
        setShareDialogOpen(true);
    };

    const handleShareClose = () => {
        setShareDialogOpen(false);
        setShareEventId(null);
    };

    const handleMenuOpen = (id: string) => {
        setMenuScheduleId(id);
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setMenuOpen(false);
        setMenuScheduleId(null);
    };

    const handleParticipantClick = (participants: { name: string; avatarUrl: string | null; userId: string | null }[], count: number) => {
        // Sort participants before showing
        // Priority: 1. Me, 2. Social (userId exists), 3. Guest (userId null)
        const sorted = [...participants].sort((a, b) => {
            const isMeA = user && a.userId === user.id;
            const isMeB = user && b.userId === user.id;
            if (isMeA) return -1;
            if (isMeB) return 1;

            const isSocialA = !!a.userId;
            const isSocialB = !!b.userId;
            if (isSocialA && !isSocialB) return -1;
            if (!isSocialA && isSocialB) return 1;

            return 0; // Keep original order (createdAt) for same type
        });

        setSelectedParticipants(sorted);
        setSelectedParticipantCount(count);
        setParticipantSheetOpen(true);
    };

    const handleCardClick = (id: string) => {
        // Navigate to JoinScheduleActivity (Calendar Screen)
        push("Select", { id });
    };

    const getUserName = (user: User | null) => {
        if (!user) return "게스트";
        const meta = user.user_metadata;
        if (meta?.full_name) return meta.full_name;
        if (meta?.name) return meta.name;
        if (user.email) return user.email.split("@")[0];
        return "사용자";
    };

    const getUserAvatar = (user: User | null) => {
        if (!user) return "";
        return user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
    };


    const userName = getUserName(user);
    const userAvatarUrl = getUserAvatar(user);

    // Derived State for Display
    const displayedMySchedules = showAllMySchedules ? mySchedules : mySchedules.slice(0, INITIAL_DISPLAY_COUNT);
    const displayedJoinedSchedules = showAllJoinedSchedules ? joinedSchedules : joinedSchedules.slice(0, INITIAL_DISPLAY_COUNT);


    // Facepile Component
    const ParticipantFacepile = ({ participants, totalCount }: { participants: { name: string; avatarUrl: string | null; userId: string | null }[], totalCount: number }) => {
        // Sort participants for display
        const sortedParticipants = [...participants].sort((a, b) => {
            const isMeA = user && a.userId === user.id;
            const isMeB = user && b.userId === user.id;
            if (isMeA) return -1;
            if (isMeB) return 1;

            const isSocialA = !!a.userId;
            const isSocialB = !!b.userId;
            if (isSocialA && !isSocialB) return -1;
            if (!isSocialA && isSocialB) return 1;

            return 0;
        });

        const maxDisplay = 5;
        const showMore = totalCount > maxDisplay;
        const displayCount = showMore ? 3 : maxDisplay;
        const displayParticipants = sortedParticipants.slice(0, displayCount);
        const extraCount = totalCount - 3; // If showing more, we show 3 avatars + 1 circle.

        return (
            <div
                className="flex items-center -space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    handleParticipantClick(participants, totalCount);
                }}
            >
                {displayParticipants.map((p, i) => (
                    <div key={i} className="relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-white" title={p.name}>
                        {p.avatarUrl ? (
                            <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] text-gray-600 font-medium">{p.name[0]}</span>
                        )}
                    </div>
                ))}
                {showMore && (
                    <div className="relative w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center z-10 ring-2 ring-white">
                        <span className="text-[10px] text-gray-600 font-bold">+{extraCount}</span>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        // Simple loading state
        return (
            <AppScreen>
                <div className="flex items-center justify-center min-h-screen h-full bg-gray-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AppScreen>
        );
    }

    return (
        <AppScreen>
            <div className="flex flex-col flex-1 bg-[#F8F9FA] min-h-screen h-full pb-20">
                {/* Header Section */}
                <div className="bg-white/80 sticky top-0 z-10 backdrop-blur-md border-b border-gray-100">
                    <div className="p-5 pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                                <p className="text-gray-500 text-sm font-medium mb-0.5">반가워요 👋</p>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{userName}님</h1>
                            </div>
                            <Avatar className="h-10 w-10 ring-2 ring-gray-100 p-0.5">
                                <AvatarImage src={userAvatarUrl} alt={userName} className="rounded-full" />
                                <AvatarFallback className="text-sm bg-indigo-50 text-indigo-600">
                                    {userName.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <Button
                            className="w-full h-12 text-[15px] font-semibold shadow-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 hover:shadow-md transition-all active:scale-[0.98]"
                            onClick={handleCreateSchedule}
                        >
                            <Plus className="mr-2 h-5 w-5" /> 새 일정 만들기
                        </Button>
                    </div>
                </div>

                <div className="flex-1 p-5 space-y-8 overflow-y-auto">
                    {/* My Created Schedules */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                🗓️ 내가 만든 일정
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {displayedMySchedules.length > 0 ? (
                                displayedMySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md hover:border-indigo-100 active:scale-[0.99]"
                                        onClick={() => handleCardClick(schedule.id)}
                                    >
                                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                                                onClick={(e) => { e.stopPropagation(); handleShare(schedule.id); }}
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                                                onClick={(e) => { e.stopPropagation(); handleMenuOpen(schedule.id); }}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <h3 className="text-[17px] font-bold text-gray-900 mb-1 pr-16 leading-tight line-clamp-1">{schedule.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium mb-4">
                                            {schedule.deadline ? `${schedule.deadline} 마감` : "마감일 없음"}
                                        </p>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                            <div className="flex items-center gap-2">
                                                {schedule.participantCount > 0 ? (
                                                    <ParticipantFacepile participants={schedule.participants} totalCount={schedule.participantCount} />
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-medium">아직 참여자가 없어요</span>
                                                )}
                                            </div>
                                            {schedule.participantCount > 0 && (
                                                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-md">
                                                    {schedule.participantCount}명 참여 중
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <Calendar className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">아직 만든 일정이 없어요</p>
                                    <Button variant="link" onClick={handleCreateSchedule} className="text-indigo-600 text-xs font-semibold p-0 h-auto mt-1">
                                        첫 일정을 만들어보세요
                                    </Button>
                                </div>
                            )}

                            {mySchedules.length > INITIAL_DISPLAY_COUNT && (
                                <div className="flex justify-center mt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowAllMySchedules(!showAllMySchedules)}
                                        className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-medium gap-1"
                                    >
                                        {showAllMySchedules ? (
                                            <>접기 <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>더 보기 ({mySchedules.length - INITIAL_DISPLAY_COUNT}) <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Joined Schedules */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                ⭐ 참여 중인 일정
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {displayedJoinedSchedules.length > 0 ? (
                                displayedJoinedSchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md hover:border-indigo-100 active:scale-[0.99]"
                                        onClick={() => handleCardClick(schedule.id)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-base font-bold text-gray-900 line-clamp-1">{schedule.title}</h3>
                                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                                참여함
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 mb-1">참여자</span>
                                                {schedule.participantCount > 0 ? (
                                                    <ParticipantFacepile participants={schedule.participants} totalCount={schedule.participantCount} />
                                                ) : (
                                                    <span className="text-xs text-gray-400">없음</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {schedule.deadline ? `${schedule.deadline} 까지` : "상시"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <Users className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">참여 중인 일정이 없어요</p>
                                </div>
                            )}

                            {joinedSchedules.length > INITIAL_DISPLAY_COUNT && (
                                <div className="flex justify-center mt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowAllJoinedSchedules(!showAllJoinedSchedules)}
                                        className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-medium gap-1"
                                    >
                                        {showAllJoinedSchedules ? (
                                            <>접기 <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>더 보기 ({joinedSchedules.length - INITIAL_DISPLAY_COUNT}) <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="pt-2 flex justify-center pb-8">
                        <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-sm font-medium h-auto py-2 px-4 rounded-full"
                        >
                            로그아웃
                        </Button>
                    </div>
                </div>
            </div>

            <ShareCalendarDialog
                isOpen={shareDialogOpen}
                onClose={handleShareClose}
                link={typeof window !== 'undefined' && shareEventId ? `${window.location.origin}/app/calendar/${shareEventId}` : ''}
            />

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="bottom" className="rounded-t-2xl p-0 overflow-hidden bg-white">
                    <SheetHeader className="p-6 pb-2 text-left">
                        <SheetTitle className="text-xl font-bold">일정 더보기</SheetTitle>
                        <SheetDescription className="text-sm text-gray-500">
                            원하는 작업을 선택해주세요.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 p-6 pt-4">
                        <Button
                            variant="outline"
                            className="w-full h-14 text-base font-medium justify-start px-4 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                            onClick={() => {
                                if (menuScheduleId) {
                                    setMenuOpen(false);
                                    push("Modify", { id: menuScheduleId });
                                }
                            }}
                        >
                            <Settings className="mr-3 h-5 w-5 text-gray-400" />
                            일정 수정하기
                        </Button>
                        <Button
                            className="w-full h-14 text-base font-bold justify-start px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all"
                            onClick={() => menuScheduleId && handleConfirm(menuScheduleId)}
                        >
                            <CheckCircle className="mr-3 h-5 w-5" />
                            약속 확정 하기
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-14 text-base font-medium justify-start px-4 rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                            onClick={() => menuScheduleId && handleDelete(menuScheduleId)}
                        >
                            <Trash2 className="mr-3 h-5 w-5" />
                            일정 삭제하기
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={participantSheetOpen} onOpenChange={setParticipantSheetOpen}>
                <SheetContent side="bottom" className="rounded-t-2xl h-[55vh] p-0 bg-white flex flex-col">
                    <SheetHeader className="p-6 pb-4 border-b border-gray-100 shrink-0">
                        <SheetTitle className="text-lg font-bold">참여자 목록 <span className="text-indigo-600 ml-1">{selectedParticipantCount}명</span></SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-1 gap-1 overflow-y-auto flex-1 p-4 pb-20 content-start">
                        {selectedParticipants.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <Avatar className="h-10 w-10 ring-1 ring-gray-100">
                                    <AvatarImage src={p.avatarUrl || ""} alt={p.name} />
                                    <AvatarFallback className="text-xs bg-indigo-50 text-indigo-600 font-bold">
                                        {p.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900 truncate">
                                            {p.name}
                                        </span>
                                        {user && p.userId === user.id && (
                                            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">나</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {p.userId ? "회원" : "게스트"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </AppScreen>
    );
}
