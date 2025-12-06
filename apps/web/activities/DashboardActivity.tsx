'use client'

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useFlow } from "../stackflow";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui";
import { Plus, Settings, CheckCircle, Calendar, Users, LogOut } from "lucide-react";

type DashboardActivity = {};

// Mock data types
interface Schedule {
  id: string;
  title: string;
  deadline: string; // ISO date string or display string for simplicity
  participantCount: number;
}

const MOCK_MY_SCHEDULES: Schedule[] = [
  {
    id: "1",
    title: "팀 주간 회의",
    deadline: "2024-03-20",
    participantCount: 4,
  },
  {
    id: "2",
    title: "프로젝트 킥오프",
    deadline: "2024-03-25",
    participantCount: 6,
  },
];

const MOCK_JOINED_SCHEDULES: Schedule[] = [
  {
    id: "3",
    title: "디자인 리뷰",
    deadline: "2024-03-22",
    participantCount: 3,
  },
  {
    id: "4",
    title: "점심 약속",
    deadline: "2024-03-21",
    participantCount: 2,
  },
];

export default function DashboardActivity({ }: DashboardActivity) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const { push } = useFlow();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleCreateSchedule = () => {
    push("CreateCalendarActivity", {});
  };

  const handleManage = (id: string) => {
    // console.log("Manage schedule", id);
    // push("ScheduleResultActivity", { schedule_id: id }); // Example path
  };

  const handleConfirm = (id: string) => {
    // console.log("Confirm schedule", id);
    // push("ConfirmScheduleActivity", { schedule_id: id }); // Example path
  };

  const getUserName = (user: User | null) => {
    if (!user) return "게스트";
    // First try user_metadata.full_name or name
    // Then try email username part
    // Finally default to "사용자"
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
              {MOCK_MY_SCHEDULES.length > 0 ? (
                MOCK_MY_SCHEDULES.map((schedule) => (
                  <Card key={schedule.id} className="overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-3 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base mb-1">{schedule.title}</CardTitle>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            마감: {schedule.deadline}
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          {schedule.participantCount}명
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="bg-gray-50 p-2 grid grid-cols-2 gap-2 border-t">
                      <Button variant="outline" size="sm" className="w-full text-xs h-9 bg-white hover:bg-gray-100" onClick={() => handleManage(schedule.id)}>
                        <Settings className="w-3 h-3 mr-1.5" /> 관리하기
                      </Button>
                      <Button size="sm" className="w-full text-xs h-9" onClick={() => handleConfirm(schedule.id)}>
                        <CheckCircle className="w-3 h-3 mr-1.5" /> 확정하기
                      </Button>
                    </CardFooter>
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
              {MOCK_JOINED_SCHEDULES.length > 0 ? (
                MOCK_JOINED_SCHEDULES.map((schedule) => (
                  <Card key={schedule.id} className="border-none shadow-sm bg-white">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-sm mb-1">{schedule.title}</h3>
                          <p className="text-xs text-gray-500">마감: {schedule.deadline}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                            {schedule.participantCount}명 참여 중
                          </span>
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
    </AppScreen>
  );
}
