import { AppScreen } from "@stackflow/plugin-basic-ui";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

type DashboardActivity = {};

export default function DashboardActivity({ }: DashboardActivity) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <AppScreen>
      <div className="flex flex-col flex-1 bg-white">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">대시보드 페이지</h1>
          <p className="mt-2 text-gray-600">내가 만들거나 참여한 약속 목록을 봅니다.</p>

          {user && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <p className="font-medium">로그인된 계정:</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="mt-8 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </AppScreen>
  );
}
