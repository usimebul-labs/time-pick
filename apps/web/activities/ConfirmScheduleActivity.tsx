import { AppScreen } from "@stackflow/plugin-basic-ui";

export default function ConfirmScheduleActivity({ params: { id } }: { params: { id: string } }) {
  return (
    <AppScreen>
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">최종 확정 페이지</h1>
          <p className="mt-2">확정된 시간에 장소, 안내사항 등 추가 정보를 입력합니다.</p>
        </div>
      </div>
    </AppScreen>
  );
}
