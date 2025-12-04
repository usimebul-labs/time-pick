import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { useFlow } from '../stackflow';

const MainActivity: ActivityComponentType = () => {
  const { push } = useFlow();

  const onClick = (activityName: any) => {
    push(activityName, {
      id: "123",
    });
  };

  return (
    <AppScreen>
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">TimePick</h1>
          <p className="mt-2">"언제 볼까?"라는 말 대신 링크 하나로. 그룹 스케줄링의 끝판왕.</p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button onClick={() => onClick("NewScheduleActivity")} className="p-4 bg-blue-500 text-white rounded">
              새로운 약속 생성
            </button>
            <button onClick={() => onClick("ShareLinkActivity")} className="p-4 bg-gray-200 rounded">
              공유 페이지 (생성 후)
            </button>
            <button onClick={() => onClick("JoinScheduleActivity")} className="p-4 bg-gray-200 rounded">
              일정 참여
            </button>
            <button onClick={() => onClick("ScheduleResultActivity")} className="p-4 bg-gray-200 rounded">
              결과 확인
            </button>
            <button onClick={() => onClick("ConfirmScheduleActivity")} className="p-4 bg-gray-200 rounded">
              최종 확정 (호스트)
            </button>
            <button onClick={() => onClick("ConfirmedActivity")} className="p-4 bg-gray-200 rounded">
              확정된 약속 상세
            </button>
            <button onClick={() => onClick("LoginActivity")} className="p-4 bg-gray-200 rounded">
              로그인
            </button>
            <button onClick={() => onClick("DashboardActivity")} className="p-4 bg-gray-200 rounded">
              대시보드 (로그인 후)
            </button>
          </div>
        </div>
      </div>
    </AppScreen>
  );
};

export default MainActivity;
