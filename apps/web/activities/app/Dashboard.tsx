import { DashboardSchedule, getUserSchedules } from "@/app/actions/calendar";
import { createClient } from "@/lib/supabase/client";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Card,
    CardHeader,
    CardTitle,
    ShareCalendarDialog,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@repo/ui";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { User } from "@supabase/supabase-js";
import { Calendar, CheckCircle, LogOut, MoreVertical, Plus, Settings, Share2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useFlow } from "../../stackflow";

type DashboardProps = {};

export default function Dashboard({ }: DashboardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [mySchedules, setMySchedules] = useState<DashboardSchedule[]>([]);
    const [joinedSchedules, setJoinedSchedules] = useState<DashboardSchedule[]>([]);
    const [loading, setLoading] = useState(true);

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
        push("Create", {});
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
        push("Join", { id });
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
                className="flex items-center -space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    handleParticipantClick(participants, totalCount);
                }}
            >
                {displayParticipants.map((p, i) => (
                    <div key={i} className="relative w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden" title={p.name}>
                        {p.avatarUrl ? (
                            <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] text-gray-600 font-medium">{p.name[0]}</span>
                        )}
                    </div>
                ))}
                {showMore && (
                    <div className="relative w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center z-10">
                        <span className="text-[10px] text-gray-600 font-medium">+{extraCount}</span>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        // Simple loading state
        return (
            <AppScreen>
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AppScreen>
        );
    }

    return (
        <AppScreen>
            <div className="flex flex-col flex-1 bg-gray-50 min-h-screen pb-20">
                {/* Header Section */}
                <div className="bg-white p-6 border-b">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={userAvatarUrl} alt={userName} />
                            <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                {userName.slice(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-gray-500 text-sm">반갑습니다!</p>
                            <h1 className="text-2xl font-bold">안녕하세요, {userName}님</h1>
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 text-lg font-medium shadow-sm"
                        onClick={handleCreateSchedule}
                    >
                        <Plus className="mr-2 h-5 w-5" /> 새 일정 만들기
                    </Button>
                </div>

                <div className="flex-1 p-4 space-y-8 overflow-y-auto">

                    {/* My Created Schedules */}
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                내가 만든 일정
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {mySchedules.length > 0 ? (
                                mySchedules.map((schedule) => (
                                    <Card
                                        key={schedule.id}
                                        className="overflow-hidden border-none shadow-md cursor-pointer transition-colors hover:bg-gray-50"
                                        onClick={() => handleCardClick(schedule.id)}
                                    >
                                        <CardHeader className="pb-4 bg-white">
                                            <div className="flex justify-between items-center mb-3">
                                                <CardTitle className="text-base">{schedule.title}</CardTitle>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                                        onClick={(e) => { e.stopPropagation(); handleShare(schedule.id); }}
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                                        onClick={(e) => { e.stopPropagation(); handleMenuOpen(schedule.id); }}
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center">
                                                    {schedule.participantCount > 0 ? (
                                                        <ParticipantFacepile participants={schedule.participants} totalCount={schedule.participantCount} />
                                                    ) : (
                                                        <div className="text-xs text-gray-400">참여자 없음</div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    {schedule.deadline ? `마감: ${schedule.deadline}` : "마감일 없음"}
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                                    <p className="text-gray-500 text-sm">만든 일정이 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Joined Schedules */}
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                참여 중인 일정
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {joinedSchedules.length > 0 ? (
                                joinedSchedules.map((schedule) => (
                                    <Card
                                        key={schedule.id}
                                        className="border-none shadow-sm bg-white cursor-pointer transition-colors hover:bg-gray-50"
                                        onClick={() => handleCardClick(schedule.id)}
                                    >
                                        <CardHeader className="p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold text-sm mb-1">{schedule.title}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {schedule.deadline ? `마감: ${schedule.deadline}` : "마감일 없음"}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    {schedule.participantCount > 0 ? (
                                                        <ParticipantFacepile participants={schedule.participants} totalCount={schedule.participantCount} />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">참여자 없음</span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                                    <p className="text-gray-500 text-sm">참여 중인 일정이 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="pt-4 flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 text-sm"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> 로그아웃
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
                <SheetContent side="bottom" className="rounded-t-xl">
                    <SheetHeader className="mb-4">
                        <SheetTitle>일정 관리</SheetTitle>
                        <SheetDescription>
                            원하는 작업을 선택해주세요.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 pb-6">
                        <Button
                            variant="outline"
                            className="w-full h-12 text-base justify-start px-4"
                            onClick={() => {
                                if (menuScheduleId) {
                                    setMenuOpen(false);
                                    push("Modify", { id: menuScheduleId });
                                }
                            }}
                        >
                            <Settings className="mr-3 h-5 w-5 text-gray-500" />
                            일정 수정하기
                        </Button>
                        <Button
                            className="w-full h-12 text-base justify-start px-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => menuScheduleId && handleConfirm(menuScheduleId)}
                        >
                            <CheckCircle className="mr-3 h-5 w-5" />
                            일정 확정 하기
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={participantSheetOpen} onOpenChange={setParticipantSheetOpen}>
                <SheetContent side="bottom" className="rounded-t-xl h-[48vh]">
                    <SheetHeader className="mb-4">
                        <SheetTitle>참여자 목록 ({selectedParticipantCount}명)</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto h-full pb-6 content-start">
                        {selectedParticipants.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={p.avatarUrl || ""} alt={p.name} />
                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                        {p.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-medium text-sm truncate">
                                        {p.name}
                                    </span>
                                    {user && p.userId === user.id && (
                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded-full flex-shrink-0">나</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </AppScreen>
    );
}
