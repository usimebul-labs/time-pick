import { AppScreen } from "@stackflow/plugin-basic-ui";

export default function ConfirmedActivity({ params: { id } }: { params: { id: string } }) {
  return (
    <AppScreen>
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">확정된 약속 상세 페이지</h1>
          <p className="mt-2">최종 확정된 약속 정보를 확인하고 공유합니다.</p>
        </div>
      </div>
    </AppScreen>
  );
}
