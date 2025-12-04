import { AppScreen } from "@stackflow/plugin-basic-ui";

type NewScheduleActivity = {};

export default function NewScheduleActivity({}: NewScheduleActivity) {
  return (
    <AppScreen>
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">약속 생성 페이지</h1>
          <p className="mt-2">약속명, 기간, 시간 범위 등을 설정합니다.</p>
        </div>
      </div>
    </AppScreen>
  );
}
