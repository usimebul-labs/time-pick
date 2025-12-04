import { AppScreen } from "@stackflow/plugin-basic-ui";

type ShareLinkActivity = {};

export default function ShareLinkActivity({}: ShareLinkActivity) {
  return (
    <AppScreen>
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold">약속 생성 완료 및 공유 페이지</h1>
          <p className="mt-2">생성된 참여용 링크와 관리용 링크를 보여줍니다.</p>
        </div>
      </div>
    </AppScreen>
  );
}
