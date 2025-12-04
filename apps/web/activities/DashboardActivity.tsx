import { AppScreen } from "@stackflow/plugin-basic-ui";

type DashboardActivity = {};

export default function DashboardActivity({}: DashboardActivity) {
  return (
    <AppScreen>
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4">
          <h1 className="text-2-xl font-bold">대시보드 페이지</h1>
          <p className="mt-2">내가 만들거나 참여한 약속 목록을 봅니다.</p>
        </div>
      </div>
    </AppScreen>
  );
}
