import { AppScreen } from "@stackflow/plugin-basic-ui";

type JoinScheduleActivity = {};

export default function JoinScheduleActivity({}: JoinScheduleActivity) {
  return (
    <AppScreen>
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">일정 참여 페이지</h1>
          <p className="mt-2">닉네임과 PIN 번호를 입력하고, 가능한 시간을 선택합니다.</p>
        </div>
      </div>
    </AppScreen>
  );
}
